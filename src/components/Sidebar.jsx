import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CreditCard, History, Layers2, RefreshCcw, UsersRound, PhoneForwarded, UserCheck2, Handshake } from "lucide-react";

const Sidebar = () => {
    const location = useLocation();

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

    return (
        <div className="w-[20%] h-screen border-r border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-2">
            <h2 className="text-xl p-bold text-[#6667DD] mb-6">FinSync - <span className="text-sm p-medium">Track Finances</span></h2>

            {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        to={item.path}
                        key={index}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300
                            ${isActive
                                ? "bg-purple-100 text-[#6667DD] font-medium"
                                : "text-gray-600 hover:bg-purple-100 hover:text-[#6667DD]"}
                        `}
                    >
                        {item.icon}
                        <span className="p-medium">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default Sidebar;
