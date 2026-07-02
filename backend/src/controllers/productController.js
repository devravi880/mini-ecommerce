import { sendSuccess } from '../utils/apiResponse.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService.js';

const getProducts = async (req, res) => {
  const products = await getAllProducts(req.query);
  sendSuccess(res, { message: 'Products fetched', data: { products } });
};

const getProduct = async (req, res) => {
  const product = await getProductById(req.params.id);
  sendSuccess(res, { message: 'Product fetched', data: { product } });
};

const addProduct = async (req, res) => {
  const product = await createProduct(req.body, req.file?.path);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Product created',
    data: { product },
  });
};

const editProduct = async (req, res) => {
  const product = await updateProduct(req.params.id, req.body, req.file?.path);
  sendSuccess(res, { message: 'Product updated', data: { product } });
};

const removeProduct = async (req, res) => {
  await deleteProduct(req.params.id);
  sendSuccess(res, { message: 'Product deleted', data: {} });
};

export { getProducts, getProduct, addProduct, editProduct, removeProduct };
