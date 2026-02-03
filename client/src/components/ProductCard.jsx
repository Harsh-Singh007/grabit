import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate, backendUrl } = useAppContext();
  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/product/${product.category.toLowerCase()}/${product?._id}`
          );
          scrollTo(0, 0);
        }}
        className="relative border border-gray-200 rounded-lg md:px-4 px-3 py-4 bg-white w-full cursor-pointer shadow-sm hover:shadow-xl hover:z-10 hover:-translate-y-1 transition-all duration-300 ease-in-out"
      >
        <div className="group cursor-pointer flex items-center justify-center px-2 h-40 relative">
          {product.price > product.offerPrice && (
            <div className="absolute top-0 left-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
              {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
            </div>
          )}
          <img
            className="group-hover:scale-110 transition-transform duration-300 max-w-full max-h-full object-contain"
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
        <div className="text-gray-500/80 text-sm mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{product.category}</p>
          <p className="text-gray-800 font-semibold text-lg truncate w-full mt-1">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < Math.round(product.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                  alt="rating"
                  className="w-3 md:w-3.5"
                />
              ))}
            <p className="text-xs text-gray-400">({product.numReviews || 0})</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 line-through">
                ₹{product.price}
              </span>
              <p className="text-xl font-bold text-indigo-600">
                ₹{product.offerPrice}
              </p>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className=""
            >
              {!cartItems?.[product?._id] ? (
                <button
                  onClick={() => addToCart(product?._id)}
                  className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white w-20 h-9 rounded-full font-medium shadow-md transition-all active:scale-95"
                >
                  <span className="text-sm">Add</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product?._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product?._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product?._id)}
                    className="cursor-pointer text-md px-2 h-full"
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
