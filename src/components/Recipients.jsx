import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, X, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchShares, createShare, deleteShare, fetchRecipients } from "../hooks/recipientsShare";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Recipients = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Modal & Form State
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const categories = ["Personal", "Business", "Family", "Friends", "Loan", "Other"];
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Fetch shares and recipients
    const { data: sharedCards = [], isPending: isLoadingShares } = useQuery({
        queryKey: ["shares"],
        queryFn: fetchShares,
        onError: () => toast.error("Failed to fetch shares."),
    });

    const { data: potentialRecipients = [], isPending: isLoadingRecipients } = useQuery({
        queryKey: ["recipients"],
        queryFn: fetchRecipients,
        onError: () => toast.error("Failed to fetch recipients."),
    });

    // Create share
    const { mutate: createShareMutate, isPending: isSharing } = useMutation({
        mutationFn: createShare,
        onSuccess: () => {
            toast.success("Shared successfully!");
            queryClient.invalidateQueries({ queryKey: ["shares"] });
            resetAndCloseModal();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to share."),
    });

    // Delete share
    const { mutate: deleteShareMutate, isPending: isDeleting } = useMutation({
        mutationFn: deleteShare,
        onSuccess: () => {
            toast.success("Deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["shares"] });
            setDeleteModalOpen(false);
            setSelectedDeleteId(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete."),
    });

    const toggleUser = (userId) => setSelectedUserIds(prev =>
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );

    const resetAndCloseModal = () => {
        setIsOpen(false);
        setSelectedUserIds([]);
    };

    const { sharedByMe, sharedWithMe } = useMemo(() => {
        const byMe = sharedCards.filter(card => card.sharedBy._id === currentUser._id);
        const withMe = sharedCards.filter(card => card.sharedBy._id !== currentUser._id);
        return { sharedByMe: byMe, sharedWithMe: withMe };
    }, [sharedCards, currentUser.id]);

    const confirmDeleteShare = (shareId) => {
        setSelectedDeleteId(shareId);
        setDeleteModalOpen(true);
    };
    const handleDeleteShare = () => {
        if (!selectedDeleteId) return;
        deleteShareMutate(selectedDeleteId);
    };

    if (isLoadingShares || isLoadingRecipients) {
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

    const CardGrid = ({ cards, showDelete }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {cards.map((card) => (
                <div
                    key={card._id}
                    onClick={() => navigate(`/recipient/${card._id}`)}
                    className="bg-transparent p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-300"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="p-semibold text-[#6667DD] mb-2 text-lg break-words">{card.title}</h3>
                        {showDelete && (
                            <p
                                onClick={(e) => { e.stopPropagation(); confirmDeleteShare(card._id); }}
                                className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 rounded-full cursor-pointer transition-all duration-300 p-2"
                            >
                                <Trash2 size={20} />
                            </p>
                        )}
                    </div>
                    <p className="p-medium text-gray-700 text-sm break-words">Category: {card.category}</p>
                    <p className="p-medium text-gray-700 text-sm mt-1 break-words">
                        Users: {card.sharedWith.map(u => u.name).join(", ")}
                    </p>
                    {!showDelete && <p className="p-medium text-gray-500 text-xs mt-1 break-words">By: {card.sharedBy.name}</p>}
                </div>
            ))}
        </div>
    );

    // Formik + Yup for Share Modal
    const initialValues = { title: "", category: "", sharedWith: [] };
    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        category: Yup.string().required("Category is required"),
        sharedWith: Yup.array().min(1, "Select at least one user"),
    });

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F6F9FC]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-2xl p-bold text-[#6667DD]">Share Payments With Recipients</h2>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-[#6667DD] text-white px-5 py-3 rounded-full shadow-sm hover:bg-[#5152b8] transition-all duration-300 p-regular cursor-pointer w-full sm:w-auto justify-center"
                >
                    <Share2 size={18} /> Share With
                </button>
            </div>

            <h3 className="text-xl p-semibold text-gray-800 mb-3">Shared By Me</h3>
            {sharedByMe.length > 0 ? <CardGrid cards={sharedByMe} showDelete={true} /> : <div className="text-center py-6 text-gray-500 p-medium">You haven't shared any payments yet.</div>}

            <h3 className="text-xl p-semibold text-gray-800 mt-8 mb-3">Shared With Me</h3>
            {sharedWithMe.length > 0 ? <CardGrid cards={sharedWithMe} showDelete={false} /> : <div className="text-center py-6 text-gray-500 p-medium">No payments have been shared with you.</div>}

            {/* Share Modal with Formik */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#F6F9FC] rounded-2xl shadow-xl w-full max-w-xl px-4 py-6 relative">
                        <button
                            onClick={resetAndCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"
                        >
                            <X size={22} />
                        </button>
                        <h3 className="text-xl p-semibold text-[#6667DD] mb-4">Share Payment Details</h3>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values) => createShareMutate(values)}
                        >
                            {({ values, setFieldValue, errors, touched }) => (
                                <Form className="space-y-4">
                                    <div className="flex flex-col gap-4 sm:flex-row mb-4">
                                        <div className="flex-1">
                                            <Field
                                                type="text"
                                                name="title"
                                                placeholder="Title e.g., Monthly Rent"
                                                className={`w-full rounded-lg px-3 py-2 outline-none border-2 p-regular ${errors.title && touched.title ? "border-red-500" : "border-[#6667DD]"}`}
                                            />
                                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1 p-regular" />
                                        </div>
                                        <div className="flex-1">
                                            <Field as="select" name="category" className={`w-full rounded-lg px-3 py-2 outline-none cursor-pointer p-regular border-2 ${errors.category && touched.category ? "border-red-500" : "border-[#6667DD]"}`}>
                                                <option value="">Select Category</option>
                                                {categories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
                                            </Field>
                                            <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1 p-regular" />
                                        </div>
                                    </div>

                                    <label className="block text-sm uppercase p-medium text-gray-700 mb-2">Share With</label>
                                    <div className={`flex flex-col gap-2 max-h-48 overflow-y-auto mb-4 border-2 rounded-lg p-3 ${errors.sharedWith && touched.sharedWith ? "border-red-500" : "border-[#6667DD]"}`}>
                                        {potentialRecipients.length > 0 ? potentialRecipients.map((user) => (
                                            <label key={user._id} className="flex items-center gap-2 cursor-pointer p-regular break-words">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 accent-[#6667DD]"
                                                    checked={values.sharedWith.includes(user._id)}
                                                    onChange={() => {
                                                        if (values.sharedWith.includes(user._id)) {
                                                            setFieldValue("sharedWith", values.sharedWith.filter(id => id !== user._id));
                                                        } else {
                                                            setFieldValue("sharedWith", [...values.sharedWith, user._id]);
                                                        }
                                                        toggleUser(user._id);
                                                    }}
                                                />
                                                {user.name} ({user.email})
                                            </label>
                                        )) : (<p className="text-gray-500 p-medium">No invited users to share with.</p>)}
                                        <ErrorMessage name="sharedWith" component="div" className="text-red-500 text-sm mt-1 p-regular" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSharing}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg shadow-md p-medium transition-all sm:text-base text-sm duration-300 ${isSharing ? "bg-[#999] cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5152b8] cursor-pointer"} text-white`}
                                    >
                                        <UsersRound size={18} />
                                        {isSharing ? "Sharing..." : "Share Now"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative animate-scaleUp border border-gray-300">
                        <X
                            size={20}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"
                            onClick={() => setDeleteModalOpen(false)}
                        />
                        <div className="p-3 bg-red-200 rounded-full mx-auto w-fit mb-3">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h2 className="text-lg p-semibold text-gray-800 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-6 p-regular text-sm">
                            Do you really want to delete this shared payment? This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 cursor-pointer outline-none text-sm text-gray-700 p-regular w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteShare}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 cursor-pointer outline-none text-sm p-regular w-full sm:w-auto"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recipients;
