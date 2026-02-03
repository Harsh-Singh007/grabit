import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, setUser, axios, navigate } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!currentPassword) {
            return toast.error("Please enter your current password");
        }

        // Only validate password if user is trying to change it
        if (newPassword || confirmPassword) {
            if (!newPassword) {
                return toast.error("Please enter a new password");
            }
            if (!confirmPassword) {
                return toast.error("Please confirm your new password");
            }
            if (newPassword !== confirmPassword) {
                return toast.error("New passwords do not match");
            }
            if (newPassword.length < 6) {
                return toast.error("New password must be at least 6 characters");
            }
        }

        setLoading(true);
        try {
            const { data } = await axios.post("/api/user/update-profile", {
                name,
                email,
                currentPassword,
                newPassword: newPassword || undefined,
            });

            if (data.success) {
                toast.success(data.message);
                setUser(data.user);
                setIsEditing(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { data } = await axios.get("/api/user/logout");
            if (data.success) {
                setUser(null);
                toast.success("Logged out successfully");
                navigate("/");
            }
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                            <p className="text-indigo-100">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!isEditing ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                                    <p className="text-lg font-medium text-gray-900">{user.name}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                                    <p className="text-lg font-medium text-gray-900">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => {
                                        setName(user.name);
                                        setEmail(user.email);
                                        setIsEditing(true);
                                    }}
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => navigate("/my-orders")}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    My Orders
                                </button>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full px-6 py-3 border-2 border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Enter your name"
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Enter your email"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password (Optional)</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                                placeholder="Leave blank to keep current password"
                                            />
                                        </div>

                                        {newPassword && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                                    placeholder="Confirm your new password"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Enter current password to confirm changes"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Required to save any changes</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(user.name);
                                        setEmail(user.email);
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
