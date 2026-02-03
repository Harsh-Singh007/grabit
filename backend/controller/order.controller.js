import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    // calculate amount using items;
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add tex charfe 2%
    amount += Math.floor((amount * 2) / 100);
    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
    });
    res
      .status(201)
      .json({ message: "Order placed successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update order status : /api/order/status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status === "Cancelled" && order.cancelledBy === "User") {
      return res.json({ success: false, message: "Cannot change status of an order cancelled by the user" });
    }

    const updateData = { status };
    if (status === "Cancelled") {
      updateData.cancelledBy = "Admin";
    } else if (order.status === "Cancelled" && status !== "Cancelled") {
      updateData.cancelledBy = null;
    }

    await Order.findByIdAndUpdate(orderId, updateData);
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// cancel order : /api/order/cancel
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Check if order belongs to the user
    if (order.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Check if order can be cancelled (not shipped, delivered, or already cancelled)
    const nonCancellableStatuses = ["Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (nonCancellableStatuses.includes(order.status)) {
      return res.json({
        success: false,
        message: `Cannot cancel order. Current status: ${order.status}`
      });
    }

    order.status = "Cancelled";
    order.cancelledBy = "User";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
