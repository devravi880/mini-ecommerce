import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { formatProduct } from '../utils/formatProduct.js';
import { getProductById } from './productService.js';

const wishlistInclude = {
  product: {
    include: { category: { select: { id: true, name: true, slug: true } } },
  },
};

const formatWishlistItem = (item) => ({
  id: item.id,
  product: formatProduct(item.product),
  createdAt: item.createdAt,
});

const getWishlistItems = async (userId) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: wishlistInclude,
    orderBy: { createdAt: 'desc' },
  });

  return items.map(formatWishlistItem);
};

const addToWishlist = async (userId, productId) => {
  await getProductById(productId);

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId: Number(productId) },
    },
  });

  if (existing) {
    throw new AppError('Product already in wishlist', 409);
  }

  const created = await prisma.wishlistItem.create({
    data: { userId, productId: Number(productId) },
    include: wishlistInclude,
  });

  return formatWishlistItem(created);
};

const removeFromWishlist = async (userId, productId) => {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId: Number(productId) },
    },
  });

  if (!item) {
    throw new AppError('Product not in wishlist', 404);
  }

  await prisma.wishlistItem.delete({ where: { id: item.id } });
};

export { getWishlistItems, addToWishlist, removeFromWishlist };
