import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate, backendUrl } = useAppContext();

  const discountPercentage = product.price > product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    product && (
      <div
        onClick={() => {
          navigate(`/product/${product.category.toLowerCase()}/${product?._id}`);
          scrollTo(0, 0);
        }}
        className="group relative bg-white border-2 border-gray-100 rounded-xl p-3 cursor-pointer shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden"
      >
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/50 transition-all duration-500 pointer-events-none rounded-xl"></div>

        {/* Product Image Container */}
        <div className="relative flex items-center justify-center h-36 mb-3 bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Stock Badge */}
          {product.inStock && (
            <div className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10">
              In Stock
            </div>
          )}

          <img
            className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-110"
            src={
              product.image[0].startsWith("http")
                ? product.image[0]
                : `${backendUrl}/images/${product.image[0]}`
            }
            onError={(e) => {
              e.target.src = assets.upload_area;
            }}
            alt={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="relative z-10 space-y-1.5">
          {/* Category */}
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-gray-900 font-bold text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors h-10">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded-full">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.round(product.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                    alt="rating"
                    className="w-2.5 h-2.5"
                  />
                ))}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">({product.numReviews || 0})</span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-end justify-between pt-2 border-t border-gray-100">
            <div className="flex flex-col">
              {product.price > product.offerPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  ₹{product.price}
                </span>
              )}
              <p className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ₹{product.offerPrice}
              </p>
            </div>

            {/* Add to Cart Button */}
            <div onClick={(e) => e.stopPropagation()}>
              {!cartItems?.[product?._id] ? (
                <button
                  onClick={() => addToCart(product?._id)}
                  className="flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg font-bold shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs">Add</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg px-2 py-1.5 select-none border-2 border-indigo-200">
                  <button
                    onClick={() => removeFromCart(product?._id)}
                    className="text-indigo-700 font-bold text-base w-5 h-5 flex items-center justify-center hover:bg-white rounded transition-all active:scale-90"
                  >
                    -
                  </button>
                  <span className="text-indigo-900 font-bold text-sm min-w-[16px] text-center">
                    {cartItems[product?._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product?._id)}
                    className="text-indigo-700 font-bold text-base w-5 h-5 flex items-center justify-center hover:bg-white rounded transition-all active:scale-90"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
