import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Upload, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DataTable from "react-data-table-component";

const RecipientsData = () => {
    const navigate = useNavigate();
    const { id: shareId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // --- Component State ---
    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);

    // --- Data State ---
    const [payments, setPayments] = useState([]);
    const [shareInfo, setShareInfo] = useState(null); // Optional: to display share title

    // --- Form State ---
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("To Pay");
    const [image, setImage] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    // --- Data Fetching ---
    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/shares/${shareId}/payments`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to load data.");
                setPayments(data.payments || []);
            } catch (err) {
                toast.error(err.message);
                navigate("/recipients"); // Redirect if user is not authorized or share doesn't exist
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [shareId, API_URL, navigate]);

    // --- CRUD Operations ---
    const handleAddPayment = async () => {
        if (!title || !category || !currency || !amount || !status) {
            toast.error("Please fill all fields!");
            return;
        }
        setIsAdding(true);
        try {
            const res = await fetch(`${API_URL}/api/shares/${shareId}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify({ title, category, currency, amount, status, image }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add payment.");

            setPayments(prev => [...prev, data.payment]);
            toast.success("Payment added successfully!");
            setIsOpen(false);
            // Reset form fields
            setTitle("");
            setCategory("");
            setCurrency("USD");
            setAmount("");
            setStatus("To Pay");
            setImage(null);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (paymentId) => {
        if (!window.confirm("Are you sure you want to delete this payment?")) return;

        try {
            const res = await fetch(`${API_URL}/api/payments/${paymentId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete.");

            setPayments(prev => prev.filter(p => p._id !== paymentId));
            toast.success("Payment deleted!");
        } catch (err) {
            toast.error(err.message);
        }
    };

    // --- DataTable Configuration ---
    const columns = [
        { name: <span className="p-semibold">Title</span>, selector: row => row.title, cell: row => <span className="p-regular">{row.title}</span>, sortable: true },
        { name: <span className="p-semibold">Category</span>, selector: row => row.category, cell: row => <span className="p-regular">{row.category}</span>, sortable: true },
        { name: <span className="p-semibold">Amount</span>, selector: row => row.amount, cell: row => <span className="p-regular">{`${row.currency} ${row.amount}`}</span>, sortable: true },
        { name: <span className="p-semibold">Status</span>, cell: row => <StatusBadge status={row.status} />, sortable: true },
        { name: <span className="p-semibold">Added By</span>, selector: row => row.createdBy.name, cell: row => <span className="p-regular">{row.createdBy.name}</span>, sortable: true },
        { name: <span className="p-semibold">Image</span>, cell: row => row.image ? <img src={row.image} alt="payment" className="w-12 h-12 rounded-md object-cover" /> : <span className="text-gray-400 p-regular text-sm">No Image</span> },
        {
            name: <span className="p-semibold">Actions</span>,
            cell: (row) => (
                // Security: Only show delete button if the logged-in user created this payment
                row.createdBy._id === currentUser.id && (
                    <button onClick={() => handleDelete(row._id)} className="p-2 rounded-full hover:bg-red-100 text-red-600 transition cursor-pointer">
                        <Trash2 size={18} />
                    </button>
                )
            ),
            ignoreRowClick: true, allowOverflow: true, button: true,
        },
    ];

    if (loading) return <div className="p-6 text-center p-medium animate-pulse text-[#6667DD]">Loading Payments...</div>;

    return (
        <div className="w-full px-6 py-6 bg-[#F6F9FC]">
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

            <DataTable
                columns={columns}
                data={payments}
                pagination
                highlightOnHover
                striped
                customStyles={{ headCells: { style: { fontSize: "14px", fontWeight: "600" } }, cells: { style: { fontSize: "14px", fontWeight: "400" } } }}
                noDataComponent={<div className="py-6 text-gray-500 p-medium">No payments added to this share yet.</div>}
            />

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#F6F9FC] rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"
                        >
                            <X size={22} />
                        </button>
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
                            <StatusButton currentStatus={status} onSelectStatus={setStatus} statusName="To Pay" />
                            <StatusButton currentStatus={status} onSelectStatus={setStatus} statusName="Want" />
                        </div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#6667DD] rounded-lg cursor-pointer hover:bg-gray-100 transition mb-4">
                            <Upload size={24} className="mb-2 text-gray-600" />
                            <span className="text-gray-600 p-regular">{image ? "Image Selected ✅" : "Upload Image (optional)"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onloadend = () => setImage(reader.result);
                                    reader.readAsDataURL(file);
                                }
                            }} />
                        </label>
                        <button
                            onClick={handleAddPayment}
                            disabled={isAdding}
                            className={`w-full py-3 rounded-lg shadow-md p-medium transition-all duration-300 ${isAdding ? "bg-[#999] cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5152b8] cursor-pointer"} text-white`}
                        >
                            {isAdding ? "Adding..." : "Add Payment"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper components for styling
const statusColors = { Paid: "#A0EDBC", "To Pay": "#F7CE7C", Want: "#83C8F2" };
const selectedColors = { Paid: "#6fd49f", "To Pay": "#e6b23c", Want: "#4ea3d9" };

const StatusBadge = ({ status }) => (
    <span className="px-3 py-1 rounded-full text-sm p-medium" style={{ backgroundColor: statusColors[status] }}>
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
                backgroundColor: isSelected ? selectedColors[statusName] : statusColors[statusName],
                color: isSelected ? "#fff" : "#000",
                borderColor: statusColors[statusName],
            }}
        >
            {statusName}
        </button>
    );
};

export default RecipientsData;