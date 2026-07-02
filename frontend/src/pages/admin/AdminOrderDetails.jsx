import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import OrderInvoice from '../../components/OrderInvoice';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAdminOrder, updateOrderStatus } from '../../api/adminApi';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await getAdminOrder(id);
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

  const handleStatusChange = async (status) => {
    if (!window.confirm(`Update order status to ${status}?`)) return;

    setUpdating(true);
    try {
      const { data } = await updateOrderStatus(id, status);
      setOrder(data.data.order);
      toast.success('Order status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/admin/orders" className="mt-4 text-primary hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const canUpdate = !['CANCELLED', 'DELIVERED'].includes(order.status);

  return (
    <>
      <AdminHeader title={`Order #${order.id}`} />
      <div className="flex-1 overflow-auto p-6">
        <Link to="/admin/orders" className="no-print text-sm text-primary hover:underline">
          &larr; Back to Orders
        </Link>

        {canUpdate && (
          <div className="no-print mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-gray-700">Update Status</p>
            <div className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <select
                disabled={updating}
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) handleStatusChange(e.target.value);
                  e.target.value = '';
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Change status...</option>
                {STATUS_OPTIONS.filter((s) => s !== order.status).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="mt-6">
          <OrderInvoice order={order} showCustomer />
        </div>
      </div>
    </>
  );
}

export default AdminOrderDetails;
