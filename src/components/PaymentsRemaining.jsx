import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
    fetchSchedules,
    addSchedule,
    deleteSchedule,
    deleteAllSchedules,
} from "../hooks/schedule";

const PaymentsRemaining = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: schedules = [], isPending: loadingSchedules } = useQuery({
        queryKey: ["schedules"],
        queryFn: fetchSchedules,
        onError: () => toast.error("Failed to fetch scheduled payments"),
    });

    const { mutate: addScheduleMutate, isPending: isScheduling } = useMutation({
        mutationFn: addSchedule,
        onSuccess: () => {
            toast.success("Payment Scheduled Successfully");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            setTitle("");
            setMessage("");
            setSelectedDate(null);
        },
        onError: (err) =>
            toast.error(err.response?.data?.message || "Failed to schedule payment"),
    });

    const { mutate: deleteScheduleMutate, isPending: isDeleting, variables: deletingId } =
        useMutation({
            mutationFn: deleteSchedule,
            onSuccess: () => {
                toast.success("Schedule deleted");
                queryClient.invalidateQueries({ queryKey: ["schedules"] });
            },
            onError: (err) =>
                toast.error(err.response?.data?.message || "Failed to delete schedule"),
        });

    const { mutate: deleteAllMutate, isPending: isDeletingAll } = useMutation({
        mutationFn: deleteAllSchedules,
        onSuccess: () => {
            toast.success("All schedules deleted");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
        onError: (err) =>
            toast.error(err.response?.data?.message || "Failed to delete all schedules"),
    });

    const handleSchedule = () => {
        if (!selectedDate || !title || !message)
            return toast.error("Please fill all fields");
        addScheduleMutate({ title, message, scheduledDate: selectedDate });
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#eff7ff] to-[#F3E8FF] w-full">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between w-full">
                {/* LEFT FORM SECTION */}
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="text-[#6667DD]" size={22} />
                        <h2 className="text-lg sm:text-xl md:text-2xl p-semibold text-[#6667DD]">
                            Schedule Payment
                        </h2>
                    </div>

                    <p className="text-gray-600 text-sm sm:text-base p-regular mb-4 leading-relaxed">
                        Choose a date to schedule your next payment.
                    </p>

                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mb-3 p-2 sm:p-3 border-2 border-[#6667DD] outline-none rounded-xl p-regular text-sm sm:text-base"
                    />
                    <textarea
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full mb-4 p-2 sm:p-3 border-2 border-[#6667DD] outline-none p-regular rounded-xl resize-none text-sm sm:text-base"
                        rows={3}
                    />

                    <button
                        onClick={handleSchedule}
                        disabled={isScheduling}
                        className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5 rounded-full p-regular shadow-md transition-all duration-300 cursor-pointer w-full sm:w-auto text-sm sm:text-base ${isScheduling
                            ? "bg-[#9ba0e0] hover:cursor-not-allowed"
                            : "bg-[#6667DD] hover:bg-[#5253b8]"
                            } text-white`}
                    >
                        <Clock size={20} />{" "}
                        {isScheduling ? "Scheduling..." : "Schedule Payment"}
                    </button>
                </div>

                {/* RIGHT DATE PICKER SECTION */}
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

            {/* ===== SCHEDULED PAYMENTS LIST / SKELETON ===== */}
            <h1 className="text-[#6667DD] text-lg sm:text-xl md:text-2xl p-semibold mt-10">
                {loadingSchedules ? "Loading scheduled Payments..." : "All Payment Schedules"}
            </h1>

            {loadingSchedules ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="p-4 sm:p-5 bg-gray-200 rounded-xl shadow-sm h-32 flex flex-col justify-between"
                        >
                            <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-gray-300 rounded mb-1"></div>
                            <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {schedules.length === 0 && (
                        <p className="text-gray-500 text-center col-span-full p-regular mt-4 text-sm sm:text-base">
                            No payments scheduled.
                        </p>
                    )}

                    {schedules.map((s) => {
                        const isCurrentlyDeleting = isDeleting && deletingId === s._id;
                        return (
                            <div
                                key={s._id}
                                className="p-4 sm:p-5 bg-[#f0f4ff] rounded-xl shadow-sm relative"
                            >
                                <h3 className="text-[#6667DD] text-base sm:text-lg p-semibold mb-2 underline break-words">
                                    {s.title}
                                </h3>
                                <p className="text-gray-700 p-medium text-sm sm:text-base mt-2">
                                    {new Date(s.scheduledDate).toLocaleString()} - {s.status.toUpperCase()}
                                </p>
                                {s.message && (
                                    <p className="text-gray-500 text-xs sm:text-sm mt-1 p-regular break-words">
                                        {s.message}
                                    </p>
                                )}

                                <button
                                    onClick={() => {
                                        setScheduleToDelete(s._id);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    disabled={isCurrentlyDeleting}
                                    className={`absolute top-3 right-3 p-1.5 sm:p-2 cursor-pointer rounded-full transition-all duration-300 ${isCurrentlyDeleting ? "bg-red-300" : "hover:bg-red-200"
                                        }`}
                                >
                                    {isCurrentlyDeleting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Trash2 className="text-red-500" size={18} />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {schedules.length > 0 && (
                <button
                    onClick={() => setIsDeleteAllModalOpen(true)}
                    disabled={isDeletingAll}
                    className={`bg-red-500 transition-all duration-300 text-white py-2 px-4 sm:px-5 rounded-lg font-medium shadow-md p-regular mt-6 sm:mt-8 cursor-pointer ${isDeletingAll ? "bg-red-300 cursor-not-allowed" : "hover:bg-red-600"
                        }`}
                >
                    {isDeletingAll ? "Deleting..." : "Delete All"}
                </button>
            )}

            {/* DELETE MODALS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative border border-gray-300">
                        <X
                            size={20}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"
                            onClick={() => setIsDeleteModalOpen(false)}
                        />
                        <div className="p-3 bg-red-200 rounded-full mx-auto w-fit mb-3">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h2 className="text-lg p-semibold text-gray-800 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-6 p-regular text-sm">
                            Do you really want to delete this scheduled payment? This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 cursor-pointer outline-none text-sm text-gray-700 p-regular w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteScheduleMutate(scheduleToDelete);
                                    setIsDeleteModalOpen(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 cursor-pointer outline-none text-sm p-regular w-full sm:w-auto"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteAllModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative border border-gray-300">
                        <X
                            size={20}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"
                            onClick={() => setIsDeleteAllModalOpen(false)}
                        />
                        <div className="p-3 bg-red-200 rounded-full mx-auto w-fit mb-3">
                            <Trash2 size={20} className="text-red-500" />
                        </div>
                        <h2 className="text-lg p-semibold text-gray-800 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-6 p-regular text-sm">
                            Do you really want to delete all scheduled payments? This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => setIsDeleteAllModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 cursor-pointer outline-none text-sm text-gray-700 p-regular w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteAllMutate();
                                    setIsDeleteAllModalOpen(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 cursor-pointer outline-none text-sm p-regular w-full sm:w-auto"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsRemaining;
