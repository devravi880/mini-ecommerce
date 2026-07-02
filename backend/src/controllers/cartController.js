import { sendSuccess } from '../utils/apiResponse.js';
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '../services/cartService.js';

const getCart = async (req, res) => {
  const items = await getCartItems(req.user.id);
  sendSuccess(res, { message: 'Cart fetched', data: { items } });
};

const addCartItem = async (req, res) => {
  const item = await addToCart(req.user.id, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Added to cart', data: { item } });
};

const editCartItem = async (req, res) => {
  const item = await updateCartItem(req.user.id, req.params.id, req.body.quantity);
  sendSuccess(res, { message: 'Cart updated', data: { item } });
};

const deleteCartItem = async (req, res) => {
  await removeCartItem(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Item removed from cart', data: {} });
};

export { getCart, addCartItem, editCartItem, deleteCartItem };
