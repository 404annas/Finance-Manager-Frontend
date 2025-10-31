import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Your auth token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const updateUserProfileAPI = async (formData) => {
    const { data } = await api.put('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}