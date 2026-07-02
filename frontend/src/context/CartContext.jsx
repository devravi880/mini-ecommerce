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
  addToCart as addToCartApi,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../api/cartApi';

const CartContext = createContext(null);

function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await getCart();
      setItems(data.data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await addToCartApi({ productId, quantity });
    toast.success('Added to cart');
    await fetchCart();
    return data.data.item;
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await updateCartItem(cartItemId, quantity);
    await fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await removeCartItem(cartItemId);
    toast.success('Removed from cart');
    await fetchCart();
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
