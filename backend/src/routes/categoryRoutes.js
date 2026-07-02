import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import upload from '../middlewares/uploadMiddleware.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCategory));

router.post(
  '/',
  protect,
  authorize('ADMIN'),
  upload.single('image'),
  asyncHandler(addCategory)
);

router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  upload.single('image'),
  asyncHandler(editCategory)
);

router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  asyncHandler(removeCategory)
);

export default router;
