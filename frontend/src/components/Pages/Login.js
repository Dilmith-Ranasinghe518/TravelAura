import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful! 🎉");
        if (data.user.role === "admin") {
          navigate("/admindash");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Header />
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-6">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden">
        {/* Left panel with image */}
        <div className="w-full md:w-1/2 relative">
          <img
            src="https://i.pinimg.com/1200x/3f/17/30/3f17304aea5ee39920f5b1d80c85a7f4.jpg"
            alt="Travel inspiration"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-sky-900/40 flex flex-col justify-center p-10 text-white">
            <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
            <p className="text-lg text-sky-100 mb-8">
              Sign in to continue your journey
            </p>

            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌟</span>
                <span>Access your travel history</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📋</span>
                <span>Manage your bookings</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔐</span>
                <span>Secure account protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 p-10 flex items-center">
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <h2 className="text-2xl font-bold text-amber-600">Sign In</h2>
            <p className="text-sm text-gray-600">
              Enter your credentials to continue
            </p>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full mt-1 px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none pr-10"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
                isSubmitting
                  ? "bg-sky-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
              }`}
            >
              {isSubmitting ? "Signing In..." : "Sign In →"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-200" />
              <span className="px-3 text-gray-500 text-sm">
                Or continue with
              </span>
              <hr className="flex-grow border-gray-200" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-sky-50 transition"
              >
                <span className="mr-2">🔍</span> Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-sky-50 transition"
              >
                <span className="mr-2">ƒ</span> Facebook
              </button>
            </div>

            {/* Links */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-amber-600 font-medium hover:underline"
                >
                  Register here
                </Link>
              </p>
              {/* <p>
                Are you an administrator?{" "}
                <Link
                  to="/admin-login"
                  className="text-teal-600 font-medium hover:underline"
                >
                  Admin login
                </Link>
              </p> */}
            </div>
          </form>
        </div>
      </div>
     
    </div>
    <Fotter />
    </div>
  );
}

export default Login;