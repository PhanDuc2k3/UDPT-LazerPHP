import React, { useState, useEffect } from "react";

function ManageTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:8000/api.php?action=getTickets");
        const data = await response.json();

        if (data.success) {
          setTickets(data.data); // Lưu danh sách vé vào state
        } else {
          console.error("Không thể lấy vé");
        }
      } catch (error) {
        console.error("Lỗi khi kết nối tới server", error);
      }
    };

    fetchTickets();
  }, []); // Chạy một lần khi component được render

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">Quản lý vé</h2>
      
      {/* Bảng hiển thị vé với cuộn */}
      <div className="overflow-x-auto max-h-150">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Ngày</th>
              <th className="py-3 px-4 text-left">Chuyến đi</th>
              <th className="py-3 px-4 text-left">Giá</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{ticket.id}</td>
                  <td className="py-3 px-4">{ticket.email}</td>
                  <td className="py-3 px-4">{ticket.date}</td>
                  <td className="py-3 px-4">{ticket.trip}</td>
                  <td className="py-3 px-4">{ticket.price}</td>
                  <td className="py-3 px-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                      Xóa
                    </button>
                    {/* Thêm các hành động như chỉnh sửa */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3">Không có vé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageTickets;
