import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api.php?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      console.log("🔍 API Response:", text);
      const data = JSON.parse(text);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", email); 

        // Hiển thị thông báo thành công
        toast.success(`🎉 Xin chào, ${email}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          window.location.href = "/"; // Chuyển hướng về trang chủ sau 3s
        }, 3000);
      } else {
        toast.error("❌ " + data.message, { position: "top-right" });
        setError(data.message);
      }
    } catch (err) {
      console.error("🔥 Lỗi trong quá trình login:", err);
      toast.error("⚠️ Lỗi kết nối server!", { position: "top-right" });
      setError("Lỗi kết nối server! Vui lòng kiểm tra console.");
    }
  };

  return (
    <div className="max-w-2xl w-[600px] bg-white rounded-2xl shadow-2xl p-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sign In</h2>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 text-lg rounded-lg transition-colors"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-center">
        <span className="text-gray-600 text-lg">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-medium">
            Sign Up
          </Link>
        </span>
      </div>

      {/* Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </div>
  );
}

export default Login;
