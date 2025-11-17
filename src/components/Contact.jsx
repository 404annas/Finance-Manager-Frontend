import { Mail, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "../hooks/contact";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const handleApiError = (error, customMessage = "An unexpected error occurred.") => {
    if (error.response) {
        toast.error(error.response.data.message || customMessage);
    } else {
        toast.error("A network error occurred. Please check your connection.");
    }
};

const Contact = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: sendContactMessage,
        onSuccess: (data) => {
            toast.success(data.message || "Your message has been sent!");
        },
        onError: (error) => handleApiError(error, "Failed to send message. Please try again."),
    });

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required!"),
        email: Yup.string().email("Invalid email!").required("Email is required!"),
        type: Yup.string().required("Please select message type!"),
        message: Yup.string().required("Message cannot be empty!"),
    });

    return (
        <div className="flex justify-center items-start sm:items-center sm:px-4 md:px-6 lg:px-8">
            <div className="bg-[#F6F9FC] shadow-sm p-4 sm:py-6 sm:px-8 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl">
                <h2 className="text-xl sm:text-2xl lg:text-3xl p-semibold text-[#6667DD] mb-2 text-center">
                    Contact Us
                </h2>
                <p className="text-gray-600 text-center mb-6 text-sm sm:text-base p-regular">
                    Reach out for support or share your suggestions/recommendations!
                </p>

                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        type: "",
                        message: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        mutate(values, {
                            onSuccess: () => resetForm(),
                        });
                    }}
                >
                    {({ values, errors, touched }) => {
                        const isAnyFieldFilled =
                            values.name.trim() !== "" ||
                            values.email.trim() !== "" ||
                            values.type.trim() !== "" ||
                            values.message.trim() !== "";

                        return (
                            <Form className="space-y-3 sm:space-y-4">
                                {/* Name & Email Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex flex-col">
                                        <div
                                            className={`flex items-center border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 ${errors.name && touched.name
                                                ? "border-red-500"
                                                : "border-[#6667DD]"
                                                } ${isPending
                                                    ? "bg-gray-100 text-gray-500 cursor-default"
                                                    : "bg-transparent"
                                                }`}
                                        >
                                            <User className="text-gray-500 mr-2" size={18} />
                                            <Field
                                                type="text"
                                                name="name"
                                                placeholder="Your Name"
                                                disabled={isPending}
                                                className="w-full outline-none bg-transparent p-regular text-sm sm:text-base"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="text-red-500 text-sm mt-1 p-regular"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <div
                                            className={`flex items-center border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 ${errors.email && touched.email
                                                ? "border-red-500"
                                                : "border-[#6667DD]"
                                                } ${isPending
                                                    ? "bg-gray-100 text-gray-500 cursor-default"
                                                    : "bg-transparent"
                                                }`}
                                        >
                                            <Mail className="text-gray-500 mr-2" size={18} />
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="Your Email"
                                                disabled={isPending}
                                                className="w-full outline-none bg-transparent p-regular text-sm sm:text-base"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 text-sm mt-1 p-regular"
                                        />
                                    </div>
                                </div>

                                {/* Dropdown */}
                                <div className="flex flex-col">
                                    <label className="block text-gray-700 text-sm mb-1 p-regular">
                                        Type of Message
                                    </label>
                                    <Field
                                        as="select"
                                        name="type"
                                        disabled={isPending}
                                        className={`w-full border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 outline-none cursor-pointer text-sm sm:text-base ${errors.type && touched.type
                                            ? "border-red-500"
                                            : "border-[#6667DD]"
                                            } ${isPending
                                                ? "bg-gray-100 text-gray-500 cursor-default"
                                                : "bg-transparent"
                                            }`}
                                    >
                                        <option value="">Select Query</option>
                                        <option value="support">Support</option>
                                        <option value="recommendation">Recommendation</option>
                                        <option value="bug">Report a Bug</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="general">General Inquiry</option>
                                    </Field>
                                    <ErrorMessage
                                        name="type"
                                        component="div"
                                        className="text-red-500 text-sm mt-1 p-regular"
                                    />
                                </div>

                                {/* Message Box */}
                                <div className="flex flex-col">
                                    <div
                                        className={`flex items-start border-2 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 ${errors.message && touched.message
                                            ? "border-red-500"
                                            : "border-[#6667DD]"
                                            } ${isPending
                                                ? "bg-gray-100 text-gray-500 cursor-default"
                                                : "bg-transparent"
                                            }`}
                                    >
                                        <MessageSquare className="text-gray-500 mt-1 mr-2" size={18} />
                                        <Field
                                            as="textarea"
                                            name="message"
                                            placeholder="Your message..."
                                            rows="4"
                                            disabled={isPending}
                                            className="w-full outline-none bg-transparent resize-none p-regular text-sm sm:text-base"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="message"
                                        component="div"
                                        className="text-red-500 text-sm mt-1 p-regular"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!isAnyFieldFilled || isPending}
                                    className={`w-full text-white py-3 sm:py-3.5 rounded-lg shadow-md transition-all duration-300 p-regular text-sm sm:text-base 
    ${!isAnyFieldFilled || isPending
                                            ? "bg-[#9BA0E0] cursor-not-allowed opacity-70"
                                            : "bg-gradient-to-r from-[#6667DD] to-[#7C81F8] hover:scale-98 hover:opacity-90 cursor-pointer"
                                        }`}
                                >
                                    {isPending ? "Sending..." : "Send Message"}
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default Contact;
