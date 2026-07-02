import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { getDashboard } from '../controllers/dashboardController.js';
import {
  getAdminOrders,
  getAdminOrder,
  updateStatus,
} from '../controllers/adminOrderController.js';

const router = Router();

router.use(protect, authorize('ADMIN'));

router.get('/dashboard', asyncHandler(getDashboard));
router.get('/orders', asyncHandler(getAdminOrders));
router.get('/orders/:id', asyncHandler(getAdminOrder));
router.put('/orders/:id/status', asyncHandler(updateStatus));

export default router;
