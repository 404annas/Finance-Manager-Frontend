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
export const fetchSchedules = async ({ page = 1, limit = 10, sort = 'scheduledDate', order = 'asc' }) => {
    const apiClient = getApiClient();
    const params = new URLSearchParams({
        page,
        limit,
        sort,
        order,
    });

    const { data } = await apiClient.get(`/api/schedules?${params.toString()}`);
    return data;
};

// 2. CREATE: Add a new payment schedule
export const addSchedule = async (scheduleData) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post("/api/schedule-payment", scheduleData);
    return data;
};

export const updateSchedule = async ({ id, scheduleData }) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.put(`/api/schedule/${id}`, scheduleData);
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