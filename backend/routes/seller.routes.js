import express from "express";
import {
  checkAuth,
  sellerLogin,
  sellerLogout,
  updateSellerProfile,
} from "../controller/seller.controller.js";
import { authSeller } from "../middlewares/authSeller.js";
const router = express.Router();

router.post("/login", sellerLogin);
router.get("/is-auth", authSeller, checkAuth);
router.get("/logout", authSeller, sellerLogout);
router.post("/update-profile", authSeller, updateSellerProfile);

export default router;
