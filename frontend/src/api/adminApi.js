import api from './axios';

export const getDashboardStats = () => api.get('/admin/dashboard');

export const getAdminOrders = (params) => api.get('/admin/orders', { params });

export const getAdminOrder = (id) => api.get(`/admin/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status });
