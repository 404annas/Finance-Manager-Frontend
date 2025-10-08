import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Upload, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DataTable from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPaymentsForShare, addPaymentToShare, deletePayment } from "../hooks/paymentsShareData";

const RecipientsData = () => {
    const navigate = useNavigate();
    const { id: shareId } = useParams();
    const queryClient = useQueryClient();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // --- Component State ---
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);

    // --- Form State ---
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("Request");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // --- Fetch Payments ---
    const { data: payments = [], isPending: isLoadingPayments } = useQuery({
        queryKey: ["sharePayments", shareId],
        queryFn: () => fetchPaymentsForShare(shareId),
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to load payments.");
            navigate("/recipients");
        },
    });

    // --- Add Payment ---
    const { mutate: addPaymentMutate, isPending: isAddingPayment } = useMutation({
        mutationFn: addPaymentToShare,
        onSuccess: () => {
            toast.success("Payment added successfully!");
            queryClient.invalidateQueries({ queryKey: ["sharePayments", shareId] });
            setIsOpen(false);
            setTitle(""); setCategory(""); setCurrency("USD"); setAmount(""); setStatus("Request"); setImageFile(null); setImagePreview(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to add payment."),
    });

    // --- Delete Payment ---
    const { mutate: deletePaymentMutate, isPending: isDeleting } = useMutation({
        mutationFn: deletePayment,
        onSuccess: () => {
            toast.success("Payment deleted!");
            queryClient.invalidateQueries({ queryKey: ["sharePayments", shareId] });
            setIsDeleteModalOpen(false);
            setPaymentToDelete(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete payment."),
    });

    const handleAddPayment = () => {
        if (!title || !category || !currency || !amount || !status) {
            return toast.error("Please fill all required fields!");
        }
        const paymentFormData = new FormData();
        paymentFormData.append("title", title);
        paymentFormData.append("category", category);
        paymentFormData.append("currency", currency);
        paymentFormData.append("amount", amount);
        paymentFormData.append("status", status);
        if (imageFile) paymentFormData.append("image", imageFile);
        addPaymentMutate({ shareId, paymentFormData });
    };

    // --- DataTable Columns ---
    const columns = [
        { name: <span className="p-semibold">Title</span>, selector: row => row.title, cell: row => <span className="p-regular">{row.title}</span>, sortable: true },
        { name: <span className="p-semibold">Category</span>, selector: row => row.category, cell: row => <span className="p-regular">{row.category}</span>, sortable: true },
        { name: <span className="p-semibold">Amount</span>, selector: row => row.amount, cell: row => <span className="p-regular">{`${row.currency} ${row.amount}`}</span>, sortable: true },
        { name: <span className="p-semibold">Status</span>, cell: row => <StatusBadge status={row.status} />, sortable: true },
        { name: <span className="p-semibold">Added By</span>, selector: row => row.createdBy.name, cell: row => <span className="p-regular">{row.createdBy.name}</span>, sortable: true },
        { name: <span className="p-semibold">Image</span>, cell: row => row.image ? <img src={row.image} alt={row.title} onClick={() => setSelectedImage(row.image)} className="w-12 h-12 rounded-md object-cover cursor-pointer" /> : <span className="text-gray-400 p-regular text-sm">No Image</span> },
        {
            name: <span className="p-semibold">Actions</span>,
            cell: row => row.createdBy._id === currentUser.id && (
                <button
                    onClick={() => {
                        setPaymentToDelete(row._id);
                        setIsDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-full hover:bg-red-100 text-red-600 transition cursor-pointer"
                >
                    <Trash2 size={18} />
                </button>
            )
        },
    ];

    if (isLoadingPayments) return <div className="p-6 text-center p-medium animate-pulse text-[#6667DD]">Loading Payments...</div>;

    return (
        <div className="w-full px-6 py-6 bg-[#F6F9FC]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate("/recipients")} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300 cursor-pointer">
                        <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-2xl p-bold text-[#6667DD]">Shared Payment Details</h2>
                </div>
                <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-[#6667DD] text-white px-5 py-3 rounded-full shadow-sm hover:bg-[#5152b8] transition-all duration-300 p-regular cursor-pointer">
                    <Plus size={18} /> Add Payment
                </button>
            </div>

            {/* DataTable */}
            <DataTable
                columns={columns}
                data={payments}
                pagination
                highlightOnHover
                striped
                customStyles={{ headCells: { style: { fontSize: "14px", fontWeight: "600" } }, cells: { style: { fontSize: "14px", fontWeight: "400" } } }}
                noDataComponent={<div className="py-6 text-gray-500 p-medium">No payments added to this share yet.</div>}
            />

            {/* Add Payment Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#F6F9FC] rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"><X size={22} /></button>
                        <h3 className="text-xl p-semibold text-[#6667DD] mb-4">Add New Payment</h3>
                        <div className="flex gap-4 mb-4">
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Payment Title" className="flex-1 outline-none rounded-lg px-3 py-2 p-regular border-2 border-[#6667DD]" />
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 rounded-lg px-3 py-2 border-2 border-[#6667DD] p-regular cursor-pointer outline-none">
                                <option value="">Select Category</option>
                                <option value="Personal">Personal</option>
                                <option value="Business">Business</option>
                                <option value="Family">Family</option>
                                <option value="Friends">Friends</option>
                            </select>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="flex-1 rounded-lg px-3 py-2 border-2 border-[#6667DD] cursor-pointer outline-none p-regular">
                                <option value="USD">$ USD</option>
                                <option value="PKR">₨ PKR</option>
                                <option value="EUR">€ EUR</option>
                            </select>
                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="flex-1 p-regular outline-none rounded-lg px-3 py-2 border-2 border-[#6667DD]" />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <StatusButton currentStatus={status} onSelectStatus={setStatus} statusName="Paid" />
                            <StatusButton currentStatus={status} onSelectStatus={setStatus} statusName="Request" />
                            <StatusButton currentStatus={status} onSelectStatus={setStatus} statusName="Pending" />
                        </div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#6667DD] rounded-lg cursor-pointer hover:bg-gray-100 transition mb-4">
                            <Upload size={24} className="mb-2 text-gray-600" />
                            <span className="text-gray-600 p-regular">{imagePreview ? "Image Selected ✅" : "Upload Image (optional)"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setImageFile(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }
                            }} />
                        </label>
                        <button onClick={handleAddPayment} disabled={isAddingPayment} className={`w-full py-3 rounded-lg shadow-md p-medium transition-all duration-300 ${isAddingPayment ? "bg-[#999] cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5152b8] cursor-pointer"} text-white`}>
                            {isAddingPayment ? "Adding..." : "Add Payment"}
                        </button>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs" onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="Full View" className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg bg-white/20" />
                </div>
            )}

            {/* Delete Modal */}
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
                            Do you really want to delete this payment? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 cursor-pointer outline-none text-sm text-gray-700 p-regular"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deletePaymentMutate(paymentToDelete)}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 cursor-pointer outline-none text-sm p-regular"
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

// Helper components
const statusColors = { Paid: "#A0EDBC", "Request": "#F7CE7C", Pending: "#83C8F2" };
const selectedColors = { Paid: "#6fd49f", "Request": "#e6b23c", Pending: "#4ea3d9" };

const StatusBadge = ({ status }) => (
    <span className="px-3 py-1 rounded-full text-sm p-medium" style={{ backgroundColor: statusColors[status] }}>{status}</span>
);

const StatusButton = ({ currentStatus, onSelectStatus, statusName }) => {
    const isSelected = currentStatus === statusName;
    return (
        <button
            onClick={() => onSelectStatus(statusName)}
            className={`flex-1 cursor-pointer py-2 rounded-lg border-2 p-medium transition-all duration-300`}
            style={{
                backgroundColor: isSelected ? selectedColors[statusName] : statusColors[statusName],
                color: isSelected ? "#fff" : "#000",
                borderColor: statusColors[statusName]
            }}
        >
            {statusName}
        </button>
    );
};

export default RecipientsData;
