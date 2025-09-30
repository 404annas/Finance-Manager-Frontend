import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();

                if (res.ok) {
                    setUsers(data.users || []);
                    console.log("Fetched users:", data.users);
                } else {
                    setError(data.message || "Failed to fetch users.");
                    console.error("Backend error:", data.message);
                    setUsers([]);
                }
            } catch (err) {
                console.error("Frontend fetch error:", err);
                setError("Network error or something went wrong.");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    if (loading) {
        return <div className="p-6 text-center p-regular text-[#6667DD]">Loading users...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600 p-regular">Error: {error}</div>;
    }

    if (users.length === 0) {
        return <div className="p-6 text-center text-[#6667DD] p-regular">No invited users found.</div>;
    }

    const handleUserDelete = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/api/delete-user/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("User deleted successfully.");
                setUsers(users.filter(user => user._id !== userId));
            } else {
                toast.error(data.message || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl p-bold mb-4 text-[#6667DD]">Invited Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="flex items-center justify-between px-4 py-6 bg-[#E9D4FF] shadow rounded-lg"
                    >
                        <div className="flex items-center">
                            <img
                                loading="lazy"
                                src={user.profileImage || "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1hbnxlbnwwfHwwfHx8MA%3D%3D"}
                                alt={user.name}
                                className="w-16 h-16 rounded-full mr-4 object-cover"
                            />
                            <div>
                                <h3 className="text-lg p-semibold">{user.name}</h3>
                                <p className="text-gray-500 p-regular">{user.email}</p>
                                <p className={`text-sm p-medium ${user.status === 'accepted' ? 'text-green-600' : 'text-orange-500'}`}>
                                    Status: {user.status}
                                </p>
                            </div>
                        </div>
                        {/* Delete icon */}
                        <button onClick={() => handleUserDelete(user._id)} className="flex items-center text-red-600 p-medium hover:underline cursor-pointer">
                            <Trash2 className="w-5 h-5 mr-1" />
                            Delete User
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Users;