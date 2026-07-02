import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import slugify from '../utils/slugify.js';
import { formatProduct, formatProducts } from '../utils/formatProduct.js';
import { getCategoryById } from './categoryService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
};

const getAllProducts = async ({ search, categoryId } = {}) => {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });

  return formatProducts(products);
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: productInclude,
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return formatProduct(product);
};

const createProduct = async (data, imagePath) => {
  const { name, description, price, stock, categoryId } = data;

  if (!name || !price || !categoryId) {
    throw new AppError('Name, price and category are required', 400);
  }

  await getCategoryById(categoryId);

  const slug = slugify(name);
  const existing = await prisma.product.findFirst({
    where: { OR: [{ name }, { slug }] },
  });

  if (existing) {
    throw new AppError('Product already exists', 409);
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      price: Number(price),
      stock: Number(stock) || 0,
      categoryId: Number(categoryId),
      image: imagePath ? `/uploads/${path.basename(imagePath)}` : null,
    },
    include: productInclude,
  });

  return formatProduct(product);
};

const updateProduct = async (id, data, imagePath) => {
  const product = await getProductById(id);
  const updateData = {};

  if (data.name && data.name !== product.name) {
    const slug = slugify(data.name);
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
        NOT: { id: product.id },
      },
    });

    if (existing) {
      throw new AppError('Product name already exists', 409);
    }

    updateData.name = data.name;
    updateData.slug = slug;
  }

  if (data.description !== undefined) {
    updateData.description = data.description || null;
  }

  if (data.price !== undefined) {
    updateData.price = Number(data.price);
  }

  if (data.stock !== undefined) {
    updateData.stock = Number(data.stock);
  }

  if (data.categoryId) {
    await getCategoryById(data.categoryId);
    updateData.categoryId = Number(data.categoryId);
  }

  if (imagePath) {
    if (product.image) {
      const oldPath = path.join(uploadsDir, path.basename(product.image));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    updateData.image = `/uploads/${path.basename(imagePath)}`;
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: updateData,
    include: productInclude,
  });

  return formatProduct(updated);
};

const deleteProduct = async (id) => {
  const product = await getProductById(id);

  if (product.image) {
    const imagePath = path.join(uploadsDir, path.basename(product.image));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  await prisma.product.delete({ where: { id: product.id } });
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
