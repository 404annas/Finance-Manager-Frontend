import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../../context/AppContext';

const Register = () => {
    const { setUser } = useAppContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        file: null,
        name: '',
        email: '',
        password: '',
        inviteToken: '',
    });
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setFormData(prevData => ({
                ...prevData,
                inviteToken: tokenFromUrl,
            }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            form.append("file", formData.file);
            form.append("name", formData.name);
            form.append("email", formData.email);
            form.append("password", formData.password);
            if (formData.inviteToken) {
                form.append("token", formData.inviteToken);
            }

            const res = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                body: form,
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Something went wrong!");
            } else {
                toast.success(data.message || "Registered successfully!");
                setUser(data.user);
                setFormData({ file: null, name: "", email: "", password: "", inviteToken: "" });
                if (data.user.role === "admin") {
                    navigate("/admin-dashboard")
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            {/* Floating Gradient Circles */}
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-[#6667DD] to-[#FFCE56] opacity-30 animate-bounce-slow"></div>
            <div className="absolute top-1/4 right-20 w-28 h-28 rounded-full bg-gradient-to-r from-[#FFCE56] to-[#36A2EB] opacity-25 animate-bounce-medium"></div>
            <div className="absolute top-1/4 right-20 w-28 h-28 rounded-full bg-gradient-to-r from-[#FFCE56] to-[#36A2EB] opacity-25 animate-bounce-medium"></div>
            <div className="absolute bottom-32 left-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#6667DD] opacity-20 animate-bounce-fast"></div>
            <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-[#FF6384] to-[#6667DD] opacity-15 animate-bounce-slower"></div>
            <div className="absolute top-1/2 left-30 w-16 h-16 rounded-full bg-gradient-to-r from-[#36A2EB] to-[#FFCE56] opacity-20 animate-bounce-medium"></div>
            <div className="absolute bottom-0 right-3/4 w-20 h-20 rounded-full bg-gradient-to-r from-[#FF6384] to-[#36A2EB] opacity-25 animate-bounce-slow"></div>

            {/* Register Box */}
            <div className="w-full max-w-4xl bg-[#F6F9FC] p-8 rounded-xl shadow-md relative z-10">

                <h1 className="text-[#6667DD] text-3xl p-bold mb-8 text-center">Register into Finance</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-gray-700 p-medium mb-1">
                            Profile Picture <span className="text-[#6667DD]">(Optional)</span>
                        </label>
                        <input
                            type="file"
                            name="file"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#6667DD] rounded-lg outline-none p-regular"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 p-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full px-3 py-2 border border-[#6667DD] rounded-lg outline-none p-regular"
                        />
                    </div>

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

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#6667DD] text-white py-3 rounded-lg hover:bg-[#5556cc] transition duration-300 mt-2 cursor-pointer p-regular"
                        >
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                    </div>

                    <div className="md:col-span-2 text-center mt-2">
                        <p className="text-gray-600 p-regular">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#6667DD] p-medium hover:underline">
                                Login Now
                            </Link>
                        </p>
                    </div>
                </form>
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

export default Register;
