import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

// Global flag to remember skeleton loaded
let skeletonShown = false;

const Profile = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!skeletonShown);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (!skeletonShown) {
            const timer = setTimeout(() => {
                setLoading(false);
                skeletonShown = true; // mark skeleton as shown
            }, 800); // skeleton delay
            return () => clearTimeout(timer);
        } else {
            setLoading(false); // skip skeleton if already shown
        }
    }, [user, navigate]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center px-6 py-10 sm:p-10 mt-4 sm:mt-0 shadow-sm bg-[#F6F9FC] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl mx-auto animate-pulse">
                <div className="w-30 h-30 sm:w-40 sm:h-40 rounded-full bg-gray-300 border-2 sm:border-4 border-gray-200 shadow-md"></div>
                <div className="w-40 sm:w-60 h-6 sm:h-8 bg-gray-300 rounded mt-6"></div>
                <div className="w-32 sm:w-48 h-4 sm:h-6 bg-gray-300 rounded mt-2"></div>
                <div className="w-24 sm:w-32 h-6 bg-gray-300 rounded mt-4"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center px-6 py-10 sm:p-10 mt-10 sm:mt-0 shadow-sm bg-[#F6F9FC] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl mx-auto">
            <img
                src={user.profileImage || "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&auto=format&fit=crop&q=60"}
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
