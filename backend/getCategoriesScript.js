import mongoose from "mongoose";
import Product from "./models/product.model.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

// Get all unique categories
const getCategories = async () => {
    try {
        await connectDB();

        const categories = await Product.distinct("category");

        const output = {
            totalCategories: categories.length,
            categories: categories.sort(),
            mapping: {}
        };

        // Create mapping suggestions
        categories.sort().forEach((cat) => {
            output.mapping[cat] = {
                databaseCategory: cat,
                suggestedPath: cat,
                note: "Update the 'path' field in assets.js to match this value"
            };
        });

        // Write to file
        fs.writeFileSync(
            "categories_output.json",
            JSON.stringify(output, null, 2),
            "utf8"
        );

        console.log("\n✅ Categories exported to categories_output.json");
        console.log(`\nFound ${categories.length} unique categories:`);
        categories.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat}`);
        });

        mongoose.connection.close();
    } catch (error) {
        console.error("Error fetching categories:", error);
        mongoose.connection.close();
    }
};

getCategories();
