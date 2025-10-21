import { Trash2, UserPlus2, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, deleteUsers } from "../hooks/getUsers";
import { useState } from "react";
import AddUsers from "./AddUsers";

const Users = () => {
    const queryClient = useQueryClient();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // 👈 new state
    const [userToDelete, setUserToDelete] = useState(null);

    const { data: usersData, isLoading, isError, error } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    const { mutate: deleteUserMutate, isPending: isDeletingUser } = useMutation({
        mutationFn: deleteUsers,
        onSuccess: (data) => {
            toast.success(data.message || "User Deleted Successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err) => {
            const errorMessage =
                err.response?.data?.message || err.message || "Failed To Delete User";
            toast.error(errorMessage);
        },
    });

    if (isLoading) {
        return (
            <div className="p-6 text-center p-regular text-[#6667DD] animate-pulse">
                Loading users...
            </div>
        );
    }

    if (isError) {
        const errorMessage = error.response?.data?.message || error.message;
        return (
            <div className="p-6 text-center text-red-600 p-regular">
                Error: {errorMessage}
            </div>
        );
    }

    const invitedUsers = usersData?.invitedUsers || [];
    const invitedBy = usersData?.invitedBy || null;

    return (
        <div className="p-6 relative">
            {/* SECTION 1: Users You Have Invited */}
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl p-bold mb-4 text-[#6667DD]">Invited Users</h2>
                    <div
                        onClick={() => setIsInviteModalOpen(true)} // 👈 open modal
                        className="flex items-center gap-2 p-regular bg-[#6667DD] px-5 py-3 cursor-pointer text-white hover:bg-[#4b4dc9] transition-all duration-300 hover:scale-97 rounded-full"
                    >
                        <UserPlus2 size={18} />
                        <button>Invite Users</button>
                    </div>
                </div>

                {invitedUsers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {invitedUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between px-4 py-6 bg-[#F6F9FC] shadow rounded-lg"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={user.profileImage || "https://via.placeholder.com/80"}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full mr-4 object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg p-semibold">{user.name}</h3>
                                        <p className="text-gray-500 p-regular">{user.email}</p>
                                        <p
                                            className={`text-sm p-medium ${user.status === "accepted"
                                                ? "text-green-600"
                                                : "text-orange-500"
                                                }`}
                                        >
                                            Status: {user.status}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setUserToDelete(user._id);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    disabled={isDeletingUser}
                                    className={`p-medium flex items-center gap-2 p-2 rounded-md transition-all duration-300 ${isDeletingUser
                                        ? "hover:cursor-not-allowed"
                                        : "text-red-600 hover:text-red-700 underline cursor-pointer"
                                        }`}
                                >
                                    {isDeletingUser ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin text-red-600"></div>
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
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-[#6667DD] p-medium">
                        You have not invited other users.
                    </div>
                )}
            </div>

            {/* SECTION 2: The User Who Invited You */}
            <div className="mt-10">
                <h2 className="text-2xl p-bold mb-4 text-[#6667DD]">Invited By</h2>
                {invitedBy ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div
                            key={invitedBy._id}
                            className="flex items-center justify-between px-4 py-6 bg-[#F6F9FC] shadow rounded-lg"
                        >
                            <div className="flex items-center">
                                <img
                                    src={
                                        invitedBy.profileImage ||
                                        "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500"
                                    }
                                    alt={invitedBy.name}
                                    className="w-16 h-16 rounded-full mr-4 object-cover"
                                />
                                <div>
                                    <h3 className="text-lg p-semibold">{invitedBy.name}</h3>
                                    <p className="text-gray-500 p-regular">{invitedBy.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-[#6667DD] p-medium">
                        You were not invited by any user.
                    </div>
                )}
            </div>

            {/* 🟢 Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden">
                    <div className="relative bg-[#F6F9FC] rounded-2xl shadow-xl w-full max-w-xl px-8 pt-4 pb-10 animate-scaleUp">
                        <X
                            size={22}
                            className="absolute top-3 right-4 text-gray-600 hover:text-gray-800 cursor-pointer transition-all duration-300"
                            onClick={() => setIsInviteModalOpen(false)} // 👈 close modal
                        />
                        <AddUsers /> {/* your whole AddUsers component inside modal */}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative animate-scaleUp border border-gray-300">
                        <X
                            size={20}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"
                            onClick={() => setIsDeleteModalOpen(false)}
                        />
                        <div className="p-3 bg-red-200 rounded-full mx-auto w-fit mb-3">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h2 className="text-lg p-semibold text-gray-800 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-6 p-regular text-sm">
                            Do you really want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 cursor-pointer outline-none text-sm text-gray-700 p-regular"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteUserMutate(userToDelete);
                                    setIsDeleteModalOpen(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 cursor-pointer outline-none text-sm p-regular"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
