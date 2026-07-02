import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { formatProduct } from '../utils/formatProduct.js';
import { getProductById } from './productService.js';

const cartInclude = {
  product: {
    include: { category: { select: { id: true, name: true, slug: true } } },
  },
};

const formatCartItem = (item) => ({
  id: item.id,
  quantity: item.quantity,
  product: formatProduct(item.product),
});

const getCartItems = async (userId) => {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: cartInclude,
    orderBy: { createdAt: 'desc' },
  });

  return items.map(formatCartItem);
};

const addToCart = async (userId, { productId, quantity = 1 }) => {
  const product = await getProductById(productId);

  if (product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId: Number(productId) } },
  });

  if (existing) {
    const newQty = existing.quantity + Number(quantity);
    if (product.stock < newQty) {
      throw new AppError('Insufficient stock', 400);
    }

    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
      include: cartInclude,
    });

    return formatCartItem(updated);
  }

  const created = await prisma.cartItem.create({
    data: {
      userId,
      productId: Number(productId),
      quantity: Number(quantity),
    },
    include: cartInclude,
  });

  return formatCartItem(created);
};

const updateCartItem = async (userId, cartItemId, quantity) => {
  const item = await prisma.cartItem.findFirst({
    where: { id: Number(cartItemId), userId },
    include: { product: true },
  });

  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  if (Number(quantity) < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  if (item.product.stock < Number(quantity)) {
    throw new AppError('Insufficient stock', 400);
  }

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: Number(quantity) },
    include: cartInclude,
  });

  return formatCartItem(updated);
};

const removeCartItem = async (userId, cartItemId) => {
  const item = await prisma.cartItem.findFirst({
    where: { id: Number(cartItemId), userId },
  });

  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  await prisma.cartItem.delete({ where: { id: item.id } });
};

const clearCart = async (userId) => {
  await prisma.cartItem.deleteMany({ where: { userId } });
};

export { getCartItems, addToCart, updateCartItem, removeCartItem, clearCart };
