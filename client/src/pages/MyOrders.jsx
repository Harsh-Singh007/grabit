import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const orderSteps = [
  { status: "Order Placed", label: "Placed" },
  { status: "Packing", label: "Packed" },
  { status: "Shipped", label: "Shipped" },
  { status: "Out for Delivery", label: "Out for Delivery" },
  { status: "Delivered", label: "Delivered" },
];

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const { axios, user, backendUrl } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      const { data } = await axios.post("/api/order/cancel", { orderId });
      if (data.success) {
        toast.success(data.message);
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Packing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Out for Delivery":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const canCancelOrder = (status) => {
    const nonCancellableStatuses = ["Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    return !nonCancellableStatuses.includes(status);
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage your orders</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-500">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Order ID:</span>
                    <span className="ml-2 font-mono text-gray-900">{order._id.slice(-8)}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-2 font-semibold text-indigo-600">₹{order.amount}</span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                  {order.status === "Cancelled"
                    ? (order.cancelledBy === "User" ? "Cancelled by You" : "Cancelled by Admin")
                    : order.status
                  }
                </div>
              </div>

              {/* Order Tracker */}
              {order.status !== "Cancelled" && (
                <div className="px-6 py-8 border-b border-gray-100 bg-white">
                  <div className="relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />

                    {/* Active Progress Bar */}
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${(Math.max(0, orderSteps.findIndex(s => s.status === order.status)) / (orderSteps.length - 1)) * 100}%`
                      }}
                    />

                    {/* Steps */}
                    <div className="relative flex justify-between w-full">
                      {orderSteps.map((step, stepIndex) => {
                        const currentStepIndex = orderSteps.findIndex(s => s.status === order.status);
                        const isCompleted = stepIndex <= currentStepIndex;
                        const isCurrent = stepIndex === currentStepIndex;

                        return (
                          <div key={step.status} className="flex flex-col items-center group">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 z-10 ${isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-white border-gray-200 text-gray-400 group-hover:border-gray-300"
                                } ${isCurrent ? "ring-4 ring-green-100 scale-110" : ""}`}
                            >
                              {isCompleted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                <span>{stepIndex + 1}</span>
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium mt-3 absolute top-8 whitespace-nowrap transition-colors duration-300 ${isCompleted ? "text-green-600" : "text-gray-400"
                                } ${isCurrent ? "font-bold text-green-700" : ""}`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            item.product.image[0].startsWith("http")
                              ? item.product.image[0]
                              : `${backendUrl}/images/${item.product.image[0]}`
                          }
                          alt={item.product.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.product.offerPrice * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Delivery Address</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.state} {order.address.zipcode}
                    </p>
                    <p>{order.address.country}</p>
                    {order.address.phone && <p className="mt-1">Phone: {order.address.phone}</p>}
                  </div>
                </div>

                {/* Cancel Button */}
                {canCancelOrder(order.status) && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingOrder === order._id}
                      className="px-6 py-2 border-2 border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingOrder === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
