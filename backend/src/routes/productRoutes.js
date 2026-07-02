import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import upload from '../middlewares/uploadMiddleware.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/', asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProduct));

router.post(
  '/',
  protect,
  authorize('ADMIN'),
  upload.single('image'),
  asyncHandler(addProduct)
);

router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  upload.single('image'),
  asyncHandler(editProduct)
);

router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  asyncHandler(removeProduct)
);

export default router;
