import { sendSuccess } from '../utils/apiResponse.js';
import { getDashboardStats } from '../services/dashboardService.js';

const getDashboard = async (req, res) => {
  const stats = await getDashboardStats();
  sendSuccess(res, { message: 'Dashboard stats fetched', data: { stats } });
};

export { getDashboard };
