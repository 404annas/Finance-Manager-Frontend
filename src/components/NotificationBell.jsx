import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns"; // The library we installed

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const navigate = useNavigate();

    const handleToggle = () => {
        const willOpen = !isOpen;
        setIsOpen(willOpen);
        // If we are opening the dropdown and there are unread items, mark them as read
        if (willOpen && unreadCount > 0) {
            markAllAsRead();
        }
    };

    const handleNotificationClick = (notification) => {
        setIsOpen(false); // Close dropdown on any click
        if (notification.link) {
            navigate(notification.link); // Navigate to the relevant page
        }
    };

    return (
        <div className="relative">
            {/* The Bell Icon Button */}
            <button
                onClick={handleToggle}
                className="bg-purple-100 p-2.5 sm:p-3 rounded-xl hover:bg-purple-200 transition duration-300 cursor-pointer flex-shrink-0 relative"
            >
                <Bell size={20} className="text-[#6667DD]" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* The Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#F3E8FF] rounded-lg shadow-xl border border-[#6667DD] z-50">
                    <div className="p-3 border-b text-gray-800 p-semibold">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div
                                    key={n._id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${!n.read ? 'bg-blue-50' : ''}`}
                                >
                                    <p className="text-sm text-gray-800 p-regular">{n.message}</p>
                                    <p className="text-xs text-gray-500 mt-1 p-regular">
                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-500 p-regular">You're all caught up!</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;