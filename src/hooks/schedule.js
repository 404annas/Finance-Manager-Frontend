import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getApiClient = () => {
    const token = localStorage.getItem("token");
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
};

// 1. READ: Fetch all payment schedules
export const fetchSchedules = async () => {
    const apiClient = getApiClient();
    const { data } = await apiClient.get("/api/schedules");
    return Array.isArray(data.schedules) ? data.schedules : [];
};

// 2. CREATE: Add a new payment schedule
export const addSchedule = async (scheduleData) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post("/api/schedule-payment", scheduleData);
    return data;
};

// 3. DELETE: Delete a single schedule by ID
export const deleteSchedule = async (scheduleId) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.delete(`/api/schedule/${scheduleId}`);
    return data;
};

// 4. DELETE ALL: Delete all payment schedules
export const deleteAllSchedules = async () => {
    const apiClient = getApiClient();
    const { data } = await apiClient.delete("/api/schedules");
    return data;
};