import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category } = req.body;

    // Upload images to Cloudinary
    let image = [];
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        // Delete local file after upload to save space
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting local file:", err);
        });
        return result.secure_url;
      });

      image = await Promise.all(imageUploadPromises);
    }

    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !image ||
      image.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      image,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    return res
      .status(500)
      .json({ success: false, message: "Server error while adding product" });
  }
};

// bulk add products : /api/product/bulk-add
export const bulkAddProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid products data. Please provide an array of products.",
      });
    }

    // Basic validation and formatting
    const formattedProducts = products.map((p) => ({
      name: p.name,
      price: p.price,
      offerPrice: p.offerPrice || p.price,
      description: p.description || "",
      category: p.category,
      image: Array.isArray(p.image) ? p.image : [p.image || ""],
      inStock: p.inStock !== undefined ? p.inStock : true,
    }));

    const result = await Product.insertMany(formattedProducts);

    return res.status(201).json({
      success: true,
      message: `${result.length} products added successfully`,
      count: result.length,
    });
  } catch (error) {
    console.error("Error in bulkAddProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during bulk addition",
      error: error.message,
    });
  }
};

// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update product : /api/product/update
export const updateProduct = async (req, res) => {
  try {
    const { id, name, price, offerPrice, description, category } = req.body;
    let image = [];

    // If new files are uploaded, process them
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting local file:", err);
        });
        return result.secure_url;
      });
      image = await Promise.all(imageUploadPromises);
    }

    const updateData = {
      name,
      price,
      offerPrice,
      description,
      category,
    };

    // Only update image if new ones were provided
    if (image.length > 0) {
      updateData.image = image;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// create product review : /api/product/review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const product = await Product.findById(productId);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user.toString()
      );

      if (alreadyReviewed) {
        return res
          .status(400)
          .json({ success: false, message: "Product already reviewed" });
      }

      // Fetch user to get their name
      const user = await User.findById(req.user);

      const review = {
        name: user.name,
        rating: Number(rating),
        comment,
        user: req.user,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ success: true, message: "Review added" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Error in createProductReview:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
