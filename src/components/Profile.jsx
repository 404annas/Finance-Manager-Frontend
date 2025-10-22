import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="flex flex-col justify-center items-center px-6 py-10 sm:p-10 mt-4 sm:mt-0 shadow-sm bg-[#F6F9FC] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl mx-auto">
            <img
                src={
                    user.profileImage ||
                    "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&auto=format&fit=crop&q=60"
                }
                alt="Profile"
                className="w-30 h-30 sm:w-40 sm:h-40 rounded-full border-2 sm:border-4 border-[#6667DD] object-cover shadow-md"
            />

            <h2 className="text-xl sm:text-3xl p-bold text-gray-800 mt-6">{user.name}</h2>

            <p className="text-base sm:text-lg text-gray-600 mt-2 p-regular">{user.email}</p>

            <span className="p-regular mt-4 px-5 py-2 rounded-full bg-[#6667DD]/10 text-[#6667DD] uppercase tracking-wide text-xs sm:text-sm">
                I'm a User
            </span>
        </div>
    );
};

export default Profile;
