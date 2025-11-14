import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

export const fetchTransactions = async ({ page = 1, limit = 10, sort = 'date', order = 'desc', category, dateFrom, dateTo }) => {
    const params = new URLSearchParams({
        page,
        limit,
        sort,
        order,
    });

    if (category && category !== 'All') {
        params.append('category', category);
    }
    if (dateFrom) {
        params.append('dateFrom', dateFrom);
    }
    if (dateTo) {
        params.append('dateTo', dateTo);
    }

    const { data } = await axios.get(`${API_URL}/api/transactions?${params.toString()}`, {
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