import express from "express";

import { authSeller } from "../middlewares/authSeller.js";
import authUser from "../middlewares/authUser.js";
import {
  addProduct,
  bulkAddProducts,
  changeStock,
  createProductReview,
  getProductById,
  getProducts,
  updateProduct,
} from "../controller/product.controller.js";
import { upload } from "../config/multer.js";
const router = express.Router();

router.post("/add-product", authSeller, upload.array("image", 4), addProduct);
router.post("/bulk-add", authSeller, bulkAddProducts);
router.get("/list", getProducts);
router.get("/id", getProductById);
router.post("/stock", authSeller, changeStock);
router.post("/update", authSeller, upload.array("image", 4), updateProduct);
router.post("/review", authUser, createProductReview);

export default router;
