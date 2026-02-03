import React from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const FloatingCart = () => {
    const { cartCount, totalCartAmount, navigate } = useAppContext();
    const count = cartCount();
    const total = totalCartAmount();

    if (count === 0) return null;

    return (
        <div
            className="fixed bottom-6 left-4 right-4 md:hidden z-50 animate-fadeInUp"
            onClick={() => {
                navigate('/cart');
                scrollTo(0, 0);
            }}
        >
            <div className="bg-indigo-600 text-white rounded-xl shadow-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-indigo-700 transition-colors">
                <div className="flex flex-col">
                    <p className="font-bold text-sm">{count} items • ₹{total}</p>
                    <p className="text-xs text-indigo-200">Extra charges may apply</p>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                    View Cart
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default FloatingCart;
