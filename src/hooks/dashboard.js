import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDashboardStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const { data } = await axios.get(`${API_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};