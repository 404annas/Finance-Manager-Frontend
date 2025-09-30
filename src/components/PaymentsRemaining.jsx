import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const PaymentsRemaining = () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const [selectedDate, setSelectedDate] = useState(null);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [scheduling, setScheduling] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteAllLoading, setDeleteAllLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchSchedules = async () => {
        setLoadingSchedules(true);
        try {
            const res = await axios.get(`${API_URL}/api/schedules`);
            setSchedules(Array.isArray(res.data.schedules) ? res.data.schedules : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch scheduled payments");
        } finally {
            setLoadingSchedules(false);
        }
    };

    useEffect(() => { fetchSchedules(); }, []);

    const handleSchedule = async () => {
        if (!selectedDate || !title || !message) return toast.error("Please fill all fields");
        setScheduling(true);
        try {
            await axios.post(`${API_URL}/api/schedule-payment`, { title, message, scheduledDate: selectedDate });
            setTitle(""); setMessage(""); setSelectedDate(null);
            toast.success("Payment Scheduled Successfully");
            fetchSchedules();
        } catch (err) {
            console.error(err);
            toast.error("Failed to schedule payment");
        } finally {
            setScheduling(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleteLoading(prev => ({ ...prev, [id]: true }));
        try {
            await axios.delete(`${API_URL}/api/schedule/${id}`);
            toast.success("Schedule deleted");
            setSchedules(prev => prev.filter(s => s._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete schedule");
        } finally {
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleDeleteAll = async () => {
        setDeleteAllLoading(true);
        try {
            await axios.delete(`${API_URL}/api/schedules`);
            toast.success("All schedules deleted");
            setSchedules([]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete all schedules");
        } finally {
            setDeleteAllLoading(false);
        }
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
                        disabled={scheduling}
                        className={`flex items-center gap-2 py-3 px-4 rounded-full p-regular shadow-md transition-all duration-300 cursor-pointer ${scheduling ? "bg-[#9ba0e0] cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5253b8]"} text-white`}
                    >
                        <Clock size={20} /> {scheduling ? "Scheduling..." : "Schedule Payment"}
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
                {schedules.map(s => (
                    <div key={s._id} className="p-4 bg-[#f0f4ff] rounded-xl shadow-sm relative">
                        <h3 className="text-[#6667DD] text-lg p-semibold mb-2 underline">{s.title}</h3>
                        <p className="text-gray-700 p-medium mt-5">{new Date(s.scheduledDate).toLocaleString()} - {s.status.toUpperCase()}</p>
                        {s.message && <p className="text-gray-500 text-sm mt-1 p-regular">{s.message}</p>}

                        <button
                            onClick={() => handleDelete(s._id)}
                            disabled={deleteLoading[s._id]}
                            className={`absolute top-3 right-3 p-1 rounded-full transition-all duration-300 ${deleteLoading[s._id] ? "bg-red-300 hover:cursor-not-allowed p-2" : "hover:bg-red-200 cursor-pointer p-2 transition-all duration-300"}`}
                        >
                            {deleteLoading[s._id] ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Trash2 className="text-red-500" size={20} />
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {schedules.length > 0 && (
                <button
                    onClick={handleDeleteAll}
                    disabled={deleteAllLoading}
                    className={`bg-red-500 transition-all duration-300 text-white py-2 px-4 rounded-lg font-medium shadow-md p-regular mt-4 cursor-pointer ${deleteAllLoading ? "bg-red-300 cursor-not-allowed" : "hover:bg-red-600"}`}
                >
                    {deleteAllLoading ? "Deleting..." : "Delete All"}
                </button>
            )}
        </div>
    );
};

export default PaymentsRemaining;
