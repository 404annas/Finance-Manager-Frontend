import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSocket } from "./SocketContext"; // Use the socket from our other context
import axios from "axios";
import { toast } from "sonner";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const socket = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;

    // 1. Fetch the user's existing notifications when the app loads
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setNotifications(res.data.notifications);
                // Calculate the initial unread count
                setUnreadCount(res.data.notifications.filter(n => !n.read).length);
            }).catch(err => console.error("Could not fetch initial notifications:", err));
        }
    }, []);

    // 2. Listen for real-time notifications from the socket connection
    useEffect(() => {
        if (!socket) return; // Don't do anything if the socket isn't connected yet

        const handleNewNotification = (newNotification) => {
            // Add the new notification to the top of the list
            setNotifications(prev => [newNotification, ...prev]);
            // Increment the unread count
            setUnreadCount(prev => prev + 1);
            // Show a nice pop-up toast to the user
            toast.info(newNotification.message, { icon: '🔔' });
        };

        // Set up the listener
        socket.on("new_notification", handleNewNotification);

        // Clean up the listener when the component unmounts
        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket]); // This effect will re-run if the socket connection changes

    // 3. Create a function to mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        if (unreadCount === 0) return;

        // Optimistic UI Update: Update the state immediately for a snappy user experience
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        try {
            const token = localStorage.getItem("token");
            // Use PUT to match your router setup (or change router to POST)
            await axios.put(`${API_URL}/api/notifications/mark-as-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Failed to mark notifications as read on server:", error);
            // In a real app, you might want to revert the optimistic update here on failure
        }
    }, [unreadCount, API_URL]);

    const value = { notifications, unreadCount, markAllAsRead };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};