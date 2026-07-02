import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { protect } from '../middlewares/authMiddleware.js';
import { createOrder, getOrders, getOrder, cancelUserOrder } from '../controllers/orderController.js';

const router = Router();

router.use(protect);

router.post('/', asyncHandler(createOrder));
router.get('/', asyncHandler(getOrders));
router.get('/:id', asyncHandler(getOrder));
router.put('/:id/cancel', asyncHandler(cancelUserOrder));

export default router;
