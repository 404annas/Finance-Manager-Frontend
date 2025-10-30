import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

// --- API Functions for Notifications ---
const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.notifications || [];
};

const markNotificationsAsReadAPI = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.put(`${API_URL}/api/notifications/mark-as-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

const deleteNotificationAPI = async (notificationId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};


// --- The Main Custom Hook ---
export const useNotifications = () => {
    const queryClient = useQueryClient();
    const socket = useSocket();

    const { data: notifications = [] } = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotifications,
        staleTime: Infinity, // The data is only ever changed by real-time events or mutations
    });

    const { mutate: markAllAsRead } = useMutation({
        mutationFn: markNotificationsAsReadAPI,
        onSuccess: () => {
            queryClient.setQueryData(["notifications"], (oldData) =>
                oldData.map(n => ({ ...n, read: true }))
            );
        },
    });

    const { mutate: deleteNotification } = useMutation({
        mutationFn: deleteNotificationAPI,
        onSuccess: (_, notificationId) => {
            queryClient.setQueryData(["notifications"], (oldData) =>
                oldData.filter((n) => n._id !== notificationId)
            );
        },
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return { notifications, unreadCount, markAllAsRead, deleteNotification };
};

// This is the headless listener.
export const AppNotificationListener = () => {
    const queryClient = useQueryClient();
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;
        const handleNewNotification = (newNotification) => {
            toast.info(newNotification.message, { icon: '🔔' });
            queryClient.setQueryData(["notifications"], (oldData) => {
                return oldData ? [newNotification, ...oldData] : [newNotification];
            });
        };
        socket.on("new_notification", handleNewNotification);
        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket, queryClient]);

    return null; // Renders nothing
};