import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const AdvertCards = () => {
    const navigate = useNavigate();

    const adCards = [
        {
            title: "Pharmacy at your doorstep!",
            desc: "Cough syrups, pain relief sprays & more",
            btnText: "Order Now",
            bgColor: "bg-teal-500",
            image: assets.pharma_wellness_image,
            path: "pharma"
        },
        {
            title: "Pet care supplies at your door",
            desc: "Food, treats, toys & more",
            btnText: "Order Now",
            bgColor: "bg-yellow-400",
            image: assets.pet_care_image,
            path: "pet"
        },
        {
            title: "No time for a diaper run?",
            desc: "Get baby care essentials",
            btnText: "Order Now",
            bgColor: "bg-blue-200",
            image: assets.baby_care_image,
            path: "baby"
        }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 mt-8 w-full overflow-x-auto scrollbar-hide">
            {adCards.map((card, index) => (
                <div
                    key={index}
                    className={`${card.bgColor} relative rounded-2xl p-6 min-w-full md:min-w-[32%] flex-1 h-48 md:h-56 overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1`}
                    onClick={() => {
                        navigate(`/products/${card.path.toLowerCase()}`);
                        scrollTo(0, 0);
                    }}
                >
                    <div className="relative z-10 max-w-[60%]">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2">
                            {card.title}
                        </h2>
                        <p className="text-sm md:text-base text-gray-800 mb-4 font-medium opacity-90">
                            {card.desc}
                        </p>
                        <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow active:scale-95 transition-all">
                            {card.btnText}
                        </button>
                    </div>
                    {/* Background decoration circles/shapes could go here */}

                    {/* Assuming we might not have these specific cutout images, so using a placeholder approach or generic object-cover logic. 
                        Ideally, these would be transparent PNGs positioned absolute right-0 bottom-0.
                    */}
                    <img
                        src={card.image}
                        alt={card.title}
                        className="absolute right-0 bottom-0 h-full w-1/2 object-contain object-right-bottom mix-blend-multiply opacity-90"
                    />
                </div>
            ))}
        </div>
    )
}

export default AdvertCards;
