import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import OrderInvoice from '../components/OrderInvoice';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { cancelOrder, getOrder } from '../api/orderApi';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await getOrder(id);
      setOrder(data.data.order);
    } catch {
      toast.error('Order not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      const { data } = await cancelOrder(id);
      setOrder(data.data.order);
      toast.success('Order cancelled');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancel failed');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/orders" className="mt-4 text-primary hover:underline">
          View all orders
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="no-print mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <div className="mt-2">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        {order.status === 'PENDING' && (
          <button
            type="button"
            disabled={cancelling}
            onClick={handleCancel}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            Cancel Order
          </button>
        )}
      </div>

      <OrderInvoice order={order} />

      <div className="no-print mt-6 flex justify-center gap-4">
        <Link to="/orders" className="text-primary hover:underline">
          View Order History
        </Link>
        <Link to="/products" className="text-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default OrderDetails;
