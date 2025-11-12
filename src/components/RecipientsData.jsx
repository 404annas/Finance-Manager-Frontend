import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Upload, X, Trash2, SquarePen } from "lucide-react";
import { toast } from "sonner";
import DataTable from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchPaymentsForShare,
    addPaymentToShare,
    deletePayment,
    updatePayment,
} from "../hooks/recipientsPaymentsShareData";

const RecipientsData = () => {
    const navigate = useNavigate();
    const { id: shareId } = useParams();
    const queryClient = useQueryClient();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // --- State for Modals and Forms ---
    const [isOpen, setIsOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);

    // Form fields state
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("Request");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // --- Data Fetching and Mutations ---
    const {
        data: payments = [],
        isPending: isLoadingPayments,
    } = useQuery({
        queryKey: ["sharePayments", shareId],
        queryFn: () => fetchPaymentsForShare(shareId),
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to load payments.");
            navigate("/recipients");
        },
    });

    // 1. ADD the missing resetFormState function
    const resetFormState = () => {
        setTitle("");
        setCategory("");
        setCurrency("USD");
        setAmount("");
        setStatus("Request");
        setImageFile(null);
        setImagePreview(null);
        setEditingPayment(null);
    };

    const { mutate: addPaymentMutate, isPending: isAdding } = useMutation({
        mutationFn: addPaymentToShare,
        onSuccess: () => {
            toast.success("Payment added successfully!");
            queryClient.invalidateQueries({ queryKey: ["sharePayments", shareId] });
            setIsOpen(false);
            resetFormState();
        },
        onError: (err) =>
            toast.error(err.response?.data?.message || "Failed to add payment."),
    });

    const { mutate: updatePaymentMutate, isPending: isUpdating } = useMutation({
        mutationFn: updatePayment,
        onSuccess: () => {
            toast.success("Payment updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["sharePayments", shareId] });
            setIsOpen(false);
            setEditingPayment(null);
        },
        onError: (err) =>
            toast.error(err.response?.data?.message || "Failed to update payment."),
    });

    const { mutate: deletePaymentMutate, isPending: isDeleting } = useMutation({
        mutationFn: deletePayment,
        onSuccess: () => {
            toast.success("Payment deleted!");
            queryClient.invalidateQueries({ queryKey: ["sharePayments", shareId] });
            setIsDeleteModalOpen(false);
            setPaymentToDelete(null);
        },
        onError: (err) =>
            toast.error(err.response?.data?.message || "Failed to delete payment."),
    });

    const handleSubmit = () => {
        if (!title || !category || !currency || !amount || !status)
            return toast.error("Please fill in all fields!");

        const paymentFormData = new FormData();
        paymentFormData.append("title", title);
        paymentFormData.append("category", category);
        paymentFormData.append("currency", currency);
        paymentFormData.append("amount", amount);
        paymentFormData.append("status", status);
        if (imageFile) paymentFormData.append("image", imageFile);

        if (editingPayment) {
            updatePaymentMutate({ paymentId: editingPayment._id, paymentFormData });
        } else {
            addPaymentMutate({ shareId, paymentFormData });
        }
    };

    const handleOpenAddModal = () => {
        resetFormState();
        setIsOpen(true);
    };

    const handleOpenEditModal = (payment) => {
        setEditingPayment(payment);
        setTitle(payment.title);
        setCategory(payment.category);
        setCurrency(payment.currency);
        setAmount(payment.amount);
        setStatus(payment.status);
        setImageFile(null);
        setImagePreview(payment.image || null);
        setIsOpen(true);
    };

    const columns = [
        {
            name: <span className="p-semibold">Title</span>,
            selector: (row) => row.title,
            cell: (row) => <span className="p-regular">{row.title}</span>,
            sortable: true,
            width: "200px",
        },
        {
            name: <span className="p-semibold">Category</span>,
            selector: (row) => row.category,
            cell: (row) => <span className="p-regular">{row.category}</span>,
            sortable: true,
            width: "110px",
        },
        {
            name: <span className="p-semibold">Amount</span>,
            selector: (row) => row.amount,
            cell: (row) => (
                <span className="p-regular">{`${row.currency} ${row.amount}`}</span>
            ),
            sortable: true,
            width: "100px",
        },
        {
            name: <span className="p-semibold">Status</span>,
            cell: (row) => <StatusBadge status={row.status} />,
            sortable: true,
            width: "120px",
        },
        {
            name: <span className="p-semibold">Added By</span>,
            selector: (row) => row.createdBy?.name ?? "Deleted User",
            cell: (row) => (
                <span className="p-regular">
                    {row.createdBy?.name ?? "Deleted User"}
                </span>
            ),
            sortable: true,
            width: "220px",
        },
        {
            name: <span className="p-semibold">Image</span>,
            cell: (row) =>
                row.image ? (
                    <img
                        src={row.image}
                        alt={row.title}
                        onClick={() => setSelectedImage(row.image)}
                        className="w-12 h-12 rounded-md object-cover cursor-pointer"
                    />
                ) : (
                    <span className="text-gray-400 p-regular text-sm">No Image</span>
                ),
            width: "120px",
        },
        {
            name: <span className="p-semibold">Actions</span>,
            cell: (row) => {
                if (row.createdBy?._id === currentUser._id) {
                    return (
                        <div className="flex items-center gap-2 w-[90px]">
                            <button
                                onClick={() => {
                                    setPaymentToDelete(row._id);
                                    setIsDeleteModalOpen(true);
                                }}
                                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-300 cursor-pointer"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button
                                onClick={() => handleOpenEditModal(row)}
                                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-300 cursor-pointer"
                            >
                                <SquarePen size={18} />
                            </button>
                        </div>
                    );
                }
                return <p className="text-gray-700 p-regular">Not Allowed</p>;
            },
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Poppins",
                color: "#5759C7",
                textTransform: "uppercase",
            },
        },
    };

    const isSubmitDisabled =
        !title || !category || !currency || !amount || !status || isAdding || isUpdating;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-[#F6F9FC]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/recipients")}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300 cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-lg sm:text-2xl p-bold text-[#6667DD]">
                        Shared Payment Details
                    </h2>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#6667DD] to-[#7C81F8] text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-sm hover:scale-97 transition-all duration-300 p-regular cursor-pointer text-sm sm:text-base"
                >
                    <Plus size={18} /> Add Payment
                </button>
            </div>

            <div className="overflow-x-auto">
                {isLoadingPayments ? (
                    <div className="space-y-2 py-2">
                        {[...Array(2)].map((_, idx) => (
                            <div
                                key={idx}
                                className="h-10 grid grid-cols-7 gap-4 bg-gray-200 rounded animate-pulse w-full px-4"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div className="max-h-[60vh] overflow-y-auto">
                        <DataTable
                            columns={columns}
                            data={payments}
                            pagination
                            highlightOnHover
                            striped
                            fixedHeader
                            fixedHeaderScrollHeight="100%"
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="py-6 text-gray-500 p-medium">
                                    No payments added to this share yet.
                                </div>
                            }
                        />
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#F6F9FC] rounded-2xl shadow-xl w-full max-w-xl sm:max-w-2xl px-4 py-6 sm:p-6 relative overflow-y-auto h-[90vh] sm:h-fit">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                resetFormState();
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X size={22} />
                        </button>

                        <h3 className="text-xl p-semibold text-[#6667DD] mb-4">
                            {editingPayment ? "Edit Payment" : "Add New Payment"}
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Payment Title"
                                className="flex-1 outline-none rounded-lg px-3 py-2 p-regular border-2 border-[#6667DD]"
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex-1 rounded-lg px-3 py-2 border-2 border-[#6667DD] p-regular cursor-pointer outline-none"
                            >
                                <option value="">Select Category</option>
                                <option value="Personal">Personal</option>
                                <option value="Business">Business</option>
                                <option value="Family">Family</option>
                                <option value="Friends">Friends</option>
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="flex-1 rounded-lg px-3 py-2 border-2 border-[#6667DD] cursor-pointer outline-none p-regular"
                            >
                                <option value="USD">$ USD</option>
                                <option value="PKR">₨ PKR</option>
                                <option value="EUR">€ EUR</option>
                            </select>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount"
                                className="flex-1 p-regular outline-none rounded-lg px-3 py-2 border-2 border-[#6667DD]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <StatusButton
                                currentStatus={status}
                                onSelectStatus={setStatus}
                                statusName="Paid"
                            />
                            <StatusButton
                                currentStatus={status}
                                onSelectStatus={setStatus}
                                statusName="Request"
                            />
                            <StatusButton
                                currentStatus={status}
                                onSelectStatus={setStatus}
                                statusName="Pending"
                            />
                        </div>

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#6667DD] rounded-lg cursor-pointer hover:bg-gray-100 transition mb-4">
                            <Upload size={24} className="mb-2 text-gray-600" />
                            <span className="text-gray-600 p-regular">
                                {imageFile
                                    ? imageFile.name
                                    : imagePreview
                                        ? "Current image is set"
                                        : "Upload Image (optional)"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </label>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
                            className={`w-full py-3 rounded-lg shadow-md p-medium cursor-pointer transition-all duration-300 ${isSubmitDisabled
                                    ? "bg-[#9BA0E0] cursor-not-allowed"
                                    : "bg-[#6667DD] hover:bg-[#5152b8] cursor-pointer"
                                } text-white`}
                        >
                            {isAdding || isUpdating
                                ? "Saving..."
                                : editingPayment
                                    ? "Save Changes"
                                    : "Add Payment"}
                        </button>
                    </div>
                </div>
            )}

            {/* Image Preview */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Full View"
                        className="max-w-full object-cover sm:max-w-[90%] max-h-[90%] rounded-lg shadow-lg bg-white/20"
                    />
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-4 sm:p-6 text-center relative animate-scaleUp border border-gray-300">
                        <X
                            size={20}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => setIsDeleteModalOpen(false)}
                        />
                        <div className="p-3 bg-red-200 rounded-full mx-auto w-fit mb-3">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h2 className="text-lg p-semibold text-gray-800 mb-2">
                            Are you sure?
                        </h2>
                        <p className="text-gray-600 mb-6 p-regular text-sm">
                            Do you really want to delete this payment? This action cannot be
                            undone.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 outline-none text-sm p-regular cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deletePaymentMutate(paymentToDelete)}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 outline-none text-sm p-regular cursor-pointer"
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

const statusColors = { Paid: "#A0EDBC", Request: "#F7CE7C", Pending: "#83C8F2" };
const selectedColors = { Paid: "#6fd49f", Request: "#e6b23c", Pending: "#4ea3d9" };

const StatusBadge = ({ status }) => (
    <span
        className="px-3 py-1 rounded-full text-sm p-medium"
        style={{ backgroundColor: statusColors[status] }}
    >
        {status}
    </span>
);

const StatusButton = ({ currentStatus, onSelectStatus, statusName }) => {
    const isSelected = currentStatus === statusName;
    return (
        <button
            onClick={() => onSelectStatus(statusName)}
            className={`flex-1 cursor-pointer py-2 rounded-lg border-2 p-medium transition-all duration-300`}
            style={{
                backgroundColor: isSelected
                    ? selectedColors[statusName]
                    : statusColors[statusName],
                color: isSelected ? "#fff" : "#000",
                borderColor: statusColors[statusName],
            }}
        >
            {statusName}
        </button>
    );
};

export default RecipientsData;
