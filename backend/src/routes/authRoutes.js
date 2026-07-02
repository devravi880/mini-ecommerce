import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { protect } from '../middlewares/authMiddleware.js';
import { register, login, getMe } from '../controllers/authController.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', protect, asyncHandler(getMe));

export default router;
