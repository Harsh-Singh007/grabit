import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartItems: { type: Object, default: {} },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpire: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;
