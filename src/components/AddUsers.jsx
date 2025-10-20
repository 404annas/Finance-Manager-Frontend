import React, { useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { sendInvite } from "../hooks/invite";

const AddUsers = () => {
    const [emails, setEmails] = useState([""]); // dynamic email fields

    const { mutate, isPending } = useMutation({
        mutationFn: sendInvite,
        onSuccess: (data) => {
            toast.success("Invites sent successfully!");
            setEmails([""]);
        },
        onError: (err) => {
            const errorMessage = err.response?.data?.message || "Something went wrong while sending invites.";
            toast.error(errorMessage);
        }
    })

    // handle input changes
    const handleChange = (index, value) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    // add new email field
    const addEmailField = () => setEmails([...emails, ""]);

    // send invites
    const handleSendInvite = async () => {
        if (emails.some((email) => !email)) {
            toast.error("All email fields must be filled!");
            return;
        }
        mutate({ emails })
    };

    return (
        <div className="flex justify-center items-center pt-6">
            <div className="bg-[#F6F9FC] shadow-sm rounded-2xl p-8 w-full max-w-lg">
                <h2 className="text-xl sm:text-2xl p-semibold text-[#6667DD] mb-6 text-center ">
                    Invite Friends to Your Finance
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
                            className="p-regular w-full px-4 py-2 rounded-lg outline-none border-2 border-[#6667DD] text-gray-700 text-sm sm:text-base"
                        />
                    ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                        onClick={addEmailField}
                        className="flex items-center justify-center gap-2 flex-1 py-2 rounded-lg bg-[#6667DD] text-white p-medium hover:bg-[#5656c4] transition-all duration-300 cursor-pointer hover:scale-95 w-full text-sm sm:text-base"
                    >
                        <Plus size={18} /> Add Another
                    </button>

                    <button
                        onClick={handleSendInvite}
                        disabled={isPending}
                        className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg text-white p-medium transition-all duration-300 cursor-pointer hover:scale-95 w-full text-sm sm:text-base ${isPending
                            ? "bg-green-300 hover:cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                            }`}
                    >
                        <Send size={18} /> {isPending ? "Sending..." : "Send Invites"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;
