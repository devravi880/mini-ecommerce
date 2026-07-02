import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getWishlist,
  addWishlistItem,
  deleteWishlistItem,
} from '../controllers/wishlistController.js';

const router = Router();

router.use(protect);

router.get('/', asyncHandler(getWishlist));
router.post('/', asyncHandler(addWishlistItem));
router.delete('/:productId', asyncHandler(deleteWishlistItem));

export default router;
