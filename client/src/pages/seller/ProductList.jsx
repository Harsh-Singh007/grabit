import toast from "react-hot-toast";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import EditProductModal from "../../modals/EditProductModal";

const ProductList = () => {
  const { products, fetchProducts, axios, backendUrl } = useAppContext();

  const [editingProduct, setEditingProduct] = useState(null);

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.success(error.message);
    }
  };
  return (
    <div className="max-w-7xl mx-auto w-full">
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={fetchProducts}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
        <div className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{products.length}</span> products
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 hidden md:table-cell">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          src={
                            product.image[0].startsWith("http")
                              ? product.image[0]
                              : `${backendUrl}/images/${product.image[0]}`
                          }
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {Array.isArray(product.description)
                            ? product.description.join(' ').substring(0, 30)
                            : (product.description || '').substring(0, 30)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="font-medium text-gray-900">₹{product.offerPrice}</div>
                    {product.price > product.offerPrice && (
                      <div className="text-xs text-gray-400 line-through">₹{product.price}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStock(product._id, !product.inStock)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${product.inStock
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      </div>
                      <p>No products found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ProductList;
