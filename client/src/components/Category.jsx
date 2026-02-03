import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
const Category = () => {
  const { navigate } = useAppContext();
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Categories</p>
      <div className="my-6 flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-5 lg:grid-cols-7 w-full scrollbar-hide">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group cursor-pointer py-5 px-3 rounded-xl gap-2 flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-w-[120px] md:min-w-0 flex-shrink-0`}
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt=""
              className="max-w-16 md:max-w-28 transition group-hover:scale-110"
            />
            <p className="text-xs md:text-sm font-medium whitespace-nowrap">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Category;
