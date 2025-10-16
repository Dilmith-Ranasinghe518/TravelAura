import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


function RegisterUser() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.msg);

      if (res.ok) {
        navigate("/login");
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />  
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden">
        {/* Left panel */}
        <div className="w-full md:w-1/2 bg-sky-100 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Create Your Account
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of travelers exploring Sri Lanka
          </p>

          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✈️</span>
              <span className="text-green-600 font-medium">
                Exclusive travel deals
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🏨</span>
              <span className="text-blue-600 font-medium">
                Personalized recommendations
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⭐</span>
              <span className="text-orange-600 font-medium">
                Reward points on bookings
              </span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-amber-600">
              Create Account
            </h2>
            <p className="text-sm text-gray-600">
              Sign up to start your journey
            </p>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full mt-1 px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

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
              <input
                type="password"
                placeholder="Create a password"
                className="w-full mt-1 px-4 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {/* Gradient Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 flex items-center justify-center ${
                isSubmitting
                  ? "bg-sky-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600"
              }`}
            >
              {isSubmitting ? "Creating Account..." : "Create Account →"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-200" />
              <span className="px-3 text-gray-500 text-sm">Or</span>
              <hr className="flex-grow border-gray-200" />
            </div>

            {/* Links */}
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                Are you an administrator?{" "}
                <Link
                  to="/register-admin"
                  className="text-teal-600 font-medium hover:underline"
                >
                  Register here
                </Link>
              </p>
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-amber-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Fotter />
    </div>
  );
}

export default RegisterUser;