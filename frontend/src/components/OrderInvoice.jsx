import getImageUrl from '../utils/getImageUrl';
import OrderStatusBadge from './OrderStatusBadge';

function OrderInvoice({ order, showCustomer = false }) {
  const handlePrint = () => window.print();

  return (
    <div className="invoice-content rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="no-print mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Order Invoice</h2>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Print Invoice
        </button>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-bold text-primary">ShopSphere</h3>
        <p className="text-sm text-gray-500">Order Invoice #{order.id}</p>
        <p className="text-sm text-gray-500">
          Date: {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {showCustomer && order.user && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Customer</p>
          <p className="text-sm text-gray-600">{order.user.name}</p>
          <p className="text-sm text-gray-600">{order.user.email}</p>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-700">Shipping Address</p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress}, {order.city}, {order.state} - {order.pincode}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Payment</p>
          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
          <div className="mt-2">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="py-2">Item</th>
            <th className="py-2">Qty</th>
            <th className="py-2">Price</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  {item.product.image && (
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <span className="font-medium">{item.product.name}</span>
                </div>
              </td>
              <td className="py-3">{item.quantity}</td>
              <td className="py-3">₹{item.price}</td>
              <td className="py-3 text-right font-medium">
                ₹{item.price * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end border-t pt-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">Grand Total</p>
          <p className="text-2xl font-bold text-gray-900">₹{order.totalAmount}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderInvoice;
