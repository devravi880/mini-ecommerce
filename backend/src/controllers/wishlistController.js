import { sendSuccess } from '../utils/apiResponse.js';
import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from '../services/wishlistService.js';

const getWishlist = async (req, res) => {
  const items = await getWishlistItems(req.user.id);
  sendSuccess(res, { message: 'Wishlist fetched', data: { items } });
};

const addWishlistItem = async (req, res) => {
  const item = await addToWishlist(req.user.id, req.body.productId);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Added to wishlist',
    data: { item },
  });
};

const deleteWishlistItem = async (req, res) => {
  await removeFromWishlist(req.user.id, req.params.productId);
  sendSuccess(res, { message: 'Removed from wishlist', data: {} });
};

export { getWishlist, addWishlistItem, deleteWishlistItem };
