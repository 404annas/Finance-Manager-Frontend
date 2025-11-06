import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { sendReminder } from "../hooks/reminder";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PencilLine, Mail, CircleDollarSign, Wallet, MessagesSquare } from 'lucide-react';
import { fetchUsers } from "../hooks/getUsers";

const Reminder = () => {
    const { data: usersData, isPending: isLoadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
        // Optional: Cache this data so it doesn't refetch every time
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { mutate, isPending } = useMutation({
        mutationFn: sendReminder,
        onSuccess: (data) => {
            toast.success(data.message || "Reminder sent successfully!");
        },
        onError: (err) => {
            const errorMessage = err.response?.data?.message || "Error occurred while sending the reminder.";
            toast.error(errorMessage);
        }
    });

    const validationSchema = Yup.object({
        subject: Yup.string().required("Subject is required!"),
        email: Yup.string().required("Please select a recipient!"),
        amount: Yup.number().typeError("Amount must be a number").required("Amount is required!").positive("Amount must be positive!"),
        currency: Yup.string().required("Currency is required!"),
        message: Yup.string().required("Message cannot be empty!"),
    });

    return (
        <div className="bg-[#F6F9FC] p-4 sm:p-6 md:p-8 h-fit shadow-sm max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl mx-auto">
            {/* Heading */}
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl p-semibold text-[#6667DD] mb-6 text-center">
                Send Payment Reminder
            </h2>

            <Formik initialValues={{ subject: "", email: "", amount: "", currency: "", message: "" }} validationSchema={validationSchema} onSubmit={(values, { resetForm }) => {
                mutate(values, { onSuccess: () => resetForm() });
            }}>
                {({ errors, touched, handleChange, handleBlur, values }) => (
                    <Form className="space-y-3 sm:space-y-4">
                        {/* Subject + Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <div className={`flex items-center border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 
                  transition-colors duration-200
                  ${isPending ? 'bg-[#ECECFB] border-[#b6b6e0]'
                                        : errors.subject && touched.subject
                                            ? 'border-red-500'
                                            : 'border-[#6667DD]'}`}>
                                    <PencilLine size={20} className="text-gray-500 mr-2" />
                                    <Field
                                        type="text"
                                        name="subject"
                                        placeholder="Reminder Title"
                                        disabled={isPending}
                                        className="w-full text-sm sm:text-base outline-none bg-transparent"
                                    />
                                </div>
                                <ErrorMessage name="subject" component="div" className="text-red-500 text-sm mt-1 p-regular" />
                            </div>
                            <div className="flex flex-col">
                                <div
                                    className={`flex items-center border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 
      transition-colors duration-200
      ${isPending
                                            ? "bg-[#ECECFB] border-[#b6b6e0]"
                                            : errors.email && touched.email
                                                ? "border-red-500"
                                                : "border-[#6667DD]"
                                        }`}
                                >
                                    <Mail size={20} className="text-gray-500 mr-2" />
                                    <select
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isPending || isLoadingUsers} // Disable while loading users
                                        className="w-full text-sm sm:text-base bg-transparent outline-none cursor-pointer"
                                    >
                                        <option value="">
                                            {isLoadingUsers ? "Loading recipients..." : "Select a Recipient"}
                                        </option>
                                        {usersData?.invitedUsers?.map((user) => (
                                            <option key={user._id} value={user.email}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1 p-regular" />
                            </div>
                        </div>

                        {/* Amount + Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col">
                                <div
                                    className={`flex items-center border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 
      transition-colors duration-200
      ${isPending
                                            ? "bg-[#ECECFB] border-[#b6b6e0]"
                                            : errors.currency && touched.currency
                                                ? "border-red-500"
                                                : "border-[#6667DD]"
                                        }`}
                                >
                                    <CircleDollarSign size={20} className="text-gray-500 mr-2" />
                                    <select
                                        name="currency"
                                        value={values.currency}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isPending}
                                        className="w-full text-sm sm:text-base bg-transparent outline-none cursor-pointer"
                                    >
                                        <option value="">Select Currency</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="PKR">PKR (₨)</option>
                                        <option value="INR">INR (₹)</option>
                                    </select>
                                </div>
                                <ErrorMessage
                                    name="currency"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div
                                    className={`flex items-center border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 
      transition-colors duration-200
      ${isPending
                                            ? "bg-[#ECECFB] border-[#b6b6e0]"
                                            : errors.amount && touched.amount
                                                ? "border-red-500"
                                                : "border-[#6667DD]"
                                        }`}
                                >
                                    <Wallet size={20} className="text-gray-500 mr-2" />
                                    <Field
                                        type="number"
                                        name="amount"
                                        placeholder="Amount"
                                        disabled={isPending}
                                        className="w-full text-sm sm:text-base outline-none bg-transparent"
                                    />
                                </div>
                                <ErrorMessage name="amount" component="div" className="text-red-500 text-sm mt-1 p-regular" />
                            </div>
                        </div>

                        {/* Message Box */}
                        <div className="flex flex-col">
                            <div
                                className={`flex items-start border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 
      transition-colors duration-200
      ${isPending
                                        ? "bg-[#ECECFB] border-[#b6b6e0]"
                                        : errors.message && touched.message
                                            ? "border-red-500"
                                            : "border-[#6667DD]"
                                    }`}
                            >
                                <MessagesSquare size={20} className="text-gray-500 mr-2 mt-0.5" />
                                <Field
                                    as="textarea"
                                    name="message"
                                    placeholder="Write a message..."
                                    rows={4}
                                    disabled={isPending}
                                    className="w-full text-sm sm:text-base outline-none bg-transparent resize-none"
                                />
                            </div>
                            <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1 p-regular" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`w-full ${isPending ? "bg-gray-400 hover:cursor-not-allowed" : "bg-[#6667DD] hover:bg-[#5253b8]"
                                } text-white py-3 sm:py-3.5 rounded-lg shadow transition-all duration-300 cursor-pointer p-regular text-sm sm:text-base`}
                        >
                            {isPending ? "Reminding..." : "Send Reminder"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Reminder;
