import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import PaymentsRemaining from "./PaymentsRemaining";
import { toast } from "sonner";

const Payments = () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const API_URL = import.meta.env.VITE_API_URL;

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", receiver: "", amount: "", message: "" });
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const [addingPayment, setAddingPayment] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteAllLoading, setDeleteAllLoading] = useState(false);

    // Fetch initial payments
    useEffect(() => {
        const fetchPayments = async () => {
            setLoadingPayments(true);
            try {
                const res = await axios.get(`${API_URL}/api/payments-done`);
                setPayments(Array.isArray(res.data.payments) ? res.data.payments : []);
            } catch (err) {
                console.error(err);
                toast.error("Can't able to Fetch Payments")
            } finally {
                setLoadingPayments(false);
            }
        };
        fetchPayments();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Add new payment directly to state
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAddingPayment(true);
        try {
            const res = await axios.post(`${API_URL}/api/payments-done`, formData);
            const newPayment = res.data.payment; // Assuming backend returns added payment
            setPayments((prev) => [...prev, newPayment]);
            setFormData({ title: "", receiver: "", amount: "", message: "" });
            setIsOpen(false);
            toast.success("Payment Added")
        } catch (err) {
            console.error(err);
            toast.error("Can't able to Add Payment")
        } finally {
            setAddingPayment(false);
        }
    };

    // Delete directly from state
    const handleDelete = async (id) => {
        setDeleteLoading((prev) => ({ ...prev, [id]: true }));
        setTimeout(async () => {
            try {
                await axios.delete(`${API_URL}/api/payments-done/${id}`);
                setPayments((prev) => prev.filter((p) => p._id !== id));
                toast.success("Payment Deleted")
            } catch (err) {
                console.error(err);
                toast.error("Can't able to Delete Payment")
            } finally {
                setDeleteLoading((prev) => ({ ...prev, [id]: false }));
            }
        }, 1000);
    };

    // Delete All
    const handleDeleteAll = async () => {
        setDeleteAllLoading(true);
        try {
            await axios.delete(`${API_URL}/api/payments-done`);
            setPayments([]);
            toast.success("All Payments Deleted")
        } catch (err) {
            console.error(err);
            toast.error("Can't able to Delete Payments")
        } finally {
            setDeleteAllLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#f6f9fc] flex flex-col p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl p-semibold text-[#6667DD]">Payments Done</h2>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-[#6667DD] hover:bg-[#5557c4] text-white px-4 py-3 rounded-full shadow transition-all duration-300 cursor-pointer hover:scale-95 p-regular"
                >
                    <Plus size={18} /> Add Transaction
                </button>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-lg rounded-2xl bg-[#F6F9FC] border-2 border-[#6667DD] shadow-lg p-6"
                            >
                                <Dialog.Title className="text-xl p-semibold text-[#6667DD] mb-4">
                                    Add New Payment
                                </Dialog.Title>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border-2 rounded-lg outline-none border-[#6667DD] p-regular" required />
                                    <input name="receiver" value={formData.receiver} onChange={handleChange} placeholder="Receiver's Name" className="w-full px-3 py-2 border-2 rounded-lg outline-none border-[#6667DD] p-regular" required />
                                    <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="Amount" className="w-full px-3 py-2 border-2 rounded-lg outline-none border-[#6667DD] p-regular" required />
                                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" rows="3" className="w-full px-3 py-2 border-2 rounded-lg outline-none border-[#6667DD] p-regular resize-none" />
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-700 p-regular cursor-pointer transition-all duration-300">Cancel</button>
                                        <button
                                            type="submit"
                                            disabled={addingPayment}
                                            className={`px-5 py-2 rounded-lg shadow-md transition-all duration-300 p-regular cursor-pointer text-white ${addingPayment ? "bg-gray-400 hover:cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5253b8]"}`}
                                        >
                                            {addingPayment ? "Adding..." : "Add"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>

            {/* Data Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
                {loadingPayments ? (
                    <p className="text-[#6667DD] text-center text-lg p-regular animate-pulse">Loading Payments...</p>
                ) : (
                    <>
                        <table className="min-w-full table-auto border-collapse text-left">
                            <thead>
                                <tr className="bg-[#6667DD] text-white p-regular uppercase text-sm">
                                    <th className="px-4 py-2 text-left">Title</th>
                                    <th className="px-4 py-2 text-left">Receiver</th>
                                    <th className="px-4 py-2 text-left">Amount</th>
                                    <th className="px-4 py-2 text-left">Message</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((p) => (
                                        <tr key={p._id} className="border-b hover:bg-gray-50 transition-all duration-300 p-regular">
                                            <td className="px-4 py-2 text-left">{p.title}</td>
                                            <td className="px-4 py-2 text-left">{p.receiver}</td>
                                            <td className="px-4 py-2 text-left">{p.amount}</td>
                                            <td className="px-4 py-2 text-left">{p.message}</td>
                                            <td className="px-4 py-2 text-left">
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    disabled={deleteLoading[p._id]}
                                                    className="p-2 flex items-center justify-center transition-all duration-300 cursor-pointer"
                                                >
                                                    {deleteLoading[p._id] ? (
                                                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600 transition-all duration-300 cursor-pointer" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500 p-regular">No payments added yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {payments.length > 0 && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleDeleteAll}
                                    disabled={deleteAllLoading}
                                    className={`px-5 py-2 rounded-lg shadow-md transition-all duration-300 p-regular text-white ${deleteAllLoading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 cursor-pointer"}`}
                                >
                                    {deleteAllLoading ? "Deleting..." : "Delete All"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <PaymentsRemaining />
        </div>
    );
};

export default Payments;
