import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Function to get the auth token
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Fucntion for fetching users
export const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/api/users`, {
        headers: getAuthHeaders(),
    });
    return res.data.users;
}

// Function to delete a user
export const deleteUsers = async (userId) => {
    const res = await axios.delete(`${API_URL}/api/delete-user/${userId}`, {
        headers: getAuthHeaders(),
    });
    return res.data;
}