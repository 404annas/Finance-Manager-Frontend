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

    const fetchSchedules = async () => {
        try {
            const res = await axios.get("/api/schedules");
            setSchedules(res.data.schedules);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch scheduled payments");
        }
    };

    useEffect(() => { fetchSchedules(); }, []);

    const handleSchedule = async () => {
        if (!selectedDate) return toast.error("Please fill all fields");
        try {
            await axios.post("/api/schedule-payment", { title, message, scheduledDate: selectedDate });
            setTitle(""); setMessage(""); setSelectedDate(null);
            toast.success("Payment Scheduled Successfully");
            fetchSchedules();
        } catch (err) {
            console.error(err); toast.error("Failed to schedule payment");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/schedule/${id}`);
            toast.success("Schedule deleted");
            fetchSchedules();
        } catch (err) {
            console.error(err); toast.error("Failed to delete schedule");
        }
    };

    const handleDeleteAll = async () => {
        try {
            await axios.delete("/api/schedules");
            toast.success("All schedules deleted");
            fetchSchedules();
        } catch (err) {
            console.error(err); toast.error("Failed to delete all schedules");
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

                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
                        className="w-full mb-3 p-2 border-2 border-[#6667DD] outline-none rounded-xl p-regular" />
                    <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)}
                        className="w-full mb-4 p-2 border-2 border-[#6667DD] outline-none p-regular rounded-xl resize-none" rows={2} />

                    <button onClick={handleSchedule}
                        className="flex items-center gap-2 bg-[#6667DD] text-white py-3 px-4 rounded-full p-regular hover:bg-[#5253b8] shadow-md cursor-pointer">
                        <Clock size={20} /> Schedule Payment
                    </button>
                </div>

                <div className="flex-1 w-full max-w-md">
                    <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} showTimeSelect
                        timeFormat="HH:mm" timeIntervals={5} dateFormat="MMMM d, yyyy h:mm aa"
                        inline className="rounded-2xl border border-gray-200 shadow-lg p-4 bg-white" />
                </div>
            </div>

            <h1 className="text-[#6667DD] text-xl p-semibold mt-10">All Payment Status</h1>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map(s => (
                    <div key={s._id} className="p-4 bg-[#f0f4ff] rounded-xl shadow-sm relative">
                        <h3 className="text-[#6667DD] text-lg p-semibold mb-2 underline">{s.title}</h3>
                        <p className="text-gray-700 p-medium mt-5">{new Date(s.scheduledDate).toLocaleString()} - {s.status.toUpperCase()}</p>
                        {s.message && <p className="text-gray-500 text-sm mt-1 p-regular">{s.message}</p>}
                        <Trash2 className="absolute top-3 right-3 cursor-pointer text-red-500 hover:text-red-600 transition-all duration-300" size={20} onClick={() => handleDelete(s._id)} />
                    </div>
                ))}
            </div>

            {schedules.length > 0 && (
                <button
                    onClick={handleDeleteAll}
                    className="bg-red-500 transition-all duration-300 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 shadow-md cursor-pointer p-regular mt-4"
                >
                    Delete All
                </button>
            )}
        </div>
    );
};

export default PaymentsRemaining;
