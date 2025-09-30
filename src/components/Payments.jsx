import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import PaymentsRemaining from "./PaymentsRemaining";

const Payments = () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const API_URL = import.meta.env.VITE_API_URL

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        receiver: "",
        amount: "",
        message: "",
    });
    const [payments, setPayments] = useState([]);

    // Fetch payments
    const fetchPayments = async () => {
        const res = await axios.get(`${API_URL}/api/payments-done`);
        setPayments(Array.isArray(res.data.payments) ? res.data.payments : []);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/payments-done`, formData);
            setFormData({ title: "", receiver: "", amount: "", message: "" });
            setIsOpen(false);
            fetchPayments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/api/payments-done/${id}`);
        fetchPayments();
    };

    const handleDeleteAll = async () => {
        await axios.delete(`${API_URL}/api/payments-done`);
        fetchPayments();
    };

    return (
        <div className="w-full bg-[#f6f9fc] flex flex-col p-6">
            {/* Upper Half */}
            <div className="flex justify-between items-center  mb-6">
                <h2 className="text-xl p-semibold text-[#6667DD]">Payments Done</h2>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-3 bg-[#6667DD] hover:bg-[#5253b8] text-white rounded-full hover:scale-95 transition-all duration-300 p-regular cursor-pointer"
                >
                    + Add Payment
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
                                className="w-full max-w-lg rounded-2xl bg-white border-2 border-[#6667DD] shadow-lg p-6"
                            >
                                <Dialog.Title className="text-xl p-semibold text-[#6667DD] mb-4">
                                    Add New Payment
                                </Dialog.Title>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Title"
                                        className="w-full px-3 py-2 border-2 rounded-lg outline-none border-[#6667DD] p-regular"
                                        required
                                    />
                                    <input
                                        name="receiver"
                                        value={formData.receiver}
                                        onChange={handleChange}
                                        placeholder="Receiver's Name"
                                        className="w-full px-3 py-2 border-2 rounded-lg outline-none border-[#6667DD] p-regular"
                                        required
                                    />
                                    <input
                                        name="amount"
                                        type="number"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="Amount"
                                        className="w-full px-3 py-2 border-2 rounded-lg outline-none border-[#6667DD] p-regular"
                                        required
                                    />
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Message"
                                        rows="3"
                                        className="w-full px-3 py-2 border-2 rounded-lg outline-none border-[#6667DD] p-regular resize-none"
                                    />
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-700 p-regular cursor-pointer transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-[#6667DD] hover:bg-[#5253b8] text-white rounded-lg shadow-md transition-all duration-300 p-regular cursor-pointer"
                                        >
                                            Done
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
                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md p-regular cursor-pointer transition-all duration-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500 p-regular">
                                    No payments added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>

                {payments.length > 0 && (
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleDeleteAll}
                            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer transition-all duration-300 shadow-md p-regular"
                        >
                            Delete All
                        </button>
                    </div>
                )}
            </div>
            {/* Remaining Payments Placeholder */}
            <PaymentsRemaining />
        </div>
    );
};

export default Payments;
