import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { toast } from "sonner";
import { createShare, deleteShare } from "../hooks/recipientsShare";
import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ManageUserSharesModal = ({ isOpen, onClose, user, shares, allUsers }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // State for the delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [shareToDelete, setShareToDelete] = useState(null);

    // Mutation to CREATE a new share
    const { mutate: createShareMutate, isPending: isCreating } = useMutation({
        mutationFn: createShare,
        onSuccess: (data) => {
            toast.success("Shared card created successfully!");
            queryClient.invalidateQueries({ queryKey: ["shares"] });
            navigate(`/recipient/${data.share._id}`);
            onClose();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to create share."),
    });

    // Mutation to DELETE an existing share
    const { mutate: deleteShareMutate, isPending: isDeleting } = useMutation({
        mutationFn: deleteShare,
        onSuccess: () => {
            toast.success("Shared card deleted!");
            queryClient.invalidateQueries({ queryKey: ["shares"] });
            setIsDeleteModalOpen(false);
            setShareToDelete(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete."),
    });

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        category: Yup.string().required("Category is required"),
        sharedWith: Yup.array().min(1, "You must select at least one user.").required(),
    });

    const categories = ["Personal", "Business", "Family", "Friends", "Loan", "Other"];
    const userOptions = useMemo(() => allUsers.map(u => ({ value: u._id, label: u.name })), [allUsers]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
                <div className="bg-[#F6F9FC] rounded-2xl shadow-xl w-full max-w-2xl h-[85vh] sm:h-fit overflow-y-auto p-5 sm:p-6 relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-all duration-300"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-base sm:text-xl p-semibold text-[#6667DD] mb-4 text-center sm:text-left">
                        <span className="text-gray-800">Manage Shared Transactions with</span> {user.name}
                    </h2>

                    {/* Existing Shares */}
                    {shares.length > 0 && (
                        <div className="mb-6">
                            <h3 className="p-medium text-gray-700 mb-3">
                                Select existing transaction:
                            </h3>
                            <div className="max-h-52 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1 sm:pr-2">
                                {shares.map((share) => (
                                    <div
                                        key={share._id}
                                        className="flex justify-between items-center p-3 rounded-lg group shadow-sm border border-blue-100 hover:border-blue-200 transition-all duration-300 bg-transparent"
                                    >
                                        <div
                                            onClick={() => navigate(`/recipient/${share._id}`)}
                                            className="cursor-pointer flex-grow"
                                        >
                                            <p className="p-medium text-[#6667DD]">{share.title}</p>
                                            <p className="p-medium text-xs text-gray-700">Recipients: You, {share.sharedWith.map((name) => name.name).join(", ")}</p>
                                            <p className="text-xs text-gray-500">Category: {share.category}</p>
                                        </div>
                                        {share.sharedBy._id === currentUser._id && (
                                            <button
                                                onClick={() => {
                                                    setShareToDelete(share);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="p-2 bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer rounded-full transition-all duration-300"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Create New Share */}
                    <div>
                        <h3 className="p-medium text-gray-700 mb-3 border-t pt-4">
                            {shares.length > 0
                                ? "Or create a new shared transaction:"
                                : "Create a new shared transaction:"}
                        </h3>

                        <Formik
                            initialValues={{
                                title: "",
                                category: "",
                                sharedWith: userOptions.filter((opt) => opt.value === user._id),
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                const payload = {
                                    ...values,
                                    sharedWith: values.sharedWith.map((opt) => opt.value),
                                };
                                createShareMutate(payload);
                            }}
                        >
                            {({ setFieldValue, values }) => (
                                <Form className="space-y-4">
                                    {/* Title + Category */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-1">
                                            <Field
                                                name="title"
                                                placeholder="Transaction Title (e.g., Business...)"
                                                className="w-full p-2 border border-[#6667DD] rounded-lg outline-none bg-transparent"
                                            />
                                            <ErrorMessage
                                                name="title"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <Field
                                                as="select"
                                                name="category"
                                                className="w-full p-2 border border-[#6667DD] outline-none rounded-lg bg-transparent cursor-pointer"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage
                                                name="category"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Select Users */}
                                    <Select
                                        isMulti
                                        options={userOptions}
                                        placeholder="Share with..."
                                        onChange={(option) => setFieldValue("sharedWith", option)}
                                        value={values.sharedWith}
                                        className="cursor-pointer"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderColor: "#BFDBFE", // blue-100
                                                borderWidth: 2,
                                                borderRadius: "0.75rem",
                                                backgroundColor: "transparent",
                                                boxShadow: "none",
                                                cursor: "pointer",
                                                "&:hover": { borderColor: "#BFDBFE" },
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 50,
                                                maxHeight: "150px",
                                                overflowY: "auto",
                                            }),
                                            multiValue: (base) => ({
                                                ...base,
                                                backgroundColor: "#E9D4FF",
                                            }),
                                        }}
                                    />
                                    <ErrorMessage
                                        name="sharedWith"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#6667DD] to-[#7C81F8] cursor-pointer hover:scale-98 transition-all duration-300 text-white p-medium sm:text-base text-sm"
                                    >
                                        {isCreating ? "Creating..." : "Create & View Shared Transaction"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && shareToDelete && (
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
                            className="bg-white rounded-2xl flex flex-col items-center shadow-xl w-full max-w-sm p-6 text-center"
                        >
                            <p className="bg-red-200 p-3 mb-4 rounded-full text-red-500 transition-all duration-300">
                                <Trash2 size={20} />
                            </p>
                            <h2 className="text-lg p-semibold text-gray-800 mb-2">
                                Delete Shared Transaction?
                            </h2>
                            <p className="text-gray-600 mb-6 p-regular text-sm">
                                Are you sure you want to delete the shared transaction "
                                {shareToDelete.title}"? This will remove it for everyone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 hover:bg-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-300 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteShareMutate(shareToDelete._id)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 rounded-lg text-sm transition-all duration-300 border border-red-600 cursor-pointer hover:bg-red-600 hover:border-red-700 bg-red-500 text-white"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ManageUserSharesModal;