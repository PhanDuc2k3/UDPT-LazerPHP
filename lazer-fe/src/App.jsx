import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import Home from "./pages/home";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/layout";
import Admin from "./pages/Admin";
import ManageUsers from "./pages/mangageUsers";
import ManageTickets from "./pages/manageTicket";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Layout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dat-ve" element={<Booking />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} /> {/* Chỉ cho phép admin đăng nhập */}
          <Route path="/admin/manage-users" element={<ManageUsers />} /> {/* Chỉ cho phép admin quản lý người dùng */}
          <Route path="/admin/manage-tickets" element={<ManageTickets />} /> {/* Chỉ cho phép admin quản lý vé */}
        </Routes>
      </Layout>
      <ToastContainer /> {/* Hiển thị thông báo */}
    </Router>
  );
}

export default App;
