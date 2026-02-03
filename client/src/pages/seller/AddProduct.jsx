import { assets, categories } from "../../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle Single Add
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);

      for (let i = 0; i < files.length; i++) {
        if (files[i]) formData.append("image", files[i]);
      }

      const { data } = await axios.post("/api/product/add-product", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
          <p className="text-gray-500 mt-1">Manage your inventory by adding new items</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Image Upload */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Product Images</p>
                <div className="grid grid-cols-2 gap-4">
                  {Array(4).fill("").map((_, index) => (
                    <label
                      key={index}
                      htmlFor={`image${index}`}
                      className={`aspect-square relative flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${files[index] ? "border-indigo-500 bg-indigo-50/50" : "border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-white"
                        }`}
                    >
                      <input
                        onChange={(e) => {
                          const updatedFiles = [...files];
                          updatedFiles[index] = e.target.files[0];
                          setFiles(updatedFiles);
                        }}
                        accept="image/*"
                        type="file"
                        id={`image${index}`}
                        hidden
                      />
                      {files[index] ? (
                        <img
                          src={URL.createObjectURL(files[index])}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-xl shadow-inner"
                        />
                      ) : (
                        <div className="text-center p-3">
                          <img src={assets.upload_area} alt="Upload" className="w-10 h-10 mx-auto opacity-40 mb-2" />
                          <span className="text-xs font-medium text-gray-400">Click to Upload</span>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-600 italic">
                  💡 Tip: First image is the main thumbnail. Clear, bright photos work best!
                </p>
              </div>
            </div>

            {/* Right Column: details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">📦 Core Information</h3>

                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 uppercase tracking-tight" htmlFor="product-name">Product Title</label>
                    <input
                      id="product-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Premium Basmati Rice"
                      className="px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 uppercase tracking-tight" htmlFor="product-description">Description</label>
                    <textarea
                      id="product-description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-gray-700"
                      placeholder="Detail the taste, source, weight, or shelf life..."
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-tight" htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer font-medium"
                    required
                  >
                    <option value="">Choose One</option>
                    {categories.map((cat, index) => (
                      <option value={cat.path} key={index}>{cat.text}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-tight" htmlFor="product-price">Original Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input
                      id="product-price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="pl-9 pr-5 py-3 w-full rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-tight" htmlFor="offer-price">Offer Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 font-bold">₹</span>
                    <input
                      id="offer-price"
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="0"
                      className="pl-9 pr-5 py-3 w-full rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-indigo-600"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end pt-8 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-4 rounded-xl text-white font-bold text-lg shadow-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 ${loading ? "bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/40"
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
