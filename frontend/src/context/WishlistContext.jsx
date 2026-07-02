import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import {
  addToWishlist as addToWishlistApi,
  getWishlist,
  removeFromWishlistAPI,
} from '../api/wishlistApi';

const WishlistContext = createContext(null);

function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await getWishlist();
      setItems(data.data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    await addToWishlistApi(productId);
    toast.success('Added to wishlist');
    await fetchWishlist();
  };

  const removeFromWishlist = async (productId) => {
    await removeFromWishlistAPI(productId);
    toast.success('Removed from wishlist');
    await fetchWishlist();
  };

  const isInWishlist = (productId) =>
    items.some((item) => item.product.id === productId);

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        wishlistCount: items.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export { WishlistProvider, useWishlist };
