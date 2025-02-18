import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Điều hướng React Router

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api.php?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
        setTimeout(() => navigate("/login"), 2000); // Chuyển hướng sau 2 giây
      } else {
        setError(data.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      setError("Lỗi kết nối đến server!");
    }
  };

  return (
    <div className="max-w-2xl w-[600px] bg-white rounded-2xl shadow-2xl p-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sign Up</h2>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg text-lg"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg rounded-lg">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
