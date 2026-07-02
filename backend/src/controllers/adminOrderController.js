import { sendSuccess } from '../utils/apiResponse.js';
import {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} from '../services/orderService.js';

const getAdminOrders = async (req, res) => {
  const orders = await getAllOrders(req.query);
  sendSuccess(res, { message: 'Orders fetched', data: { orders } });
};

const getAdminOrder = async (req, res) => {
  const order = await getAdminOrderById(req.params.id);
  sendSuccess(res, { message: 'Order fetched', data: { order } });
};

const updateStatus = async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body.status);
  sendSuccess(res, { message: 'Order status updated', data: { order } });
};

export { getAdminOrders, getAdminOrder, updateStatus };
