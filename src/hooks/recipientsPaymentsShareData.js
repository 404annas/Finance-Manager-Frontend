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
export const fetchPaymentsForShare = async ({ shareId, page, limit, sort, order, searchTerm }) => {
    if (!shareId) return { payments: [], totalPayments: 0 };
    const apiClient = getApiClient();
    const params = new URLSearchParams({ page, limit, sort, order, searchTerm });
    const { data } = await apiClient.get(`/api/shares/${shareId}/payments?${params.toString()}`);
    return data;
};

// 2. CREATE: Add a new payment to a specific share (handles FormData)
export const addPaymentToShare = async ({ shareId, paymentData }) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.post(`/api/shares/${shareId}/payments`, paymentData, {
        headers: { "Content-Type": "application/json" },
    });
    return data;
};

export const updatePayment = async ({ paymentId, paymentData }) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.put(`/api/payments/${paymentId}`, paymentData, {
        headers: { "Content-Type": "application/json" },
    });
    return data;
};

// 3. DELETE: Delete a single payment by its own ID
export const deletePayment = async (paymentId) => {
    const apiClient = getApiClient();
    const { data } = await apiClient.delete(`/api/payments/${paymentId}`);
    return data;
};