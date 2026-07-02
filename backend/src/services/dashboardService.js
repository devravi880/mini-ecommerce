import { prisma } from '../config/prisma.js';

const getDashboardStats = async () => {
  const [totalUsers, totalProducts, totalCategories, totalOrders, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return {
    totalUsers,
    totalProducts,
    totalCategories,
    totalOrders,
    ordersByStatus,
    recentOrders: recentOrders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
    })),
  };
};

export { getDashboardStats };
