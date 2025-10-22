import { useState } from "react";
import { Mail, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "../hooks/contact";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        type: "support",
        message: "",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: sendContactMessage,
        onSuccess: (data) => {
            toast.success(data.message || "Your message has been sent!");
            setFormData({ name: "", email: "", type: "support", message: "" });
        },
        onError: (err) => {
            const errorMessage = err.response?.data?.message || "Failed to send message. Please try again.";
            toast.error(errorMessage);
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutate(formData);
    };

    return (
        <div className="flex justify-center items-start sm:items-center sm:px-4 md:px-6 lg:px-8">
            <div className="bg-[#F6F9FC] shadow-sm p-4 sm:py-6 sm:px-8 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl">
                <h2 className="text-xl sm:text-2xl lg:text-3xl p-semibold text-[#6667DD] mb-2 text-center">
                    Contact Us
                </h2>
                <p className="text-gray-600 text-center mb-6 text-sm sm:text-base p-regular">
                    Reach out for support or share your suggestions/recommendations!
                </p>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* Name & Email Row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 flex items-center border-2 border-[#6667DD] rounded-lg px-2 sm:px-3 py-2 sm:py-2.5">
                            <User className="text-gray-500 mr-2" size={18} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full outline-none p-regular text-sm sm:text-base"
                                required
                            />
                        </div>
                        <div className="flex-1 flex items-center border-2 border-[#6667DD] rounded-lg px-2 sm:px-3 py-2 sm:py-2.5">
                            <Mail className="text-gray-500 mr-2" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full outline-none p-regular text-sm sm:text-base"
                                required
                            />
                        </div>
                    </div>

                    {/* Dropdown */}
                    <div>
                        <label className="block text-gray-700 text-sm mb-1 p-regular">
                            Type of Message
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border-2 border-[#6667DD] cursor-pointer rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 outline-none p-regular text-sm sm:text-base"
                        >
                            <option value="support">Support</option>
                            <option value="recommendation">Recommendation</option>
                            <option value="bug">Report a Bug</option>
                            <option value="feature">Feature Request</option>
                            <option value="general">General Inquiry</option>
                        </select>
                    </div>

                    {/* Message Box */}
                    <div className="flex items-start border-2 border-[#6667DD] rounded-lg px-2 sm:px-3 py-2 sm:py-2.5">
                        <MessageSquare className="text-gray-500 mt-1 mr-2" size={18} />
                        <textarea
                            name="message"
                            placeholder="Your message..."
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full outline-none p-regular resize-none text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`w-full py-3 sm:py-3.5 text-white rounded-lg shadow-md transition-all duration-500 p-regular text-sm sm:text-base
                            ${isPending
                                ? "bg-[#6667DD] opacity-70 cursor-not-allowed"
                                : "bg-[#6667DD] hover:bg-[#5253b8] hover:scale-97 cursor-pointer"
                            }`}
                    >
                        {isPending ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
