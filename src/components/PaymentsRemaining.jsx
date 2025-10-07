import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchSchedules, addSchedule, deleteSchedule, deleteAllSchedules } from "../hooks/schedule";

const PaymentsRemaining = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const queryClient = useQueryClient();

    const { data: schedules = [], isPending: loadingSchedules } = useQuery({
        queryKey: ["schedules"],
        queryFn: fetchSchedules,
        onError: () => toast.error("Failed to fetch scheduled payments")
    })

    const { mutate: addScheduleMutate, isPending: isScheduling } = useMutation({
        mutationFn: addSchedule,
        onSuccess: () => {
            toast.success("Payment Scheduled Successfully");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            setTitle("");
            setMessage("");
            setSelectedDate(null);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to schedule payment"),
    });

    const { mutate: deleteScheduleMutate, isPending: isDeleting, variables: deletingId } = useMutation({
        mutationFn: deleteSchedule,
        onSuccess: () => {
            toast.success("Schedule deleted");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete schedule"),
    });

    const { mutate: deleteAllMutate, isPending: isDeletingAll } = useMutation({
        mutationFn: deleteAllSchedules,
        onSuccess: () => {
            toast.success("All schedules deleted");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete all schedules"),
    });

    const handleSchedule = () => {
        if (!selectedDate || !title || !message) return toast.error("Please fill all fields");
        addScheduleMutate({ title, message, scheduledDate: selectedDate });
    };

    return (
        <div className="mt-8 p-8 bg-gradient-to-r from-[#f6f9fc] to-[#F3E8FF] rounded-3xl shadow-lg w-full">
            <div className="flex flex-col lg:flex-row gap-10 items-start justify-between w-full">

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="text-[#6667DD]" size={22} />
                        <h2 className="text-xl p-semibold text-[#6667DD]">Schedule Payment</h2>
                    </div>

                    <p className="text-gray-600 text-sm p-regular mb-4 leading-relaxed">
                        Choose a date to schedule your next payment.
                    </p>

                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full mb-3 p-2 border-2 border-[#6667DD] outline-none rounded-xl p-regular"
                    />
                    <textarea
                        placeholder="Message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full mb-4 p-2 border-2 border-[#6667DD] outline-none p-regular rounded-xl resize-none"
                        rows={2}
                    />

                    <button
                        onClick={handleSchedule}
                        disabled={isScheduling}
                        className={`flex items-center gap-2 py-3 px-4 rounded-full p-regular shadow-md transition-all duration-300 cursor-pointer ${isScheduling ? "bg-[#9ba0e0] cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5253b8]"} text-white`}
                    >
                        <Clock size={20} /> {isScheduling ? "Scheduling..." : "Schedule Payment"}
                    </button>
                </div>

                <div className="flex-1 w-full max-w-md">
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={5}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        inline
                        className="rounded-2xl border border-gray-200 shadow-lg p-4 bg-white"
                    />
                </div>
            </div>

            <h1 className="text-[#6667DD] text-xl p-semibold mt-10">
                {loadingSchedules ? "Loading Payment Statuses..." : "All Payment Status"}
            </h1>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map(s => {
                    const isCurrentlyDeleting = isDeleting && deletingId === s._id;
                    return (
                        <div key={s._id} className="p-4 bg-[#f0f4ff] rounded-xl shadow-sm relative">
                            <h3 className="text-[#6667DD] text-lg p-semibold mb-2 underline">{s.title}</h3>
                            <p className="text-gray-700 p-medium mt-5">{new Date(s.scheduledDate).toLocaleString()} - {s.status.toUpperCase()}</p>
                            {s.message && <p className="text-gray-500 text-sm mt-1 p-regular">{s.message}</p>}

                            <button
                                onClick={() => deleteScheduleMutate(s._id)}
                                disabled={isCurrentlyDeleting}
                                className={`absolute top-3 right-3 p-2 cursor-pointer rounded-full transition-all duration-300 ${isCurrentlyDeleting ? "bg-red-300 ..." : "hover:bg-red-200 ..."}`}
                            >
                                {isCurrentlyDeleting ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Trash2 className="text-red-500" size={20} />
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>

            {schedules.length > 0 && (
                <button
                    onClick={() => deleteAllMutate()}
                    disabled={isDeletingAll}
                    className={`bg-red-500 transition-all duration-300 text-white py-2 px-4 rounded-lg font-medium shadow-md p-regular mt-4 cursor-pointer ${isDeletingAll ? "bg-red-300 cursor-not-allowed" : "hover:bg-red-600"}`}
                >
                    {isDeletingAll ? "Deleting..." : "Delete All"}
                </button>
            )}
        </div>
    );
};

export default PaymentsRemaining;
