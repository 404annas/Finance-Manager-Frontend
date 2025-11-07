import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, deleteUsers } from "../hooks/getUsers";
import { fetchShares } from "../hooks/recipientsShare";
import ManageUserSharesModal from "../mods/ManageUserSharesModal"; // We will create this
import { Files, FilePlus, UserRoundMinusIcon, Trash2, SquarePen, UserRoundPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UsersInRecipients = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // State for modals
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

    // State to hold the user being acted upon
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch all users (invited by me + invited me)
    const { data: usersData, isPending: isLoadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    // Fetch ALL shared cards involving the current user
    const { data: allShares = [], isPending: isLoadingShares } = useQuery({
        queryKey: ["shares"],
        queryFn: fetchShares,
    });

    // Mutation for deleting a user
    const { mutate: deleteUserMutate, isPending: isDeletingUser } = useMutation({
        mutationFn: deleteUsers,
        onSuccess: (data) => {
            toast.success(data.message || "User deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["shares"] });
            setIsDeleteUserModalOpen(false);
            setSelectedUser(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete user"),
    });

    // Combine invited users and the user who invited me into one list
    const allConnectedUsers = useMemo(() => {
        if (!usersData) return [];
        const invited = usersData.invitedUsers || [];
        const inviter = usersData.invitedBy ? [usersData.invitedBy] : [];
        const userMap = new Map(); // Use a map to prevent duplicates
        [...invited, ...inviter].forEach(user => userMap.set(user._id, user));
        return Array.from(userMap.values());
    }, [usersData]);

    const handleManageClick = (user) => {
        setSelectedUser(user);
        setIsManageModalOpen(true);
    };

    const handleDeleteUserClick = (user) => {
        setSelectedUser(user);
        setIsDeleteUserModalOpen(true);
    };

    if (isLoadingUsers || isLoadingShares) {
        return (
            <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F6F9FC] space-y-6 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center gap-4">
                    <div className="h-6 w-48 bg-gray-300 rounded"></div>
                    <div className="h-10 w-32 bg-gray-300 rounded-full md:block hidden"></div>
                </div>

                {/* Shared By Me Title Skeleton */}
                <div className="h-5 w-32 bg-gray-300 rounded mt-4"></div>

                {/* Shared By Me Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {Array.from({ length: 2 }).map((_, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-200 h-32"></div>
                    ))}
                </div>

                {/* Shared With Me Title Skeleton */}
                <div className="h-5 w-32 bg-gray-300 rounded mt-6"></div>

                {/* Shared With Me Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {Array.from({ length: 2 }).map((_, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-200 h-32"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F6F9FC]">
            <div className="flex items-center justify-between border-b border-blue-100 pb-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl p-bold text-[#6667DD]">Invite Recipients</h2>
                    <p className="p-regular text-base text-gray-700">Add recipients to manage shared transactions efficiently and securely.</p>
                </div>
                <button className="bg-gradient-to-r from-[#6667DD] to-[#7C81F8] text-white px-5 py-3 rounded-full shadow-md hover:scale-97 transition-all duration-300 cursor-pointer flex items-center gap-2"><UserRoundPlus size={20} />Invite Recipients</button>
            </div>

            <h2 className="text-2xl p-bold text-[#6667DD] my-6">Share Payments With Your Recipients</h2>

            <div className="grid grid-cols-2 gap-2">
                {allConnectedUsers.length > 0 ? (
                    allConnectedUsers.map((user) => {
                        const sharesWithThisUser = allShares.filter(share =>
                            (share.sharedBy._id === currentUser._id && share.sharedWith.some(u => u._id === user._id)) ||
                            (share.sharedBy._id === user._id && share.sharedWith.some(u => u._id === currentUser._id))
                        );
                        const hasShares = sharesWithThisUser.length > 0;

                        return (
                            <div
                                key={user._id}
                                className="bg-transparent backdrop-blur-sm border border-[#6667DD]/50 transition-all duration-300 rounded-2xl shadow-sm p-4 flex flex-col gap-4"
                            >
                                {/* Top Section: Profile + Icons */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    {/* Left: Image + Name + Email */}
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <img
                                            src={
                                                user.profileImage ||
                                                "https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500"
                                            }
                                            alt={user.name}
                                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm border border-gray-200"
                                        />
                                        <div>
                                            <h3 className="p-semibold text-base sm:text-lg text-gray-800 leading-tight">
                                                {user.name}
                                            </h3>
                                            <p className="p-regular text-xs sm:text-sm text-gray-500 break-all">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Edit + Delete */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toast.info("Edit Recipient Coming Soon.")}
                                            className="p-2.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all duration-300 cursor-pointer shadow-sm">
                                            <SquarePen size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUserClick(user)}
                                            className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 cursor-pointer shadow-sm"
                                        >
                                            <UserRoundMinusIcon size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom: Manage Button */}
                                <button
                                    onClick={() => handleManageClick(user)}
                                    className={`flex items-center justify-center gap-2 text-sm p-regular px-3.5 py-2.5 rounded-lg transition-all duration-500 cursor-pointer shadow-sm w-full sm:w-auto ${hasShares
                                        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200"
                                        : "bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200"
                                        }`}
                                >
                                    {hasShares ? <Files size={16} /> : <FilePlus size={16} />}
                                    {hasShares ? "View / Add Payments" : "Create Shared Card"}
                                </button>
                            </div>

                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 p-4">You have no connected users to manage payments with.</p>
                )}
            </div>

            {selectedUser && (
                <ManageUserSharesModal
                    isOpen={isManageModalOpen}
                    onClose={() => setIsManageModalOpen(false)}
                    user={selectedUser}
                    shares={allShares.filter(share =>
                        (share.sharedBy._id === currentUser._id && share.sharedWith.some(u => u._id === selectedUser._id)) ||
                        (share.sharedBy._id === selectedUser._id && share.sharedWith.some(u => u._id === currentUser._id))
                    )}
                    // --- THIS IS THE NEW PROP ---
                    allUsers={allConnectedUsers}
                />
            )}

            <AnimatePresence>
                {isDeleteUserModalOpen && selectedUser && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center flex flex-col items-center"
                        >
                            <p className="bg-red-200 text-red-600 p-3 rounded-full mb-4">
                                <Trash2 size={20} />
                            </p>
                            <h2 className="text-lg p-semibold text-gray-800 mb-2">Confirm Deletion</h2>
                            <p className="text-gray-600 mb-6 p-regular text-sm">
                                Are you sure you want to delete {selectedUser.name}? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setIsDeleteUserModalOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteUserMutate(selectedUser._id)}
                                    disabled={isDeletingUser}
                                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-300 cursor-pointer text-sm border border-red-600 hover:border-red-700 text-white"
                                >
                                    {isDeletingUser ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsersInRecipients;