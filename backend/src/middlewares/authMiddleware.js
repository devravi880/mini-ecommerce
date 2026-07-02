import { verifyToken } from '../utils/jwt.js';
import { getUserById } from '../services/authService.js';
import AppError from '../utils/AppError.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Not authorized, no token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const user = await getUserById(decoded.userId);
    req.user = user;
    next();
  } catch {
    throw new AppError('Not authorized, invalid token', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError('You do not have permission to access this resource', 403);
  }
  next();
};

export { protect, authorize };
