import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../../context/AppContext';

const Login = () => {
    const { user, setUser } = useAppContext();
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error("Invalid Credentials");
            } else {
                toast.success("Login Successful");
                if (data?.user?.role === "admin") navigate("/admin-dashboard");
                else navigate("/");
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                setFormData({ email: "", password: "" });
            }
        } catch (error) {
            toast.error(error.message || "Invalid Credentials!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
            {/* Floating Gradient Circles */}
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-[#6667DD] to-[#FFCE56] opacity-30 animate-bounce-slow"></div>
            <div className="absolute top-1/4 right-20 w-28 h-28 rounded-full bg-gradient-to-r from-[#FFCE56] to-[#36A2EB] opacity-25 animate-bounce-medium"></div>
            <div className="absolute bottom-32 left-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#6667DD] opacity-20 animate-bounce-fast"></div>
            <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-[#FF6384] to-[#6667DD] opacity-15 animate-bounce-slower"></div>
            <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#FFCE56] opacity-20 animate-bounce-fast"></div>
            <div className="absolute bottom-1/4 right-1/3 w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6384] to-[#36A2EB] opacity-15 animate-bounce-medium"></div>
            <div className="absolute top-3/4 left-1/5 w-24 h-24 rounded-full bg-gradient-to-r from-[#6667DD] to-[#FF6384] opacity-25 animate-bounce-slower"></div>
            <div className="absolute bottom-10 left-1/6 w-28 h-28 rounded-full bg-gradient-to-r from-[#FFCE56] to-[#36A2EB] opacity-20 animate-bounce-slow"></div>
            <div className="absolute top-1/6 right-1/5 w-20 h-20 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#FFCE56] opacity-15 animate-bounce-medium"></div>
            <div className="absolute top-2/5 right-3/4 w-30 h-30 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#FFCE56] opacity-15 animate-bounce-medium"></div>
            <div className="absolute top-1/6 right-1/5 w-20 h-20 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#FFCE56] opacity-15 animate-bounce-medium"></div>

            {/* Login Box */}
            <div className="w-full max-w-lg bg-[#F6F9FC] p-8 rounded-xl shadow-md relative z-10">

                <h1 className="text-[#6667DD] text-3xl p-bold mb-6 text-center">Login into Finance</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-700 p-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-3 py-2 border border-[#6667DD] rounded-lg outline-none p-regular"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 p-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-3 py-2 border border-[#6667DD] rounded-lg outline-none p-regular"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#6667DD] text-white py-3 rounded-lg hover:bg-[#5556cc] transition duration-300 p-medium mt-2 cursor-pointer"
                    >
                        {loading ? "Logging..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4 p-regular">
                    Account not exists?{' '}
                    <Link to="/register" className="text-[#6667DD] p-medium hover:underline">
                        Register Now
                    </Link>
                </p>
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

export default Login;
