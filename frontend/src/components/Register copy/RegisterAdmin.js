import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";


function RegisterAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    securityCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/register-admin", {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left panel */}
        <div className="w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Admin Portal Access</h2>
            <p className="text-blue-100 mb-8">
              Secure registration for administrators only
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔒</span>
                <span>Enhanced security protocols</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚙️</span>
                <span>Full system management access</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <span>Analytics and reporting tools</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg mt-8">
            <h4 className="text-lg font-semibold">Security Notice</h4>
            <p className="text-sm text-blue-100 mt-2">
              Admin registration requires authorization. Please ensure you have
              the proper security code before proceeding.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-1/2 p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Admin Registration
              </h2>
              <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-600 rounded-full">
                Restricted Access
              </span>
            </div>
            <p className="text-gray-500 text-sm">Authorized personnel only</p>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                placeholder="Create a strong password"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use at least 8 characters with a mix of letters, numbers and
                symbols
              </p>
            </div>

            {/* Security Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Security Code
              </label>
              <input
                type="password"
                placeholder="Enter security authorization code"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.securityCode}
                onChange={(e) =>
                  setForm({ ...form, securityCode: e.target.value })
                }
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This code is provided by system administrators
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Verifying Credentials..." : "Register Admin Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">
                Authorization Required
              </span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Links */}
            <div className="text-sm text-gray-600">
              <p>
                Looking for user registration?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Register here
                </Link>
              </p>
              <p className="mt-2">
                Already have an admin account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline"
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

export default RegisterAdmin;