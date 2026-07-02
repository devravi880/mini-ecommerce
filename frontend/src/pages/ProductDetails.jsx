import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import getImageUrl from '../utils/getImageUrl';
import { getProduct } from '../api/productApi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data.data.product);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const requireAuth = () => {
    toast.error('Please login to continue');
    navigate('/login');
    return false;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated && !requireAuth()) return;

    setActionLoading(true);
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated && !requireAuth()) return;

    setActionLoading(true);
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Wishlist action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/products" className="text-sm text-primary hover:underline">
        &larr; Back to Products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="h-full max-h-[500px] w-full object-cover"
            />
          ) : (
            <div className="flex h-80 items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-primary">{product.category.name}</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-gray-900">₹{product.price}</p>
          <p className="mt-2 text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {product.description && (
            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {product.stock > 0 && (
            <div className="mt-8 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={product.stock === 0 || actionLoading}
              onClick={handleAddToCart}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleWishlist}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
