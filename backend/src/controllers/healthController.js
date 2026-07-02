import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/apiResponse.js';

const healthCheck = async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  sendSuccess(res, {
    message: 'ShopSphere API is running',
    data: {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    },
  });
};

export { healthCheck };
