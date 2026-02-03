import { useContext } from "react";
import ProductCard from "./ProductCard";
import SkeletonProduct from "./SkeletonProduct";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Top Rated Products</p>
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-10 px-2 py-4 items-center justify-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        {products && products.length > 0 ? (
          [...products]
            .filter((product) => product.inStock)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
        ) : (
          Array(5).fill(0).map((_, index) => <SkeletonProduct key={index} />)
        )}
      </div>
    </div>
  );
};
export default BestSeller;
