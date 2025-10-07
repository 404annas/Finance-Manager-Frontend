import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getApiClient = () => {
    const token = localStorage.getItem("token");
    const apiClient = axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return apiClient;
};

// 1. READ: Fetch all completed payments
export const fetchPaymentsDone = async () => {
    const apiClient = getApiClient();
    const { data } = await apiClient.get("/api/payments-done");
    return Array.isArray(data.payments) ? data.payments : [];
};

// 2. CREATE: Add a new payment
export const addPaymentDone = async (newPaymentData) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post("/api/payments-done", newPaymentData);
    return data;
};

// 3. DELETE: Delete a single payment by ID
export const deletePaymentDone = async (paymentId) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.delete(`/api/payments-done/${paymentId}`);
    return data;
};

// 4. DELETE ALL: Delete all completed payments
export const deleteAllPaymentsDone = async () => {
    const apiClient = getApiClient();
    const { data } = await apiClient.delete("/api/payments-done");
    return data;
};