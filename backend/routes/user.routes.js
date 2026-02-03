import express from "express";
import {
  checkAuth,
  loginUser,
  logout,
  registerUser,
  resendOtp,
  updateProfile,
  verifyEmail,
} from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-account", verifyEmail);
router.post("/resend-otp", resendOtp);
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);
router.post("/update-profile", authUser, updateProfile);

export default router;
