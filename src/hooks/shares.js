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

export const fetchShares = async () => {
    const apiClient = getApiClient();
    const { data } = await apiClient.get("/api/shares");
    return data.shares || [];
};

export const fetchRecipients = async () => {
    const apiClient = getApiClient();
    const { data } = await apiClient.get("/api/shares/recipients");
    return data.recipients || [];
};

export const createShare = async (shareData) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post("/api/shares", shareData);
    return data;
};

export const deleteShare = async (shareId) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.delete(`/api/shares/${shareId}`);
    return data;
};