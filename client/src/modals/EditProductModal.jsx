import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets, categories } from "../assets/assets";

const EditProductModal = ({ product, onClose, onUpdate }) => {
    const { axios, backendUrl } = useContext(AppContext);
    const [files, setFiles] = useState([]);
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description.join("\n")); // Join array for textarea
    const [category, setCategory] = useState(product.category);
    const [price, setPrice] = useState(product.price);
    const [offerPrice, setOfferPrice] = useState(product.offerPrice);
    const [existingImages, setExistingImages] = useState(product.image);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const formData = new FormData();
            formData.append("id", product._id);
            formData.append("name", name);
            // Backend expects description as array? 
            // AddProduct checks logic: const { name, price, offerPrice, description, category } = req.body;
            // In AddProduct, user types in textarea. 
            // Product model: description: { type: Array, required: true },
            // But AddProduct sends it as string?
            // Let's check AddProduct logic again.
            // Ah, AddProduct sends plain string? 
            // Wait, let's look at Product Model again. description: type Array.
            // If AddProduct sends a string, mongoose might cast it or it might be buggy?
            // Let's assume description is a string for now or split it.
            // In SingleProduct.jsx: `product.description.map(...)` => implies it IS an array.
            // So I should split by newline.

            // But wait, in AddProduct.jsx: `formData.append("description", description);` where description is state string.
            // The backend `addProduct`: `const product = new Product({ ... description ... })`.
            // If description is string and schema is Array, Mongoose usually casts it to ["string"].
            // So I should probably send it as is, or better, keep it consistent.
            // Let's send it as is.
            formData.append("description", description);

            formData.append("category", category);
            formData.append("price", price);
            formData.append("offerPrice", offerPrice);

            // Append new files if any
            for (let i = 0; i < files.length; i++) {
                if (files[i]) {
                    formData.append("image", files[i]);
                }
            }

            const { data } = await axios.post("/api/product/update", formData);
            if (data.success) {
                toast.success(data.message);
                onUpdate();
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Edit Product</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <p className="text-sm font-medium mb-2">Product Images (Upload new to replace)</p>
                        <p className="text-xs text-red-500 mb-2">Note: Uploading new images will replace all existing images.</p>
                        <div className="flex flex-wrap items-center gap-3">
                            {Array(4)
                                .fill("")
                                .map((_, index) => (
                                    <label key={index} htmlFor={`edit-image${index}`} className="relative cursor-pointer">
                                        <input
                                            onChange={(e) => {
                                                const updatedFiles = [...files];
                                                updatedFiles[index] = e.target.files[0];
                                                setFiles(updatedFiles);
                                            }}
                                            accept="image/*"
                                            type="file"
                                            id={`edit-image${index}`}
                                            hidden
                                        />
                                        <img
                                            className="w-24 h-24 object-cover border rounded"
                                            src={
                                                files[index]
                                                    ? URL.createObjectURL(files[index])
                                                    : (existingImages[index] ? (existingImages[index].startsWith('http') ? existingImages[index] : `${backendUrl}/images/${existingImages[index]}`) : assets.upload_area)
                                            }
                                            alt="uploadArea"
                                        />
                                        {files[index] && <span className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 rounded-bl">New</span>}
                                    </label>
                                ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="p-2 border rounded outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="p-2 border rounded outline-none focus:border-indigo-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat, index) => (
                                    <option value={cat.path} key={index}>
                                        {cat.path}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-2 border rounded outline-none focus:border-indigo-500 resize-none"
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Price</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="p-2 border rounded outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Offer Price</label>
                            <input
                                type="number"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(e.target.value)}
                                className="p-2 border rounded outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50 text-gray-700">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">Update Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
