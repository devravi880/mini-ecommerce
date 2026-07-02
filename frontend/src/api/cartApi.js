import api from './axios';

export const getCart = () => api.get('/cart');

export const addToCart = (data) => api.post('/cart', data);

export const updateCartItem = (id, quantity) => api.put(`/cart/${id}`, { quantity });

export const removeCartItem = (id) => api.delete(`/cart/${id}`);
