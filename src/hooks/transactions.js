import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

export const fetchTransactions = async () => {
    const { data } = await axios.get(`${API_URL}/api/transactions`, {
        headers: getAuthHeaders(),
    });
    return data;
}

export const addTransactions = async (formData) => {
    const { data } = await axios.post(`${API_URL}/api/transactions`, formData, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const updateTransaction = async ({ id, formData }) => {
    const { data } = await axios.put(`${API_URL}/api/transactions/${id}`, formData, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export const deleteTransaction = async (transactionId) => {
    const { data } = await axios.delete(`${API_URL}/api/transactions/${transactionId}`, {
        headers: getAuthHeaders(),
    });
    return data;
};

export const deleteAllTransactions = async () => {
    const { data } = await axios.delete(`${API_URL}/api/transactions`, {
        headers: getAuthHeaders(),
    });
    return data;
};