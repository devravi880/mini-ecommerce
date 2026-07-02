import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import getImageUrl from '../utils/getImageUrl';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../context/WishlistContext';

function Wishlist() {
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      await removeFromWishlist(product.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to move to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <Link to={`/products/${item.product.id}`}>
                <div className="aspect-square bg-gray-100">
                  {item.product.image ? (
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                <p className="mt-1 text-lg font-bold">₹{item.product.price}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item.product)}
                    className="flex-1 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:bg-primary-dark"
                  >
                    Move to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-red-500 hover:bg-gray-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
