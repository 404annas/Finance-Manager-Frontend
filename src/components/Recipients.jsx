import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, X, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchShares, createShare, deleteShare, fetchRecipients } from "../hooks/shares";

const Recipients = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);
    // --- Form State ---
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [title, setTitle] = useState("");

    const categories = ["Personal", "Business", "Family", "Friends", "Loan", "Other"];
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // 3. FETCH data with two separate useQuery hooks
    const { data: sharedCards = [], isPending: isLoadingShares } = useQuery({
        queryKey: ["shares"],
        queryFn: fetchShares,
    });

    const { data: potentialRecipients = [], isPending: isLoadingRecipients } = useQuery({
        queryKey: ["recipients"],
        queryFn: fetchRecipients,
    });

    // 4. CREATE a share with useMutation
    const { mutate: createShareMutate, isPending: isSharing } = useMutation({
        mutationFn: createShare,
        onSuccess: () => {
            toast.success("Shared successfully!");
            queryClient.invalidateQueries({ queryKey: ["shares"] });
            resetAndCloseModal();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to share."),
    });

    // 5. DELETE a share with useMutation
    const { mutate: deleteShareMutate, isPending: isDeleting, variables: deletingId } = useMutation({
        mutationFn: deleteShare,
        onSuccess: () => {
            toast.success("Deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["shares"] });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete."),
    });

    const handleShare = () => {
        if (!title || !selectedCategory || selectedUserIds.length === 0) {
            return toast.error("Please fill all fields and select at least one user!");
        }
        createShareMutate({ title, category: selectedCategory, sharedWith: selectedUserIds });
    };

    const handleDeleteShare = (e, shareId) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        deleteShareMutate(shareId);
    };

    // 7. Memoize derived data to prevent re-filtering on every render
    const { sharedByMe, sharedWithMe } = useMemo(() => {
        const byMe = sharedCards.filter(card => card.sharedBy._id === currentUser.id);
        const withMe = sharedCards.filter(card => card.sharedBy._id !== currentUser.id);
        return { sharedByMe: byMe, sharedWithMe: withMe };
    }, [sharedCards, currentUser.id]);

    // Helper functions remain the same
    const toggleUser = (userId) => setSelectedUserIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    const resetAndCloseModal = () => {
        setIsOpen(false);
        setTitle("");
        setSelectedCategory("");
        setSelectedUserIds([]);
    };

    if (isLoadingShares || isLoadingRecipients) {
        return <div className="p-6 text-center p-medium animate-pulse text-[#6667DD]">Loading...</div>;
    }

    // Helper component to render a grid of cards
    const CardGrid = ({ cards, showDelete }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {cards.map((card) => {
                const isCurrentlyDeleting = isDeleting && deletingId === card._id;
                return (
                    <div
                        key={card._id}
                        onClick={() => navigate(`/recipient/${card._id}`)}
                        className="bg-transparent p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="p-semibold text-[#6667DD] mb-2 text-lg">{card.title}</h3>
                            {showDelete && (
                                <p onClick={(e) => handleDeleteShare(e, card._id)} className="text-red-500 hover:text-red-700 cursor-pointer transition-all duration-300 p-1">
                                    {isCurrentlyDeleting ? (
                                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Trash2 size={20} />
                                    )}
                                </p>
                            )}
                        </div>
                        <p className="p-medium text-gray-700 text-sm">Category: {card.category}</p>
                        <p className="p-medium text-gray-700 text-sm mt-1">Users: {card.sharedWith.map(u => u.name).join(", ")}</p>
                        {!showDelete && <p className="p-medium text-gray-500 text-xs mt-1">By: {card.sharedBy.name}</p>}
                    </div>
                )
            })}
        </div>
    );

    return (
        <div className="w-full px-6 py-6 bg-[#F6F9FC]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl p-bold text-[#6667DD]">Shared Payments</h2>
                <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-[#6667DD] text-white px-5 py-3 rounded-full shadow-sm hover:bg-[#5152b8] transition-all duration-300 p-regular cursor-pointer">
                    <Share2 size={18} /> Share With
                </button>
            </div>

            {/* Section 1: Shared By Me */}
            <h3 className="text-xl p-semibold text-gray-800 mb-3">Shared By Me</h3>
            {sharedByMe.length > 0 ? (
                <CardGrid cards={sharedByMe} showDelete={true} />
            ) : (
                <div className="text-center py-6 text-gray-500 p-medium">You haven't shared any payments yet.</div>
            )}

            {/* Section 2: Shared With Me */}
            <h3 className="text-xl p-semibold text-gray-800 mt-8 mb-3">Shared With Me</h3>
            {sharedWithMe.length > 0 ? (
                <CardGrid cards={sharedWithMe} showDelete={false} />
            ) : (
                <div className="text-center py-6 text-gray-500 p-medium">No payments have been shared with you.</div>
            )}

            {/* Share Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#F6F9FC] rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                        <button onClick={resetAndCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300">
                            <X size={22} />
                        </button>
                        <h3 className="text-xl p-semibold text-[#6667DD] mb-4">Share Payment Details</h3>
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm p-medium text-gray-700 mb-2 uppercase">Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Monthly Rent" className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD] p-regular" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm p-medium text-gray-700 mb-2 uppercase">Category</label>
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full rounded-lg px-3 py-2 outline-none cursor-pointer p-regular border-2 border-[#6667DD]">
                                    <option value="">Select Category</option>
                                    {categories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
                                </select>
                            </div>
                        </div>
                        <label className="block text-sm uppercase p-medium text-gray-700 mb-2">Share With</label>
                        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto mb-4 border-2 border-[#6667DD] rounded-lg p-3">
                            {potentialRecipients.length > 0 ? potentialRecipients.map((user) => (
                                <label key={user._id} className="flex items-center gap-2 cursor-pointer p-regular">
                                    <input type="checkbox" className="w-4 h-4 accent-[#6667DD]" checked={selectedUserIds.includes(user._id)} onChange={() => toggleUser(user._id)} />
                                    {user.name} ({user.email})
                                </label>
                            )) : (<p className="text-gray-500 p-medium">No invited users to share with.</p>)}
                        </div>
                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg shadow-md p-medium transition-all duration-300 ${isSharing ? "bg-[#999] cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5152b8] cursor-pointer"} text-white`}
                        >
                            <UsersRound size={18} />
                            {isSharing ? "Sharing..." : "Share Now"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recipients;