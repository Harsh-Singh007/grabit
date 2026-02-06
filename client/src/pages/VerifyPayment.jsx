import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyPayment = () => {
    const { axios, navigate, setCartItems } = useAppContext();
    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            if (!orderId) return;

            const { data } = await axios.post('/api/order/verify-stripe', { success, orderId });

            if (data.success) {
                setCartItems({});
                toast.success(data.message);
                navigate('/my-orders');
            } else {
                toast.error(data.message);
                navigate('/cart');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
            navigate('/cart');
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Verifying your payment, please wait...</p>
        </div>
    );
};

export default VerifyPayment;
