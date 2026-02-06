import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const SingleProduct = () => {
  const { products, navigate, addToCart, backendUrl, user, axios, fetchProducts } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((product) => product._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => item.category.toLowerCase() === product.category.toLowerCase() && item._id !== product._id
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
  }, [product]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to review this product");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/product/review", {
        rating,
        comment,
        productId: product._id,
      });
      if (data.success) {
        toast.success(data.message);
        setRating(0);
        setComment("");
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on GrabIt!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const discountPercentage = product ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;

  return (
    product && (
      <div className="mt-16 animate-fadeInUp max-w-7xl mx-auto px-4">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-lg">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/products" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
            Products
          </Link>
          <span className="text-gray-400">/</span>
          <Link to={`/products/${product.category}`} className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
            {product.category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-indigo-600 font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8">
          {/* Image Section */}
          <div className="flex gap-4">
            {/* Thumbnail Gallery */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className={`border-2 ${thumbnail === image ? 'border-indigo-500 shadow-lg' : 'border-gray-200'} w-20 h-20 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-400 transition-all duration-300 hover:scale-105`}
                >
                  <img
                    src={image.startsWith("http") ? image : `${backendUrl}/images/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <div
              className="flex-1 relative border-2 border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white shadow-xl group"
              onMouseEnter={() => setImageZoom(true)}
              onMouseLeave={() => setImageZoom(false)}
            >
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg z-10 animate-pulse">
                  {discountPercentage}% OFF
                </div>
              )}
              <img
                src={thumbnail && (thumbnail.startsWith("http") ? thumbnail : `${backendUrl}/images/${thumbnail}`)}
                alt="Selected product"
                className={`w-full h-[500px] object-contain transition-transform duration-500 ${imageZoom ? 'scale-125' : 'scale-100'}`}
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            {/* Product Title & Rating */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <img
                      src={i < Math.round(product.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                      alt="star"
                      key={i}
                      className="w-4 h-4"
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-2">
                    {product.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">({product.numReviews || 0} reviews)</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-6 border border-indigo-100">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-indigo-600">₹{product.offerPrice}</span>
                {product.price > product.offerPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">₹{product.price}</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save ₹{product.price - product.offerPrice}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About This Product
              </h3>
              <ul className="space-y-2">
                {product.description.map((desc, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold text-blue-900">Fast Delivery</span>
                </div>
                <p className="text-xs text-blue-700">Delivery in 10-15 mins</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-green-900">Quality Assured</span>
                </div>
                <p className="text-xs text-green-700">100% Fresh Products</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product._id);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-4 rounded-xl font-bold text-lg hover:from-gray-200 hover:to-gray-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product._id);
                  }
                  navigate("/cart");
                  scrollTo(0, 0);
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy Now
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Product
            </button>
          </div>
        </div>


        {/* Product Reviews */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Review Form */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write a Review
              </h3>
              <form onSubmit={submitReviewHandler} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Rating</label>
                  <div className="flex gap-2 bg-white p-4 rounded-xl border border-indigo-200">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className="p-2 cursor-pointer transition-all hover:scale-125 active:scale-95"
                      >
                        <img
                          src={num <= rating ? assets.star_icon : assets.star_dull_icon}
                          className="w-10 h-10"
                          alt={`${num} star`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Review</label>
                  <textarea
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400"
                    placeholder="Share your experience with this product..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all transform hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Review
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Review List */}
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                All Reviews ({product.numReviews || 0})
              </h3>
              <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev._id} className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {rev.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{rev.name}</p>
                            <p className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 bg-yellow-50 px-2 py-1 rounded-full">
                          {[...Array(5)].map((_, i) => (
                            <img
                              key={i}
                              src={i < rev.rating ? assets.star_icon : assets.star_dull_icon}
                              className="w-4 h-4"
                              alt="star"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed italic bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 font-semibold text-lg">No reviews yet</p>
                    <p className="text-gray-400 text-sm mt-1">Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Related Products */}
        <div className="mt-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">You May Also Like</h2>
          </div>

          {relatedProducts.filter((product) => product.inStock).length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                {relatedProducts
                  .filter((product) => product.inStock)
                  .map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    navigate("/products");
                    scrollTo(0, 0);
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Explore All Products
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No related products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    )
  );
};
export default SingleProduct;
