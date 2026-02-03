import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
const Auth = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { setShowUserLogin, setUser, axios } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (state === "login") {
        const { data } = await axios.post("/api/user/login", { email, password });
        if (data.success) {
          toast.success(data.message);
          setUser(data.user);
          setShowUserLogin(false);
        }
      } else if (state === "register") {
        const { data } = await axios.post("/api/user/register", { name, email, password });
        if (data.success) {
          toast.success(data.message);
          setState("verify");
        }
      } else if (state === "verify") {
        const { data } = await axios.post("/api/user/verify-account", { email, otp });
        if (data.success) {
          toast.success(data.message);
          setState("login");
        }
      }
    } catch (error) {
      if (error.response?.data?.notVerified) {
        toast.error("Please verify your email first");
        setState("verify");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const { data } = await axios.post("/api/user/resend-otp", { email });
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 left-0 bottom-0 right-0 z-30 flex items-center justify-center  bg-black/50 text-gray-600"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white animate-fadeIn"
      >
        <p className="text-2xl font-medium m-auto mb-2 text-indigo-600">
          {state === "login" ? "Welcome Back" : state === "register" ? "Join Us" : "Verify Account"}
        </p>

        {state !== "verify" && (
          <>
            {state === "register" && (
              <div className="w-full">
                <p className="text-sm font-medium mb-1">Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Your full name"
                  className="border border-gray-200 rounded w-full p-2.5 outline-indigo-500 transition-all focus:border-indigo-500"
                  type="text"
                  required
                />
              </div>
            )}
            <div className="w-full ">
              <p className="text-sm font-medium mb-1">Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="example@mail.com"
                className="border border-gray-200 rounded w-full p-2.5 outline-indigo-500 transition-all focus:border-indigo-500"
                type="email"
                required
              />
            </div>
            <div className="w-full ">
              <p className="text-sm font-medium mb-1">Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="••••••••"
                className="border border-gray-200 rounded w-full p-2.5 outline-indigo-500 transition-all focus:border-indigo-500"
                type="password"
                required
              />
            </div>
          </>
        )}

        {state === "verify" && (
          <div className="w-full text-center">
            <p className="text-sm text-gray-500 mb-6"> We've sent a 6-digit verification code to <span className="font-semibold text-gray-700">{email}</span></p>
            <div className="w-full">
              <p className="text-sm font-medium mb-1 text-left">Verification Code</p>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                placeholder="000000"
                maxLength="6"
                className="border border-gray-200 rounded w-full p-3 text-2xl text-center tracking-[10px] outline-indigo-500 transition-all focus:border-indigo-500 font-bold"
                type="text"
                required
              />
            </div>
            <p className="text-sm mt-4">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-indigo-500 font-semibold cursor-pointer hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </div>
        )}

        {state === "register" ? (
          <p className="text-sm">
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-indigo-500 font-semibold cursor-pointer hover:underline"
            >
              Login here
            </span>
          </p>
        ) : state === "login" ? (
          <p className="text-sm">
            New here?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-500 font-semibold cursor-pointer hover:underline"
            >
              Create an account
            </span>
          </p>
        ) : (
          <p className="text-sm">
            Back to{" "}
            <span
              onClick={() => setState("login")}
              className="text-indigo-500 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        )}

        <button
          disabled={submitting}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-all text-white w-full py-2.5 rounded-md cursor-pointer font-bold mt-2 shadow-md hover:shadow-lg active:scale-95"
        >
          {submitting ? "Processing..." : state === "register" ? "Sign Up" : state === "login" ? "Login" : "Verify Account"}
        </button>
      </form>
    </div>
  );
};
export default Auth;
