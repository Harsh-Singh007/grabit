import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0 && location.pathname !== "/products") {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="sticky top-0 z-50 flex flex-col px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-md relative transition-all shadow-sm">
      <div className="w-full flex items-center justify-between">
        <Link to="/">
          <h2 className="text-2xl font-bold text-primary">GrabIT</h2>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          <Link to={"/"} className="hover:text-primary transition-colors">Home</Link>
          <Link to={"/products"} className="hover:text-primary transition-colors">All Products</Link>

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.836 10.615 15 14.695"
                stroke="#7A7B7D"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                clipRule="evenodd"
                d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
                stroke="#7A7B7D"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#615fff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
              {cartCount()}
            </button>
          </div>

          {user ? (
            <div className="relative group">
              <img src={assets.profile_icon} alt="" className="w-10" />
              <ul className="hidden group-hover:block absolute top-10 roght-0 bg-white shadow border border-gray-200 py-2 w-30 rounded-md z-40 text-sm">
                <li
                  onClick={() => navigate("/profile")}
                  className="p-1.5 cursor-pointer hover:bg-gray-50"
                >
                  Profile
                </li>
                <li
                  onClick={() => navigate("/my-orders")}
                  className="p-1.5 cursor-pointer hover:bg-gray-50"
                >
                  My Orders
                </li>
                <li className="cursor-pointer p-1.5 hover:bg-gray-50" onClick={logout}>
                  Logout
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
            >
              Login
            </button>
          )}
        </div>
        <div className="flex items-center gap-6 md:hidden">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#615fff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
              {cartCount()}
            </button>
          </div>
          <button
            onClick={() => (open ? setOpen(false) : setOpen(true))}
            aria-label="Menu"
            className="sm:hidden"
          >
            {/* Menu Icon SVG */}
            <svg
              width="21"
              height="15"
              viewBox="0 0 21 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="21" height="1.5" rx=".75" fill="#426287" />
              <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
              <rect
                x="6"
                y="13"
                width="15"
                height="1.5"
                rx=".75"
                fill="#426287"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="flex lg:hidden w-full mt-4 px-1 gap-2 border border-gray-200 px-3 py-2 rounded-full bg-gray-50/50">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
          type="text"
          placeholder="Search for atta, dal, coke..."
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-500"
        >
          <path
            d="M10.836 10.615 15 14.695"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            clipRule="evenodd"
            d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex-col overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden ${open ? "max-h-screen" : "max-h-0"
          }`}
      >
        <div className="flex flex-col p-4 gap-3">
          <Link
            onClick={() => setOpen(false)}
            to={"/"}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
          >
            Home
          </Link>
          <Link
            onClick={() => setOpen(false)}
            to={"/products"}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
          >
            All Products
          </Link>

          {user ? (
            <div className="border-t border-gray-100 pt-3 mt-2">
              <div className="flex items-center gap-3 p-2 mb-2">
                <img src={assets.profile_icon} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                <span className="font-medium text-gray-900">My Account</span>
              </div>
              <ul className="flex flex-col gap-1 pl-2">
                <li
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="p-2 text-sm text-gray-600 hover:text-indigo-600 cursor-pointer"
                >
                  Profile
                </li>
                <li
                  onClick={() => {
                    navigate("/my-orders");
                    setOpen(false);
                  }}
                  className="p-2 text-sm text-gray-600 hover:text-indigo-600 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  className="p-2 text-sm text-red-500 hover:text-red-600 cursor-pointer"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="w-full mt-2 py-2.5 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-lg font-medium shadow-sm active:scale-95"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
