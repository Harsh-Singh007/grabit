import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

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

// Place order using Stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    let amount = 0;
    const line_items = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: product.offerPrice * 100, // Stripe expects amount in paise
        },
        quantity: item.quantity,
      });
    }

    // Add 2% tax as a separate line item if needed, or include in price
    const taxAmount = Math.floor((amount * 2) / 100);
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Tax (2%)",
        },
        unit_amount: taxAmount * 100,
      },
      quantity: 1,
    });

    const newOrder = new Order({
      userId,
      items,
      address,
      amount: amount + taxAmount,
      paymentType: "Stripe",
      isPaid: false,
    });

    await newOrder.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/verify-payment?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify-payment?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Stripe payment
export const verifyStripe = async (req, res) => {
  const userId = req.user;
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
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

    // If order is Delivered and payment type is COD, mark as paid
    if (status === "Delivered" && order.paymentType === "COD") {
      updateData.isPaid = true;
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

