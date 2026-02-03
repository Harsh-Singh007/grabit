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

  const product = products.find((product) => product._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => item.category === product.category && item._id !== product._id
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

  return (
    product && (
      <div className="mt-16 animate-fadeInUp">
        <p>
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>/<Link to={"/products"} className="hover:text-primary transition-colors"> Products</Link> /
          <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary transition-colors">
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-indigo-500"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img
                    src={
                      image.startsWith("http")
                        ? image
                        : `${backendUrl}/images/${image}`
                    }
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded-lg overflow-hidden shadow-sm">
              <img
                src={
                  thumbnail &&
                  (thumbnail.startsWith("http")
                    ? thumbnail
                    : `${backendUrl}/images/${thumbnail}`)
                }
                alt="Selected product"
              />
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium">{product.name}</h1>

            <div className="flex items-center gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <img
                  src={i < Math.round(product.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                  key={i}
                  className="w-3.5 md:w-4"
                />
              ))}
              <p className="text-base ml-2">({product.numReviews || 0})</p>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: ₹{product.price}
              </p>
              <p className="text-2xl font-medium">MRP: ₹{product.offerPrice}</p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                onClick={() => addToCart(product._id)}
                className="w-full py-3.5 rounded-lg cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all ease-in-out duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id);
                  navigate("/cart");
                  scrollTo(0, 0);
                }}
                className="w-full py-3.5 rounded-lg cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all ease-in-out duration-300"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-2xl font-medium">Customer Reviews</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            {/* Review Form */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-lg font-medium mb-4">Write a Review</h3>
              <form onSubmit={submitReviewHandler}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <img
                          src={num <= rating ? assets.star_icon : assets.star_dull_icon}
                          className="w-8"
                          alt={`${num} star`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Tell us what you think..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-500 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-indigo-600 disabled:bg-gray-400 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>

            {/* Review List */}
            <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-base">{rev.name}</p>
                      <p className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <img
                          key={i}
                          src={i < rev.rating ? assets.star_icon : assets.star_dull_icon}
                          className="w-3"
                          alt="star"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 italic py-10">
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* related prodcuts  */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-2xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
            {relatedProducts
              .filter((product) => product.inStock)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="w-1/2 my-8 py-3.5 rounded-lg cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 hover:-translate-y-1 hover:shadow-lg transition-all ease-in-out duration-300"
          >
            See More
          </button>
        </div>
      </div>
    )
  );
};
export default SingleProduct;
