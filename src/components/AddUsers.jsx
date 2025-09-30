import React, { useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";

const AddUsers = () => {
    const [emails, setEmails] = useState([""]);
    const [sending, setSending] = useState(false); // loading state
    const API_URL = import.meta.env.VITE_API_URL;

    const handleChange = (index, value) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    const addEmailField = () => setEmails([...emails, ""]);

    const handleSendInvite = async () => {
        if (!emails[0]) {
            toast.error("Email is required!");
            return;
        }
        setSending(true); // start loader
        try {
            const res = await fetch(`${API_URL}/api/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ email: emails[0] }), // sending only first email for now
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
        } finally {
            setSending(false); // stop loader
        }
    };

    return (
        <div className="flex justify-center items-center pt-6">
            <div className="bg-[#F6F9FC] shadow-lg rounded-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl p-semibold text-[#6667DD] mb-6 text-center">
                    Invite Friend To Your Finance
                </h2>

                <div className="space-y-4">
                    {emails.map((email, index) => (
                        <input
                            key={index}
                            type="email"
                            placeholder={`Friend's Email ${index + 1}`}
                            value={email}
                            required
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="p-regular w-full px-4 py-2 rounded-lg outline-none border-2 border-[#6667DD] text-gray-700"
                        />
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                        onClick={addEmailField}
                        className="flex items-center justify-center gap-2 flex-1 py-2 rounded-lg bg-[#6667DD] text-white p-medium hover:bg-[#5656c4] transition-all duration-300 cursor-pointer hover:scale-95"
                    >
                        <Plus size={18} /> Add Another
                    </button>

                    <button
                        onClick={handleSendInvite}
                        disabled={sending}
                        className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg text-white p-medium transition-all duration-300 cursor-pointer hover:scale-95 ${sending ? "bg-green-300 hover:cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                            }`}
                    >
                        <Send size={18} /> {sending ? "Sending..." : "Send Invites"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;
