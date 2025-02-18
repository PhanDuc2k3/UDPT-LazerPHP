import React, { useState, useEffect } from "react";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Mảng các URL của các server Slave
        const slaveServers = [
          "http://localhost:8001/api.php?action=getUsers",
          "http://localhost:8002/api.php?action=getUsers"
        ];

        // Chọn ngẫu nhiên một server Slave để gọi API
        const slaveUrl = slaveServers[Math.floor(Math.random() * slaveServers.length)];

        const response = await fetch(slaveUrl);
        const data = await response.json();

        if (data.success) {
          setUsers(data.data); // Lưu danh sách người dùng vào state
        } else {
          console.error("Không thể lấy người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi kết nối tới server", error);
      }
    };

    fetchUsers();
  }, []); // Chạy một lần khi component được render

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">Quản lý người dùng</h2>
      
      {/* Bảng hiển thị người dùng với cuộn và cố định cột */}
      <div className="overflow-x-auto max-h-150">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left sticky left-0 bg-gray-800 z-10">ID</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4 sticky left-0 bg-white">{user.id}</td>
                  <td className="py-3 px-4">{user.email}</td>
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
                <td colSpan="3" className="text-center py-3">Không có người dùng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
