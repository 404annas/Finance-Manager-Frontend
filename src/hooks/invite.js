import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const sendInvite = async (data) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/invite`, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}