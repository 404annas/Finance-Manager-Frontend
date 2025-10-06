import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "./screens/UserDashboard";
import Hero from "./components/Hero";
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
import Recipients from "./components/Recipients";
import RecipientsData from "./components/RecipientsData";

function App() {
  const { user } = useAppContext();

  return (
    <Router>
      <Toaster position="bottom-right" richColors />

      <Routes>
        <Route
          path="/"
          element={user ? <UserDashboard /> : <Navigate to="/login" />}
        >
          <Route index element={<Hero />} />
          <Route path="payments" element={<Payments />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="exchange" element={<CurrencyExchange />} />
          <Route path="reminder" element={<Reminder />} />
          <Route path="profile" element={<Profile />} />
          <Route path="contact" element={<Contact />} />
          <Route path="users" element={<AddUsers />} />
          <Route path="all-users" element={<Users />} />
          <Route path="recipients" element={<Recipients />} />
          <Route path="recipient/:id" element={<RecipientsData />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
