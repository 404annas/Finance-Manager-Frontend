import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import PaymentsRemaining from "./PaymentsRemaining";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPaymentsDone, addPaymentDone, deletePaymentDone, deleteAllPaymentsDone } from "../hooks/payments";

const Payments = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", receiver: "", amount: "", message: "" });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: payments = [], isPending: isLoadingPayments } = useQuery({
        queryKey: ["paymentsDone"],
        queryFn: fetchPaymentsDone,
        onError: () => toast.error("Could Not Fetch Payments")
    });

    const { mutate: addPaymentMutate, isPending: isAddingPayment } = useMutation({
        mutationFn: addPaymentDone,
        onSuccess: () => {
            toast.success("Payment Added Successfully");
            queryClient.invalidateQueries({ queryKey: ["paymentsDone"] });
            setIsOpen(false);
            setFormData({ title: "", receiver: "", amount: "", message: "" });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to add payment."),
    });

    const { mutate: deletePaymentMutate, isPending: isDeleting, variables: deletingId } = useMutation({
        mutationFn: deletePaymentDone,
        onSuccess: () => {
            toast.success("Payment deleted.");
            queryClient.invalidateQueries({ queryKey: ["paymentsDone"] });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete payment."),
    });

    const { mutate: deleteAllMutate, isPending: isDeletingAll } = useMutation({
        mutationFn: deleteAllPaymentsDone,
        onSuccess: () => {
            toast.success("All payments have been cleared.");
            queryClient.invalidateQueries({ queryKey: ["paymentsDone"] });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete payments."),
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        addPaymentMutate(formData);
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

            {/* Add Payment Modal */}
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
                                            disabled={isAddingPayment}
                                            className={`px-5 py-2 rounded-lg shadow-md transition-all duration-300 p-regular cursor-pointer text-white ${isAddingPayment ? "bg-gray-400 hover:cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5253b8]"}`}
                                        >
                                            {isAddingPayment ? "Adding..." : "Add"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>

            {/* Payments Table */}
            <div className="overflow-x-auto bg-transparent rounded-lg shadow p-4">
                {isLoadingPayments ? (
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
                                    payments.map((p) => {
                                        const isCurrentlyDeleting = isDeleting && deletingId === p._id;
                                        return (
                                            <tr key={p._id} className="border-b hover:bg-gray-50 transition-all duration-300 p-regular">
                                                <td className="px-4 py-2 text-left">{p.title}</td>
                                                <td className="px-4 py-2 text-left">{p.receiver}</td>
                                                <td className="px-4 py-2 text-left">{p.amount}</td>
                                                <td className="px-4 py-2 text-left">{p.message}</td>
                                                <td className="px-4 py-2 text-left">
                                                    <button
                                                        onClick={() => {
                                                            setPaymentToDelete(p._id);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        disabled={isCurrentlyDeleting}
                                                        className="p-2 flex items-center justify-center transition-all duration-300 cursor-pointer"
                                                    >
                                                        {isCurrentlyDeleting ? (
                                                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 transition-all duration-300" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
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
                                    onClick={() => setIsDeleteAllModalOpen(true)}
                                    disabled={isDeletingAll}
                                    className={`px-5 py-2 rounded-lg shadow-md transition-all duration-300 p-regular text-white ${isDeletingAll ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 cursor-pointer"}`}
                                >
                                    {isDeletingAll ? "Deleting..." : "Delete All"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <PaymentsRemaining />

            {/* Individual Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative animate-scaleUp border border-gray-300">
                        <X size={20} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer transition" onClick={() => setIsDeleteModalOpen(false)} />
                        <div className="p-3 bg-red-200 rounded-full mx-auto w-fit mb-3">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h2 className="text-lg p-semibold text-gray-800 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-6 p-regular text-sm">Do you really want to delete this payment? This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 cursor-pointer outline-none text-sm text-gray-700 p-regular">Cancel</button>
                            <button onClick={() => { deletePaymentMutate(paymentToDelete); setIsDeleteModalOpen(false); }} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 cursor-pointer outline-none text-sm p-regular">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete All Modal */}
            {isDeleteAllModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative animate-scaleUp border border-gray-300">
                        <X size={20} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer transition" onClick={() => setIsDeleteAllModalOpen(false)} />
                        <div className="p-3 bg-red-200 rounded-full mx-auto w-fit mb-3">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-6 p-regular text-sm">Do you really want to delete all payments? This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsDeleteAllModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 cursor-pointer outline-none text-sm text-gray-700 p-regular">Cancel</button>
                            <button onClick={() => { deleteAllMutate(); setIsDeleteAllModalOpen(false); }} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 cursor-pointer outline-none text-sm p-regular">Delete All</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
