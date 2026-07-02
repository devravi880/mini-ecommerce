import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import slugify from '../utils/slugify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } },
  });
};

const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return category;
};

const createCategory = async ({ name, description }, imagePath) => {
  if (!name) {
    throw new AppError('Category name is required', 400);
  }

  const slug = slugify(name);

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name }, { slug }] },
  });

  if (existing) {
    throw new AppError('Category already exists', 409);
  }

  return prisma.category.create({
    data: {
      name,
      slug,
      description: description || null,
      image: imagePath ? `/uploads/${path.basename(imagePath)}` : null,
    },
  });
};

const updateCategory = async (id, { name, description }, imagePath) => {
  const category = await getCategoryById(id);
  const data = {};

  if (name && name !== category.name) {
    const slug = slugify(name);
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
        NOT: { id: category.id },
      },
    });

    if (existing) {
      throw new AppError('Category name already exists', 409);
    }

    data.name = name;
    data.slug = slug;
  }

  if (description !== undefined) {
    data.description = description || null;
  }

  if (imagePath) {
    if (category.image) {
      const oldPath = path.join(uploadsDir, path.basename(category.image));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    data.image = `/uploads/${path.basename(imagePath)}`;
  }

  return prisma.category.update({
    where: { id: category.id },
    data,
  });
};

const deleteCategory = async (id) => {
  const category = await getCategoryById(id);

  if (category._count.products > 0) {
    throw new AppError('Cannot delete category with existing products', 400);
  }

  if (category.image) {
    const imagePath = path.join(uploadsDir, path.basename(category.image));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  await prisma.category.delete({ where: { id: category.id } });
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
