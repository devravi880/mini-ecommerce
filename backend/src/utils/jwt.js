import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

export { generateToken, verifyToken };
