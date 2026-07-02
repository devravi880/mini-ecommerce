import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { placeOrder } from '../api/orderApi';

function Checkout() {
  const { items, cartTotal, loading, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      shippingAddress: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
      paymentMethod: 'COD',
    },
  });

  const onSubmit = async (formData) => {
    try {
      const { data } = await placeOrder(formData);
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.data.order.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  useEffect(() => {
    if (!loading && items.length === 0) {
      navigate('/cart');
    }
  }, [loading, items.length, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Shipping Details</h2>

          <InputField
            label="Address"
            error={errors.shippingAddress}
            {...register('shippingAddress', { required: 'Address is required' })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="City"
              error={errors.city}
              {...register('city', { required: 'City is required' })}
            />
            <InputField
              label="State"
              error={errors.state}
              {...register('state', { required: 'State is required' })}
            />
          </div>
          <InputField
            label="Pincode"
            error={errors.pincode}
            {...register('pincode', { required: 'Pincode is required' })}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
              {...register('paymentMethod', { required: true })}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Credit/Debit Card</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>₹{item.product.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
