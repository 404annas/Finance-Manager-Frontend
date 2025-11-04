import { LogOut, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import NotificationBell from './NotificationBell';

const HeroNav = ({ role }) => {
    const navigate = useNavigate();
    const { user, setUser } = useAppContext();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <section className="w-full flex flex-col sm:flex-row items-end sm:items-center sm:justify-between px-2 sm:px-6 md:px-10 py-4 mb-2">
            <div className="flex-1 flex items-center gap-2 sm:gap-4 mb-4 sm:mb-0 bg-gray-100 px-3 sm:px-4 py-2.5 rounded-xl min-w-0 mr-0 sm:mr-4">
                <h1 className='text-gray-800 p-bold truncate'>
                    <span className='text-[#6667DD]'>Hey,</span> {user?.name || "John Doe"}
                </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <Link to={"/contact"}>
                    <button className='p-regular bg-[#F6F9FC] hover:bg-blue-50 transition-all duration-300 py-2.5 px-4 rounded-xl cursor-pointer text-[#6667DD]'>Contact Us</button>
                </Link>

                <NotificationBell />

                {user && (
                    <button onClick={handleLogout} className="bg-gray-100 p-2.5 sm:p-3 rounded-xl hover:bg-gray-200 transition duration-300 cursor-pointer flex-shrink-0">
                        <LogOut size={20} className="text-gray-600" />
                    </button>
                )}

                {user ? (
                    <div className="relative group flex-shrink-0">
                        <img
                            loading="lazy"
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-gray-200 cursor-pointer"
                            src={user.profileImage || "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFufGVufDB8fDB8fHww"}
                            alt={"User"}
                        />

                        <Link to={role === "admin" ? "/admin-dashboard/profile" : "/profile"}
                            className="absolute left-1/2 -translate-x-1/2 mt-0 hidden group-hover:flex
                        px-3 py-1.5 bg-[#F6F9FC] border border-blue-50 shadow-md rounded-lg
                        text-sm text-[#5556cc] p-medium whitespace-nowrap cursor-pointer z-50"
                        >
                            My Profile
                        </Link>
                    </div>
                ) : ""}

                {!user && role !== "admin" && (
                    <div
                        onClick={() => navigate("/register")}
                        className="flex items-center gap-2 bg-[#5556cc] text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-full cursor-pointer hover:bg-[#4445bb] transition duration-300 p-regular flex-shrink-0"
                    >
                        <UserRound size={16} />
                        <p>Register</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroNav;
