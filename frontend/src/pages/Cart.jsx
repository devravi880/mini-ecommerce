import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import getImageUrl from '../utils/getImageUrl';
import { useCart } from '../hooks/useCart';

function Cart() {
  const { items, loading, cartTotal, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = async (id, value) => {
    const qty = Number(value);
    if (qty < 1) return;

    try {
      await updateQuantity(id, qty);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
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
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.product.image ? (
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      N/A
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-semibold text-gray-900 hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">₹{item.product.price} each</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      min="1"
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="mt-4 flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block rounded-lg bg-primary py-3 text-center text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
