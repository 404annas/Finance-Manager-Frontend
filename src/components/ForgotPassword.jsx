import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Formik, Form, Field } from 'formik';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to send reset email");
            } else {
                toast.success("Password reset link has been sent to your email");
                setEmailSent(true);
            }
        } catch (error) {
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8">
            {/* Floating Gradient Circles */}
            <div className="absolute top-10 left-10 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-r from-[#6667DD] to-[#FFCE56] opacity-30 animate-bounce-slow"></div>
            <div className="absolute top-1/4 right-10 sm:right-20 w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-gradient-to-r from-[#FFCE56] to-[#36A2EB] opacity-25 animate-bounce-medium"></div>
            <div className="absolute bottom-32 left-1/4 sm:left-1/3 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#6667DD] opacity-20 animate-bounce-fast"></div>
            <div className="absolute bottom-10 right-10 sm:right-1/4 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-gradient-to-r from-[#FF6384] to-[#6667DD] opacity-15 animate-bounce-slower"></div>
            <div className="absolute top-1/3 left-16 sm:left-1/4 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#FFCE56] opacity-20 animate-bounce-fast"></div>
            <div className="absolute bottom-1/4 right-1/4 sm:right-1/3 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-r from-[#FF6384] to-[#36A2EB] opacity-15 animate-bounce-medium"></div>
            <div className="absolute top-3/4 left-10 sm:left-1/5 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-r from-[#6667DD] to-[#FF6384] opacity-25 animate-bounce-slower"></div>
            <div className="absolute bottom-10 left-4 sm:left-1/6 w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-r from-[#FFCE56] to-[#36A2EB] opacity-20 animate-bounce-slow"></div>
            <div className="absolute top-1/6 right-4 sm:right-1/5 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#FFCE56] opacity-15 animate-bounce-medium"></div>
            <div className="absolute top-2/5 right-1/2 sm:right-3/4 w-24 sm:w-30 h-24 sm:h-30 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#FFCE56] opacity-15 animate-bounce-medium"></div>

            {/* Forgot Password Box */}
            <div className="w-full max-w-md sm:max-w-lg bg-[#F6F9FC] py-10 px-4 sm:p-8 rounded-xl shadow-md relative z-10">

                <h1 className="text-[#6667DD] text-2xl sm:text-3xl p-bold mb-6 text-center">
                    {emailSent ? "Check Your Email" : "Forgot Password"}
                </h1>

                {emailSent ? (
                    <div className="text-center">
                        <p className="text-gray-700 p-regular mb-6">
                            A password reset link has been sent to your email address. Please check your inbox.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-gradient-to-r from-[#6667DD] to-[#7C81F8] text-white py-2.5 sm:py-3 rounded-lg transition duration-300 p-medium text-sm sm:text-base cursor-pointer hover:scale-98"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-600 text-center p-regular mb-6">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <Formik
                            initialValues={{ email: '' }}
                            validate={values => {
                                const errors = {};
                                if (!values.email) {
                                    errors.email = "Email is required";
                                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                    errors.email = "Invalid email address";
                                }
                                return errors;
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ values, handleChange, errors, touched }) => (
                                <Form className="flex flex-col gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 p-medium mb-1">Email</label>
                                        <Field
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            disabled={loading}
                                            className={`w-full px-3 py-2 rounded-lg outline-none p-regular text-sm sm:text-base
                                                border
                                                ${errors.email && touched.email ? 'border-red-500' : 'border-[#6667DD]'}`}
                                        />
                                        {errors.email && touched.email && (
                                            <div className="text-red-500 text-sm mt-1 transition-opacity duration-300 opacity-100">{errors.email}</div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-gradient-to-r from-[#6667DD] to-[#7C81F8] text-white py-2.5 sm:py-3 rounded-lg transition duration-300 p-medium mt-2 text-sm sm:text-base hover:scale-98
                                        ${loading ? "opacity-70 hover:cursor-not-allowed" : "hover:bg-scale-97 cursor-pointer"}`}
                                    >
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        <div className="flex flex-col items-center mt-4">
                            <p className="text-center text-gray-600 p-regular text-sm sm:text-base">
                                Remember your password?{' '}
                                <Link to="/login" className="text-[#6667DD] p-medium hover:underline">
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Animation Styles */}
            <style>{`
                @keyframes bounce-slow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-20px);} }
                @keyframes bounce-medium { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-30px);} }
                @keyframes bounce-fast { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-40px);} }
                @keyframes bounce-slower { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-15px);} }

                .animate-bounce-slow { animation: bounce-slow 6s infinite ease-in-out; }
                .animate-bounce-medium { animation: bounce-medium 5s infinite ease-in-out; }
                .animate-bounce-fast { animation: bounce-fast 4s infinite ease-in-out; }
                .animate-bounce-slower { animation: bounce-slower 7s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default ForgotPassword;