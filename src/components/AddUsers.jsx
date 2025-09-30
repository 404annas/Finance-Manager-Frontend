import React, { useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";

const AddUsers = () => {
    const [emails, setEmails] = useState([""]);
    const API_URL = import.meta.env.VITE_API_URL
    console.log("token in frontend:", localStorage.getItem("token"));

    // handle input change
    const handleChange = (index, value) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    // add new email field
    const addEmailField = () => {
        setEmails([...emails, ""]);
    };

    const handleSendInvite = async () => {
        try {
            const res = await fetch(`${API_URL}/api/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ email: emails[0] }),
            });

            const data = await res.json();
            if (res.ok) {
                console.log("✅ Invite success:", data);
                toast.success("Invite sent successfully!");
            } else {
                console.error("❌ Invite failed:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("⚠️ API error:", error);
            toast.error("Something went wrong while sending invite");
        }
    };

    return (
        <div className="flex justify-center items-center pt-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
                {/* Heading */}
                <h2 className="text-2xl p-semibold text-[#6667DD] mb-6 text-center">
                    Invite Friend To Your Finance
                </h2>

                {/* Email Inputs */}
                <div className="space-y-4">
                    {emails.map((email, index) => (
                        <input
                            key={index}
                            type="email"
                            placeholder={`Friend's Email ${index + 1}`}
                            value={email}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="p-regular w-full px-4 py-2 rounded-lg outline-none border-2 border-[#6667DD] text-gray-700"
                        />
                    ))}
                </div>

                {/* Buttons in same row */}
                <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                        onClick={addEmailField}
                        className="flex items-center justify-center gap-2 flex-1 py-2 rounded-lg bg-[#6667DD] text-white p-medium hover:bg-[#5656c4] transition-all duration-300 cursor-pointer hover:scale-95"
                    >
                        <Plus size={18} /> Add Another
                    </button>

                    <button
                        onClick={handleSendInvite}
                        className="flex items-center justify-center gap-2 flex-1 py-2 rounded-lg bg-green-500 text-white p-medium hover:bg-green-600 transition-all duration-300 cursor-pointer hover:scale-95"
                    >
                        <Send size={18} /> Send Invites
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;
