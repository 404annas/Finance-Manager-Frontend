import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, UserRoundCheck, UserPlus2Icon, Trash2, X, SquarePen, Ban } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { fetchSchedules, addSchedule, deleteSchedule, deleteAllSchedules, updateSchedule } from "../hooks/schedule";
import { fetchUsers } from "../hooks/getUsers";

const PaymentsRemaining = () => {
    const [editingSchedule, setEditingSchedule] = useState(null);

    // --- Form State ---
    const [selectedDate, setSelectedDate] = useState(null);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    // --- UI State ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

    // --- Feature State ---
    const [scheduleType, setScheduleType] = useState("me"); // 'me' or 'recipients'
    const [selectedRecipients, setSelectedRecipients] = useState([]);

    const queryClient = useQueryClient();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // --- Data Fetching & Mutations ---
    const { data: schedules = [], isPending: loadingSchedules } = useQuery({
        queryKey: ["schedules"],
        queryFn: fetchSchedules,
        onError: () => toast.error("Failed to fetch scheduled payments"),
    });

    const { data: usersData, isPending: isLoadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
        enabled: scheduleType === 'recipients',
    });

    const resetForm = () => {
        setTitle("");
        setMessage("");
        setSelectedDate(null);
        setSelectedRecipients([]);
        setEditingSchedule(null);
    };

    const { mutate: addScheduleMutate, isPending: isAdding } = useMutation({
        mutationFn: addSchedule,
        onSuccess: () => {
            toast.success("Payment Scheduled Successfully");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            setTitle("");
            setMessage("");
            setSelectedDate(null);
            setSelectedRecipients([]);
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to schedule payment"),
    });

    const { mutate: updateScheduleMutate, isPending: isUpdating } = useMutation({
        mutationFn: updateSchedule,
        onSuccess: () => {
            toast.success("Schedule Updated Successfully");
            queryClient.invalidateQueries({ queryKey: ["schedules"] }); resetForm();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to update schedule"),
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

    // --- Logic & Event Handlers ---
    const recipientOptions = useMemo(() => {
        if (!usersData?.invitedUsers) return [];
        return usersData.invitedUsers.map(user => ({
            value: user._id,
            label: `${user.name} (${user.email})`,
        }));
    }, [usersData]);

    const handleSubmit = () => {
        if (!selectedDate || !title) return toast.error("Please provide a title and select a date.");

        if (editingSchedule) {
            // If we are editing, call the update mutation
            updateScheduleMutate({
                id: editingSchedule._id,
                scheduleData: { title, message, scheduledDate: selectedDate }
            });
        } else {
            // Otherwise, call the add mutation
            let scheduledForIds = [];
            if (scheduleType === "me") {
                if (!currentUser?._id) return toast.error("Could not identify current user.");
                scheduledForIds = [currentUser._id];
            } else {
                if (selectedRecipients.length === 0) return toast.error("Please select at least one recipient.");
                scheduledForIds = selectedRecipients.map(option => option.value);
            }
            addScheduleMutate({ title, message, scheduledDate: selectedDate, scheduledForIds });
        }
    };

    const handleEditClick = (schedule) => {
        setEditingSchedule(schedule);
        setTitle(schedule.title);
        setMessage(schedule.message || "");
        setSelectedDate(new Date(schedule.scheduledDate));
        setScheduleType("me");
        setSelectedRecipients([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scheduleColumns = [
        { name: "Title", selector: (row) => row.title, sortable: true, width: "200px" },
        { name: "Scheduled For", selector: (row) => row.scheduledFor?.name || 'N/A', sortable: true, width: "200px" },
        { name: "Scheduled By", selector: (row) => row.createdBy?.name || 'N/A', sortable: true, width: "200px" },
        // Display the date in the user's local format
        { name: "Date & Time", selector: (row) => new Date(row.scheduledDate).toLocaleString(), sortable: true, width: "180px" },
        { name: "Status", cell: (row) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "done" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>{row.status.toUpperCase()}</span> },
        { name: "Message", selector: (row) => row.message || "-", wrap: true, width: "200px" },
        {
            name: "Actions",
            cell: (row) => {
                if (currentUser._id !== row.createdBy?._id) return <p className="w-[120px] p-regular text-gray-700">Not Allowed</p>;
                const isCurrentlyDeleting = isDeleting && deletingId === row._id;
                return (
                    <div className="flex items-center gap-2 w-[120px]">
                        <button
                            onClick={() => {
                                setScheduleToDelete(row._id);
                                setIsDeleteModalOpen(true);
                            }}
                            disabled={isCurrentlyDeleting}
                            className={`p-2 text-red-500 hover:text-red-600 cursor-pointer transition-all duration-300 bg-red-100 rounded-full`}>
                            <Trash2 size={18} />
                        </button>
                        <button
                            onClick={() => handleEditClick(row)}
                            className={`p-2 text-blue-500 hover:text-blue-600 bg-blue-100 cursor-pointer transition-all duration-300 rounded-full`}>
                            <SquarePen size={18} />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#eff7ff] to-[#F3E8FF] w-full">
            {/* Form Section */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between w-full">
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="text-[#6667DD]" size={22} />
                        <h2 className="text-lg sm:text-xl md:text-2xl p-semibold text-[#6667DD]">{editingSchedule ? "Update Scheduled Payment" : "Schedule New Payment"}</h2>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base p-regular mb-4 leading-relaxed">{editingSchedule ? `You are now editing the schedule for "${editingSchedule.title}".` : "Schedule a payment reminder for yourself or for users you've invited."}</p>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-3 p-2 sm:p-3 border-2 border-[#6667DD] outline-none rounded-xl p-regular text-sm sm:text-base" />
                    <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mb-4 p-2 sm:p-3 border-2 border-[#6667DD] outline-none p-regular rounded-xl resize-none text-sm sm:text-base" rows={3} />
                    {scheduleType === "recipients" && !editingSchedule && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm p-medium mb-1">Select Recipients</label>
                            <Select
                                isMulti
                                options={recipientOptions}
                                value={selectedRecipients}
                                onChange={setSelectedRecipients}
                                isLoading={isLoadingUsers}
                                placeholder="Select one or more users..."
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderColor: '#6667DD',
                                        borderWidth: 2,
                                        borderRadius: '0.75rem',
                                        padding: '2px',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        boxShadow: 'none', // remove focus shadow
                                        '&:hover': {
                                            borderColor: '#6667DD', // same as normal
                                        },
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: '#E9D4FF',
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 50,
                                    }),
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className="flex-1 w-full max-w-md">
                    <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={5} dateFormat="MMMM d, yyyy h:mm aa" inline className="rounded-2xl border border-gray-200 shadow-lg p-4 bg-white" />
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-4 py-2 flex-wrap">
                <button
                    onClick={handleSubmit}
                    disabled={isAdding || isUpdating || !title || !selectedDate}
                    className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5 rounded-full p-regular shadow-md transition-all duration-300 cursor-pointer w-full sm:w-auto text-sm sm:text-base ${isAdding || isUpdating || !title || !selectedDate
                            ? "bg-[#9ba0e0] hover:cursor-not-allowed"
                            : "bg-gradient-to-r from-[#6667DD] to-[#7C81F8] hover:scale-97"
                        } text-white`}
                >
                    <Clock size={20} />{" "}
                    {isAdding ? "Scheduling..." : isUpdating ? "Updating..." : editingSchedule ? "Update Schedule" : "Schedule Payment"}
                </button>
                {editingSchedule && (
                    <button onClick={resetForm} className={`flex items-center gap-2 py-2.5 sm:py-3 px-5 rounded-full shadow-md bg-gray-500 hover:scale-97 transition-all duration-300 text-white cursor-pointer`}>
                        <Ban size={20} /> Cancel Edit
                    </button>
                )}
                {!editingSchedule && (
                    <>
                        <button onClick={() => setScheduleType("me")} className={`flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5 rounded-full p-regular shadow-md transition-all duration-300 cursor-pointer w-full sm:w-auto text-sm sm:text-base text-green-700 ${scheduleType === 'me' ? 'bg-green-300 ring-2 ring-green-500' : 'bg-green-200 hover:bg-green-300'}`}>
                            <UserRoundCheck size={20} /> <p>For Me</p>
                        </button>
                        <button onClick={() => setScheduleType("recipients")} className={`flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5 rounded-full p-regular shadow-md transition-all duration-300 cursor-pointer w-full sm:w-auto text-sm sm:text-base text-orange-700 ${scheduleType === 'recipients' ? 'bg-orange-300 ring-2 ring-orange-500' : 'bg-orange-200 hover:bg-orange-300'}`}>
                            <UserPlus2Icon size={20} /> <p>For Recipients</p>
                        </button>
                    </>
                )}
            </div>

            {/* DataTable */}
            <div className="mt-6">
                {loadingSchedules ? (
                    <div className="mt-6 animate-pulse">
                        <div className="h-10 bg-gray-200 rounded mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded mb-2"></div>
                    </div>
                ) : schedules.length === 0 ? (
                    <p className="text-gray-500 text-center p-regular mt-4 text-sm sm:text-base">
                        No payments scheduled.
                    </p>
                ) : (
                    <>
                        <h1 className="text-lg sm:text-xl md:text-2xl p-semibold text-[#6667DD] pb-4">Scheduled Payments</h1>
                        <DataTable
                            // title="Scheduled Payments"
                            columns={scheduleColumns}
                            data={schedules}
                            pagination
                            highlightOnHover
                            responsive
                            striped
                            customStyles={{
                                headCells: {
                                    style: {
                                        backgroundColor: "#E9D4FF",
                                        color: "#6667DD",
                                        fontWeight: "semibold",
                                        fontSize: "14px",
                                        textTransform: "uppercase",
                                    },
                                },
                            }}
                        />
                    </>
                )}
            </div>

            {/* Delete Modals */}
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