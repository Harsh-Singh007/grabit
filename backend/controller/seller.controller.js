import jwt from "jsonwebtoken";
import Seller from "../models/seller.model.js";
import bcrypt from "bcryptjs";

// seller login :/api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Lazy migration: if no seller exists, check env and create one
    const sellerCount = await Seller.countDocuments();
    if (sellerCount === 0) {
      if (
        email === process.env.SELLER_EMAIL &&
        password === process.env.SELLER_PASSWORD
      ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Seller.create({ email, password: hashedPassword });
      } else {
        return res
          .status(400)
          .json({ message: "Invalid credentials", success: false });
      }
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ email: seller.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Login successful", success: true });
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check seller auth  : /api/seller/is-auth
export const checkAuth = async (req, res) => {
  try {
    const seller = req.seller;
    res.status(200).json({
      success: true,
      seller: {
        email: seller.email,
      },
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// logout seller: /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update seller profile : /api/seller/update-profile
export const updateSellerProfile = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;
    const seller = req.seller; // Attached by authSeller middleware

    // Verify current password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect current password" });
    }

    if (email) {
      seller.email = email;
    }

    if (newPassword) {
      seller.password = await bcrypt.hash(newPassword, 10);
    }

    await seller.save();

    // Reissue token in case email changed
    const token = jwt.sign({ email: seller.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      seller: {
        email: seller.email,
      },
    });
  } catch (error) {
    console.error("Error in updateSellerProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
