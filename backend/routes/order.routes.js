import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  cancelOrder,
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  placeOrderStripe,
  verifyStripe,
  updateStatus,
} from "../controller/order.controller.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();
router.post("/cod", authUser, placeOrderCOD);
router.post("/stripe", authUser, placeOrderStripe);
router.post("/verify-stripe", authUser, verifyStripe);
router.get("/user", authUser, getUserOrders);
router.post("/cancel", authUser, cancelOrder);
router.get("/seller", authSeller, getAllOrders);
router.post("/status", authSeller, updateStatus);

export default router;
