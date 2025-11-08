import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to create an authenticated axios instance
const getApiClient = () => {
    const token = localStorage.getItem("token");
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// 1. READ: Fetch all payments for a specific share
export const fetchPaymentsForShare = async (shareId) => {
    if (!shareId) return []; // Don't fetch if there's no ID
    const apiClient = getApiClient();
    const { data } = await apiClient.get(`/api/shares/${shareId}/payments`);
    return data.payments || [];
};

// 2. CREATE: Add a new payment to a specific share (handles FormData)
export const addPaymentToShare = async ({ shareId, paymentFormData }) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post(`/api/shares/${shareId}/payments`, paymentFormData, {
        headers: {
            // No need to set Content-Type for FormData, axios handles it
        },
    });
    return data;
};

export const updatePayment = async ({ paymentId, paymentFormData }) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.put(`/api/payments/${paymentId}`, paymentFormData, {
        headers: { /* Axios handles Content-Type for FormData */ },
    });
    return data;
};

// 3. DELETE: Delete a single payment by its own ID
export const deletePayment = async (paymentId) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.delete(`/api/payments/${paymentId}`);
    return data;
};