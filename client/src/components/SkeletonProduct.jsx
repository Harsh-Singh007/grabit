import React from "react";

const SkeletonProduct = () => {
    return (
        <div className="border border-gray-100 rounded-lg md:px-4 px-3 py-4 bg-white min-w-56 max-w-56 w-full shadow-sm animate-pulse">
            <div className="h-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3 h-3 bg-gray-200 rounded-full"></div>
                ))}
            </div>
            <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    );
};

export default SkeletonProduct;
