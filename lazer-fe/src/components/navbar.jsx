import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import images from "../assets/images";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Trạng thái hiển thị dropdown

  // Kiểm tra xem đã đăng nhập chưa khi load trang
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsOpen(false); // Ẩn dropdown sau khi đăng xuất
  };

  return (
    <div className="bg-white w-screen h-[10vh] flex justify-between items-center px-8 shadow-md relative">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={images.logo} alt="Logo" className="h-20" />
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex space-x-6 text-lg font-medium">
        <Link to="/" className="hover:text-blue-500">Trang chủ</Link>
        <Link to="/dat-ve" className="hover:text-blue-500">Đặt vé</Link>
        <Link to="/about" className="hover:text-blue-500">About Us</Link>
      </div>

      {/* Hiển thị user hoặc Login */}
      <div className="relative">
        {user ? (
          <div>
            {/* Nút Email - Nhấn để mở Dropdown */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-lg font-medium hover:text-blue-500 transition"
            >
              Xin chào, {user}!
            </button>

            {/* Dropdown Đăng Xuất */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg">
                {/* Nếu user là admin, thêm mục "Quản lý" */}
                {user === "admin@gmail.com" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-left text-blue-600 hover:bg-gray-100 rounded-lg"
                  >
                    Quản lý
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-lg"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
