import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const Users = () => {
    // State is now split to handle both relationships
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [invitedBy, setInvitedBy] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingUserIds, setDeletingUserIds] = useState({});

    const API_URL = import.meta.env.VITE_API_URL;

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
                    // Set both pieces of state from the new structured response
                    setInvitedUsers(data.users.invitedUsers || []);
                    setInvitedBy(data.users.invitedBy || null);
                } else {
                    setError(data.message || "Failed to fetch users.");
                }
            } catch (err) {
                setError("Network error or something went wrong.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleUserDelete = async (userId) => {
        setDeletingUserIds((prev) => ({ ...prev, [userId]: true }));
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
                // Correctly filter the 'invitedUsers' state
                setInvitedUsers(currentUsers => currentUsers.filter((user) => user._id !== userId));
            } else {
                toast.error(data.message || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        } finally {
            setDeletingUserIds((prev) => ({ ...prev, [userId]: false }));
        }
    };

    if (loading) {
        return <div className="p-6 text-center p-regular text-[#6667DD] animate-pulse">Loading users...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600 p-regular">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            {/* SECTION 1: Users You Have Invited */}
            <div>
                <h2 className="text-2xl p-bold mb-4 text-[#6667DD]">Invited Users</h2>
                {invitedUsers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {invitedUsers.map((user) => {
                            const isDeleting = deletingUserIds[user._id];
                            return (
                                <div key={user._id} className="flex items-center justify-between px-4 py-6 bg-[#F6F9FC] shadow rounded-lg">
                                    <div className="flex items-center">
                                        <img src={user.profileImage || "..."} alt={user.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
                                        <div>
                                            <h3 className="text-lg p-semibold">{user.name}</h3>
                                            <p className="text-gray-500 p-regular">{user.email}</p>
                                            <p className={`text-sm p-medium ${user.status === 'accepted' ? 'text-green-600' : 'text-orange-500'}`}>Status: {user.status}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUserDelete(user._id)}
                                        disabled={isDeleting}
                                        className={`p-medium flex items-center gap-2 p-2 rounded-md transition-all duration-300 ${isDeleting ? 'hover:cursor-not-allowed' : 'text-red-600 hover:text-red-700 underline cursor-pointer'}`}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                                Delete User
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-6 text-center text-[#6667DD] p-medium">You have not invited other users.</div>
                )}
            </div>

            {/* SECTION 2: The User Who Invited You */}
            <div className="mt-10">
                <h2 className="text-2xl p-bold mb-4 text-[#6667DD]">Invited By</h2>
                {invitedBy ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div key={invitedBy._id} className="flex items-center justify-between px-4 py-6 bg-[#F6F9FC] shadow rounded-lg">
                            <div className="flex items-center">
                                <img src={invitedBy.profileImage || "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFufGVufDB8fDB8fHww"} alt={invitedBy.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
                                <div>
                                    <h3 className="text-lg p-semibold">{invitedBy.name}</h3>
                                    <p className="text-gray-500 p-regular">{invitedBy.email}</p>
                                </div>
                            </div>
                            {/* No delete button here, as you cannot delete your inviter */}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-[#6667DD] p-medium">You were not invited by any user.</div>
                )}
            </div>
        </div>
    );
};

export default Users;