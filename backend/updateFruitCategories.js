import mongoose from "mongoose";
import Product from "./models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const updateFruitCategories = async () => {
    try {
        await connectDB();

        // Find all products with "mango", "apple", "orange", "banana", "grapes" in the name
        const fruitKeywords = ["mango", "apple", "orange", "banana", "grapes", "fruit"];

        for (const keyword of fruitKeywords) {
            const result = await Product.updateMany(
                {
                    name: { $regex: keyword, $options: 'i' },
                    category: "Vegetables"
                },
                {
                    $set: { category: "Fruits" }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Updated ${result.modifiedCount} product(s) containing "${keyword}" from Vegetables to Fruits`);
            }
        }

        // Show updated categories
        const categories = await Product.distinct("category");
        console.log("\n📊 Current categories in database:");
        categories.sort().forEach((cat, index) => {
            console.log(`${index + 1}. ${cat}`);
        });

        mongoose.connection.close();
        console.log("\n✅ Database update completed!");
    } catch (error) {
        console.error("Error updating categories:", error);
        mongoose.connection.close();
    }
};

updateFruitCategories();
