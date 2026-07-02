import { sendSuccess } from '../utils/apiResponse.js';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService.js';

const getCategories = async (req, res) => {
  const categories = await getAllCategories();
  sendSuccess(res, { message: 'Categories fetched', data: { categories } });
};

const getCategory = async (req, res) => {
  const category = await getCategoryById(req.params.id);
  sendSuccess(res, { message: 'Category fetched', data: { category } });
};

const addCategory = async (req, res) => {
  const category = await createCategory(req.body, req.file?.path);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Category created',
    data: { category },
  });
};

const editCategory = async (req, res) => {
  const category = await updateCategory(req.params.id, req.body, req.file?.path);
  sendSuccess(res, { message: 'Category updated', data: { category } });
};

const removeCategory = async (req, res) => {
  await deleteCategory(req.params.id);
  sendSuccess(res, { message: 'Category deleted', data: {} });
};

export { getCategories, getCategory, addCategory, editCategory, removeCategory };
