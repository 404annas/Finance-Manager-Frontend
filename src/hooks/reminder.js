import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const sendReminder = async (reminderData) => {
    const response = await axios.post(`${API_URL}/api/send-reminder`, reminderData, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
}