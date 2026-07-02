import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { generateToken } from '../utils/jwt.js';
import { userSelect } from '../utils/userSelect.js';

const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'CUSTOMER',
    },
    select: userSelect,
  });

  const token = generateToken(user.id);

  return { user, token };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user.id);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export { registerUser, loginUser, getUserById };
