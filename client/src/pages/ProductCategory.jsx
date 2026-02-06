import { useState, useEffect } from "react";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [gridCols, setGridCols] = useState(5);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  // Filter and sort products
  useEffect(() => {
    let result = products.filter((product) => {
      const prodCat = product.category.toLowerCase();
      const currCat = category.toLowerCase();

      // Include Fruits in the Vegetables category page
      if (currCat === "vegetables") {
        return (prodCat === "vegetables" || prodCat === "fruits") && product.inStock;
      }

      return prodCat === currCat && product.inStock;
    });

    // Apply price filter
    result = result.filter(
      (product) => product.offerPrice >= priceRange[0] && product.offerPrice <= priceRange[1]
    );

    // Apply rating filter
    if (minRating > 0) {
      result = result.filter((product) => (product.rating || 0) >= minRating);
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
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, category, sortBy, priceRange, minRating]);

  const resetFilters = () => {
    setSortBy("default");
    setPriceRange([0, 10000]);
    setMinRating(0);
  };

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4">
      {/* Header */}
      {searchCategory && (
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold">{searchCategory.text.toUpperCase()}</h1>
              <p className="text-indigo-100 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sort By */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all font-medium"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="Min"
              />
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all font-medium"
            >
              <option value="0">All Ratings</option>
              <option value="4">4★ & Above</option>
              <option value="3">3★ & Above</option>
              <option value="2">2★ & Above</option>
              <option value="1">1★ & Above</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">View</label>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setGridCols(3)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${gridCols === 3 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Large
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${gridCols === 4 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Medium
              </button>
              <button
                onClick={() => setGridCols(5)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${gridCols === 5 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Small
              </button>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(sortBy !== "default" || priceRange[0] !== 0 || priceRange[1] !== 10000 || minRating > 0) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${gridCols} gap-6 animate-fadeInUp`}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
          <button
            onClick={resetFilters}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all hover:shadow-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
