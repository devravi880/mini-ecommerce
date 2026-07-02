import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const orderInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  orderItems: {
    include: {
      product: {
        select: { id: true, name: true, image: true, price: true },
      },
    },
  },
};

const customerOrderInclude = {
  orderItems: {
    include: {
      product: {
        select: { id: true, name: true, image: true, price: true },
      },
    },
  },
};

const formatOrder = (order) => ({
  ...order,
  totalAmount: Number(order.totalAmount),
  orderItems: order.orderItems?.map((item) => ({
    ...item,
    price: Number(item.price),
    product: item.product
      ? { ...item.product, price: Number(item.product.price) }
      : item.product,
  })),
});

const restoreStock = async (tx, orderItems) => {
  for (const item of orderItems) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
};

const placeOrder = async (userId, shippingData) => {
  const { shippingAddress, city, state, pincode, paymentMethod } = shippingData;

  if (!shippingAddress || !city || !state || !pincode || !paymentMethod) {
    throw new AppError('All shipping details are required', 400);
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
    }
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress,
        city,
        state,
        pincode,
        paymentMethod,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: customerOrderInclude,
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  return formatOrder(order);
};

const getUserOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: customerOrderInclude,
    orderBy: { createdAt: 'desc' },
  });

  return orders.map(formatOrder);
};

const getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: Number(orderId), userId },
    include: customerOrderInclude,
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return formatOrder(order);
};

const getAllOrders = async ({ status } = {}) => {
  const where = {};
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });

  return orders.map(formatOrder);
};

const getAdminOrderById = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return formatOrder(order);
};

const cancelOrder = async ({ orderId, userId, isAdmin = false }) => {
  const where = { id: Number(orderId) };
  if (!isAdmin) where.userId = userId;

  const order = await prisma.order.findFirst({
    where,
    include: { orderItems: true },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.status === 'CANCELLED') {
    throw new AppError('Order is already cancelled', 400);
  }

  if (order.status === 'DELIVERED') {
    throw new AppError('Delivered orders cannot be cancelled', 400);
  }

  if (!isAdmin && order.status !== 'PENDING') {
    throw new AppError('Only pending orders can be cancelled', 400);
  }

  const updated = await prisma.$transaction(async (tx) => {
    await restoreStock(tx, order.orderItems);

    return tx.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
      include: isAdmin ? orderInclude : customerOrderInclude,
    });
  });

  return formatOrder(updated);
};

const updateOrderStatus = async (orderId, status) => {
  if (!ORDER_STATUSES.includes(status)) {
    throw new AppError('Invalid order status', 400);
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: { orderItems: true },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.status === 'CANCELLED') {
    throw new AppError('Cannot update a cancelled order', 400);
  }

  if (status === 'CANCELLED') {
    return cancelOrder({ orderId, isAdmin: true });
  }

  if (order.status === 'DELIVERED') {
    throw new AppError('Delivered orders cannot be updated', 400);
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status },
    include: orderInclude,
  });

  return formatOrder(updated);
};

export {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  getAdminOrderById,
  cancelOrder,
  updateOrderStatus,
};
