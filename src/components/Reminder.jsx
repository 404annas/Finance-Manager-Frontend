import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { sendReminder } from "../hooks/reminder";

const Reminder = () => {
    const [formData, setFormData] = useState({
        subject: "",
        email: "",
        amount: "",
        currency: "USD",
        message: "",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: sendReminder,
        onSuccess: (data) => {
            toast.success(data.message || "Reminder sent successfully!");
            setFormData({ subject: "", email: "", amount: "", currency: "USD", message: "" });
        },
        onError: (err) => {
            const errorMessage = err.response?.data?.message || "Error occurred while sending the reminder.";
            toast.error(errorMessage);
        }
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutate(formData)
    };

    return (
        <div className="bg-[#F6F9FC] p-6 rounded-2xl shadow-sm max-w-4xl mx-auto">
            {/* Heading */}
            <h2 className="text-2xl p-semibold text-[#6667DD] mb-6 text-center">
                Send Payment Reminder
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Subject Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        name="subject"
                        placeholder="Reminder Title"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-regular px-4 py-3 rounded-lg border-2 border-[#6667DD] outline-none"
                    />

                    {/* Email Input */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Recipient Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-regular px-4 py-3 rounded-lg border-2 border-[#6667DD] outline-none"
                    />
                </div>

                {/* Amount + Currency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full p-regular px-3 py-2 rounded-lg border-2 border-[#6667DD] outline-none cursor-pointer"
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="PKR">PKR (₨)</option>
                        <option value="INR">INR (₹)</option>
                    </select>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full p-regular px-4 py-2 rounded-lg border-2 border-[#6667DD] outline-none"
                    />
                </div>

                {/* Message Box */}
                <textarea
                    name="message"
                    placeholder="Write a message..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-regular px-4 py-3 rounded-lg border-2 border-[#6667DD] outline-none resize-none"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending} // disable button during loading
                    className={`w-full ${isPending ? "bg-gray-400 hover:cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5253b8]"
                        } text-white py-3 rounded-lg shadow transition-all duration-300 cursor-pointer p-regular`}
                >
                    {isPending ? "Reminding..." : "Send Reminder"} {/* show loading text */}
                </button>
            </form>
        </div>
    );
};

export default Reminder;
