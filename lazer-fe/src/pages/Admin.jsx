import React from 'react'
import { Link } from 'react-router-dom';

function Admin() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Trang Quản Lý</h1>

      {/* Mục Quản lý tài khoản */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quản lý Tài Khoản</h2>
        <p className="text-gray-600 mb-4">Quản lý thông tin và quyền truy cập của các người dùng trong hệ thống.</p>
        <Link
          to="/admin/manage-users"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Xem Danh Sách Tài Khoản
        </Link>
      </div>

      {/* Mục Quản lý vé */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quản lý Vé</h2>
        <p className="text-gray-600 mb-4">Quản lý các vé đã được đặt trong hệ thống.</p>
        <Link
          to="/admin/manage-tickets"
          className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Xem Danh Sách Vé
        </Link>
      </div>
    </div>
  )
}

export default Admin;
