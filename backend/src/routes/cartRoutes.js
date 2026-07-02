import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getCart,
  addCartItem,
  editCartItem,
  deleteCartItem,
} from '../controllers/cartController.js';

const router = Router();

router.use(protect);

router.get('/', asyncHandler(getCart));
router.post('/', asyncHandler(addCartItem));
router.put('/:id', asyncHandler(editCartItem));
router.delete('/:id', asyncHandler(deleteCartItem));

export default router;
