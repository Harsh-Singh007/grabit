import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";

const Products = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [gridCols, setGridCols] = useState(5);

  // Filter and sort products
  useEffect(() => {
    let result = products.filter((product) => product.inStock);

    // Apply search filter
    if (searchQuery.length > 0) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter((product) => {
        const prodCat = product.category.toLowerCase();
        const selCat = selectedCategory.toLowerCase();

        // Include Fruits in the Vegetables category filter
        if (selCat === "vegetables") {
          return prodCat === "vegetables" || prodCat === "fruits";
        }

        return prodCat === selCat;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case "name-az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 animate-fadeInUp">
        <div>
          <h1 className="text-3xl lg:text-4xl font-medium">All Products</h1>
          <p className="text-gray-500 mt-1">
            Showing {filteredProducts.length} of {products.filter(p => p.inStock).length} products
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setGridCols(3)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${gridCols === 3 ? "bg-white shadow-sm text-indigo-600" : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Large
          </button>
          <button
            onClick={() => setGridCols(4)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${gridCols === 4 ? "bg-white shadow-sm text-indigo-600" : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Medium
          </button>
          <button
            onClick={() => setGridCols(5)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${gridCols === 5 ? "bg-white shadow-sm text-indigo-600" : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Small
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.path} value={category.path}>
                {category.text}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
            <option value="name-za">Name: Z to A</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(selectedCategory !== "All" || sortBy !== "default") && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSortBy("default");
              }}
              className="px-4 py-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div
        className={`my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${gridCols} gap-4 items-center justify-center animate-fadeInUp`}
        style={{ animationDelay: '0.2s' }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
