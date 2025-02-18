import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Thêm thư viện thông báo (npm install react-toastify)

function Booking() {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(""); // Ngày đặt vé
  const [trip, setTrip] = useState(""); // Chuyến xe
  const [price, setPrice] = useState(0); // Giá vé

  // Danh sách chuyến xe và giá vé cố định
  const trips = {
    "Hà Nội → Sài Gòn": 500000,
    "Hải Phòng → Đà Nẵng": 350000,
  };

  // Lấy email từ localStorage khi component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("user");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Khi chọn chuyến, tự động cập nhật giá vé
  const handleTripChange = (e) => {
    const selectedTrip = e.target.value;
    setTrip(selectedTrip);
    setPrice(trips[selectedTrip]); // Lấy giá từ danh sách
  };

  // Xử lý đặt vé
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trip || !date) {
      toast.error("⚠️ Vui lòng chọn chuyến và ngày đi!");
      return;
    }

    const bookingData = { email, date, trip, price };

    try {
      const response = await fetch("http://localhost:8000/api.php?action=bookTicket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      // Log phản hồi API để kiểm tra chi tiết
      console.log(data);

      if (data.success) {
        toast.success("🎉 Đặt vé thành công!");
        setDate("");
        setTrip("");
        setPrice(0);
      } else {
        toast.error("❌ " + data.message);
      }
    } catch (error) {
      toast.error("⚠️ Lỗi kết nối server!");
      console.error("Error:", error);
    }
};


  return (
    <div className="max-w-2xl w-[600px] bg-white rounded-2xl shadow-2xl p-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Đặt Vé Xe</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email (Không cho sửa) */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
            value={email}
            readOnly
          />
        </div>

        {/* Ngày đặt vé */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Chọn ngày đi</label>
          <input
            type="date"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Chọn chuyến */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Chọn chuyến xe</label>
          <select
            className="w-full px-5 py-3 border border-gray-300 rounded-lg"
            value={trip}
            onChange={handleTripChange}
          >
            <option value="">-- Chọn chuyến --</option>
            {Object.keys(trips).map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>

        {/* Giá tiền */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Giá vé</label>
          <input
            type="text"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            value={price ? `${price.toLocaleString()} VND` : ""}
            readOnly
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 text-lg rounded-lg transition-colors"
        >
          Đặt Vé
        </button>
      </form>
    </div>
  );
}

export default Booking;
