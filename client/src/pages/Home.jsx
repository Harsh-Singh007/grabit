import Banner from "../components/Banner";
import BestSeller from "../components/BestSeller";
import Category from "../components/Category";
import AdvertCards from "../components/AdvertCards";

const Home = () => {
  return (
    <div className="mt-10">
      <Banner />
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <AdvertCards />
      </div>
      <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
        <Category />
      </div>
      <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
        <BestSeller />
      </div>
    </div>
  );
};
export default Home;
