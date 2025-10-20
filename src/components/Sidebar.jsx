import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  History,
  Layers2,
  RefreshCcw,
  UsersRound,
  PhoneForwarded,
  UserCheck2,
  Handshake,
  Menu,
  ListMinus,
  X
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={23} />, label: "Dashboard", path: `/` },
    { icon: <CreditCard size={23} />, label: "Payments", path: `/payments` },
    { icon: <Layers2 size={23} />, label: "Transactions", path: `/transactions` },
    { icon: <Handshake size={23} />, label: "Recipients", path: `/recipients` },
    { icon: <RefreshCcw size={23} />, label: "Exchange", path: `/exchange` },
    { icon: <History size={23} />, label: "Reminder", path: `/reminder` },
    { icon: <PhoneForwarded size={22} />, label: "Contact", path: `/contact` },
    { icon: <UserCheck2 size={23} />, label: "All Users", path: `/all-users` },
    { icon: <UsersRound size={23} />, label: "Add Users", path: `/users` },
  ];

  // Disable body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      {/* Chat-bubble Menu Icon */}
      <div className="lg:hidden fixed top-5 left-5 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-10 bg-gradient-to-r from-[#6667DD] to-[black] text-white shadow-xl rounded-full hover:scale-110 transition-transform duration-300 relative"
        >
          <ListMinus size={20} />
          {/* Bubble pointer effect */}
          <span className="absolute -bottom-4 -left-2 w-4 h-4 bg-gradient-to-r from-[#6667DD] to-[black] rotate-45 rounded-sm shadow-md"></span>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-lg z-50 p-4 flex flex-col gap-4
          w-[70%] max-w-xs
          overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:w-[20%] lg:max-w-none
        `}
      >
        {/* Header with heading + close icon */}
        <div className="flex items-center justify-between mb-6 lg:mb-4">
          <h2 className="text-xl p-bold text-[#6667DD]">
            FinSync
            <span className="text-xs sm:text-sm p-medium"> - Track Finances</span>
          </h2>
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              to={item.path}
              key={index}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300
                ${isActive
                  ? "bg-purple-100 text-[#6667DD] font-medium"
                  : "text-gray-600 hover:bg-purple-100 hover:text-[#6667DD]"
                }
              `}
            >
              {item.icon}
              <span className="p-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
