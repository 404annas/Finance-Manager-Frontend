import axios from "axios";

const fetchUsers = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const { data } = await axios.get(`${API_URL}/api/users`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    return data.json();
}

export default fetchUsers;