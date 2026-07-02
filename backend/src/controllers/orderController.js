import { sendSuccess } from '../utils/apiResponse.js';
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} from '../services/orderService.js';

const createOrder = async (req, res) => {
  const order = await placeOrder(req.user.id, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Order placed successfully',
    data: { order },
  });
};

const getOrders = async (req, res) => {
  const orders = await getUserOrders(req.user.id);
  sendSuccess(res, { message: 'Orders fetched', data: { orders } });
};

const getOrder = async (req, res) => {
  const order = await getOrderById(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Order fetched', data: { order } });
};

const cancelUserOrder = async (req, res) => {
  const order = await cancelOrder({
    orderId: req.params.id,
    userId: req.user.id,
  });
  sendSuccess(res, { message: 'Order cancelled successfully', data: { order } });
};

export { createOrder, getOrders, getOrder, cancelUserOrder };
