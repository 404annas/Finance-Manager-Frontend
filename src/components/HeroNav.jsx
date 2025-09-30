import React from 'react';
import { BellDot, LogOut, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const HeroNav = ({ role }) => {
    const navigate = useNavigate();
    const { user, setUser } = useAppContext();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <section className="w-full flex flex-col px-10 py-4 overflow-y-auto">
            <div className="flex items-center justify-between w-full mb-6">
                <div className="flex items-center gap-4 bg-gray-100 px-4 py-2.5 rounded-xl w-[65%]">
                    <h1 className='text-gray-800 p-bold'><span className='text-[#6667DD]'>Welcome,</span> {user?.name || "John Doe"}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="bg-purple-100 p-3 rounded-xl hover:bg-purple-200 transition duration-300 cursor-pointer">
                        <BellDot size={20} className="text-[#6667DD]" />
                    </button>

                    {user && (
                        <button onClick={handleLogout} className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition duration-300 cursor-pointer">
                            <LogOut size={20} className="text-gray-600" />
                        </button>
                    )}

                    {user ? (
                        <div className="relative group">
                            <img
                                loading="lazy"
                                className="w-12 h-12 object-cover rounded-full border-2 border-gray-200 cursor-pointer"
                                src={user.profileImage || "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFufGVufDB8fDB8fHww"}
                                alt={"User"}
                            />

                            <Link to={role === "admin" ? "/admin-dashboard/profile" : "/profile"}
                                className="absolute left-1/2 -translate-x-1/2 mt-0 hidden group-hover:flex
                        px-3 py-1.5 bg-[white] border border-gray-200 shadow-md rounded-lg
                        text-sm text-[#5556cc] p-medium whitespace-nowrap cursor-pointer"
                            >
                                My Profile
                            </Link>
                        </div>
                    ) : ""}
                    {!user && role !== "admin" && (
                        <div
                            onClick={() => navigate("/register")}
                            className="flex items-center gap-2 bg-[#5556cc] text-white px-4 py-3 rounded-full cursor-pointer hover:bg-[#4445bb] transition duration-300 p-regular"
                        >
                            <p><UserRound size={16} /></p>
                            <p>Register</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroNav;
