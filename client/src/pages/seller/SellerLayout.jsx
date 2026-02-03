import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";
import EditProfileModal from "../../modals/EditProfileModal";

const SellerLayout = () => {
  const { isSeller, setIsSeller, axios, seller } = useAppContext();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        setIsSeller(false);
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {showProfileModal && (
        <EditProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-64 h-full bg-slate-900 text-white flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center font-bold text-xl">G</div>
            <span className="text-xl font-bold tracking-wide">GrabIT Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <img
                src={item.icon}
                alt=""
                className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity invert brightness-0 grayscale group-[.text-white]:invert-0 group-[.text-white]:brightness-100 group-[.text-white]:grayscale-0"
                style={{ filter: "brightness(0) invert(1)" }} // Force white icons for dark theme
              />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Administrator</p>
              <p className="text-xs text-slate-400 truncate">{seller?.email || "admin@grabit.com"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-md hover:bg-gray-100 md:hidden text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProfileModal(true)}
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Edit Profile
            </button>
            <div className="h-6 w-px bg-gray-300 mx-1"></div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default SellerLayout;
