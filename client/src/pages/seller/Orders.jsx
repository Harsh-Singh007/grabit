import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { axios, backendUrl } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders.reverse()); // Show newest first
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await axios.post("/api/order/status", {
        orderId,
        status,
      });
      if (data.success) {
        toast.success(data.message);

        // Update local state immediately
        setOrders(prevOrders => prevOrders.map(order => {
          if (order._id === orderId) {
            return {
              ...order,
              status: status,
              isPaid: (status === "Delivered" && order.paymentType === "COD") ? true : order.isPaid
            };
          }
          return order;
        }));

        fetchOrders(); // Optional: still fetch to ensure consistency
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Packing': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Out for Delivery': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
          >
            {/* Order Header */}
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Order Date</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col hidden sm:flex">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Payment Method</span>
                  <span className="font-medium">{order.paymentType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Amount</span>
                  <span className="font-bold text-indigo-600">₹{order.amount.toFixed(2)}</span>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${order.isPaid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {order.isPaid ? "PAID" : "PAYMENT PENDING"}
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Products Column */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Items Ordered</h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            item.product.image[0].startsWith("http")
                              ? item.product.image[0]
                              : `${backendUrl}/images/${item.product.image[0]}`
                          }
                          alt="product"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Column */}
              <div className="lg:col-span-1 space-y-6">

                {/* Shipping Address */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="font-medium text-gray-900">{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                    <p>{order.address.country}</p>
                    <p className="mt-1 text-xs text-gray-400">{order.address.phone}</p>
                  </div>
                </div>

                {/* Status Control */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Order Status</h3>
                  <div className="relative">
                    <select
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      value={order.status}
                      disabled={order.status === "Cancelled" && order.cancelledBy === "User"}
                      className={`w-full appearance-none px-4 py-2.5 rounded-lg border text-sm font-medium focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all ${(order.status === "Cancelled" && order.cancelledBy === "User") ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                        } ${getStatusColor(order.status)}`}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">
                        {order.status === 'Cancelled' && order.cancelledBy
                          ? `Cancelled by ${order.cancelledBy}`
                          : 'Cancelled'}
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="text-gray-500">Wait for customers to place their first order.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Orders;
