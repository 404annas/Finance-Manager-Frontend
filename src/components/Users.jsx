import { Trash2, UserPlus2, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, deleteUsers } from "../hooks/getUsers";
import { useState } from "react";
import AddUsers from "./AddUsers";

const Users = () => {
    const queryClient = useQueryClient();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
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
            <div className="p-4 sm:p-6 md:p-8 w-full">
                <div className="animate-pulse space-y-6">
                    {/* Header */}
                    <div className="h-8 bg-[#6667DD]/30 rounded w-1/3 mx-auto sm:mx-0 sm:w-1/4"></div>

                    {/* Invite button */}
                    <div className="h-10 bg-[#6667DD]/30 rounded w-1/2 mx-auto sm:w-40 sm:hidden block"></div>

                    {/* User cards skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-10">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-2 py-6 bg-[#F6F9FC] shadow rounded-lg w-full"
                            >
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                                    <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                                    <div className="space-y-2 sm:space-y-1">
                                        <div className="h-4 w-32 bg-gray-300 rounded"></div>
                                        <div className="h-3 w-48 bg-gray-300 rounded"></div>
                                        <div className="h-3 w-24 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                                <div className="h-8 w-24 bg-red-300 rounded mt-4 sm:mt-0"></div>
                            </div>
                        ))}
                    </div>

                    {/* Invited By skeleton */}
                    <div className="mt-10">
                        <div className="h-8 bg-[#6667DD]/30 rounded w-1/4 mb-4"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-2 py-6 bg-[#F6F9FC] shadow rounded-lg w-full">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                                    <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                                    <div className="space-y-2 sm:space-y-1">
                                        <div className="h-4 w-32 bg-gray-300 rounded"></div>
                                        <div className="h-3 w-48 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        <div className="p-4 sm:p-6 md:p-8 relative w-full">
            {/* SECTION 1: Users You Have Invited */}
            <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6">
                    <h2 className="text-2xl p-bold text-[#6667DD]">Invited Users</h2>
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center justify-center gap-2 p-regular bg-[#6667DD] px-4 sm:px-5 py-2.5 sm:py-3 cursor-pointer text-white hover:bg-[#4b4dc9] transition-all duration-300 rounded-full w-full sm:w-auto text-sm sm:text-base"
                    >
                        <UserPlus2 size={18} />
                        Invite Users
                    </button>
                </div>

                {invitedUsers.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {invitedUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-2 py-6 bg-[#F6F9FC] shadow rounded-lg w-full"
                            >
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                                    <img
                                        src={user.profileImage || "https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500"}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg p-semibold">{user.name}</h3>
                                        <p className="text-gray-500 p-regular break-all">{user.email}</p>
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
                                    className={`p-medium flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-md transition-all duration-300 text-sm sm:text-base cursor-pointer ${isDeletingUser
                                        ? "hover:cursor-not-allowed text-gray-400"
                                        : "text-red-600 hover:text-red-700 underline"
                                        }`}
                                >
                                    {isDeletingUser ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-red-600"></div>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div
                            key={invitedBy._id}
                            className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-2 py-6 bg-[#F6F9FC] shadow rounded-lg w-full"
                        >
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                                <img
                                    src={
                                        invitedBy.profileImage ||
                                        "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500"
                                    }
                                    alt={invitedBy.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-lg p-semibold">{invitedBy.name}</h3>
                                    <p className="text-gray-500 p-regular break-all">{invitedBy.email}</p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-[#8793a0] shadow-xl w-full max-w-[90%] sm:max-w-lg md:max-w-xl rounded-2xl px-4 pt-5 pb-9 animate-scaleUp">
                        <X
                            size={22}
                            className="absolute top-3 right-4 text-gray-200 hover:text-gray-300 cursor-pointer transition-all duration-300"
                            onClick={() => setIsInviteModalOpen(false)}
                        />
                        <AddUsers />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-6">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-[90%] sm:max-w-sm p-6 text-center relative animate-scaleUp border border-gray-300">
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
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 text-sm text-gray-700 p-regular cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteUserMutate(userToDelete);
                                    setIsDeleteModalOpen(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 text-sm p-regular cursor-pointer"
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
