import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "./screens/UserDashboard";
import Hero from "./components/Hero";
import AdminDashboard from "./screens/AdminDashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import { Toaster } from "sonner";
import { useAppContext } from "../context/AppContext";
import Profile from "./components/Profile";
import AddUsers from "./components/AddUsers";
import Users from "./components/Users";
import CurrencyExchange from "./components/CurrencyExchange";
import Transactions from "./components/Transactions";
import Reminder from "./components/Reminder";
import Payments from "./components/Payments";
import Contact from "./components/Contact";

function App() {
  const { user } = useAppContext();

  return (
    <Router>
      <Toaster position="bottom-right" richColors />

      <Routes>
        {/* User Dashboard */}
        <Route
          path="/"
          element={
            user?.role === "user" ? <UserDashboard /> : <Navigate to="/login" />
          }
        >
          <Route index element={<Hero role="user" />} />
          <Route path="payments" element={<Payments />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="exchange" element={<CurrencyExchange />} />
          <Route path="reminder" element={<Reminder />} />
          <Route path="profile" element={<Profile />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />
          }
        >
          <Route index element={<Hero role="admin" />} />
          <Route path="payments" element={<div>Payments</div>} />
          <Route path="transactions" element={<div>Transactions</div>} />
          <Route path="exchange" element={<CurrencyExchange />} />
          <Route path="reminder" element={<Reminder />} />
          <Route path="users" element={<AddUsers />} />
          <Route path="profile" element={<Profile />} />
          <Route path="user" element={<Users />} />
        </Route>

        {/* Auth Routes (independent, not nested) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
