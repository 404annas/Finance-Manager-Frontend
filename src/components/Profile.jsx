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
        <div className="flex flex-col justify-center items-center pt-10">
            <img
                src={
                    user.profileImage ||
                    "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&auto=format&fit=crop&q=60"
                }
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-[#6667DD] object-cover shadow-md"
            />

            <h2 className="text-3xl p-bold text-gray-800 mt-6">{user.name}</h2>

            <p className="text-lg text-gray-600 mt-2 p-regular">{user.email}</p>

            <span className="p-regular mt-4 px-5 py-2 text-sm rounded-full bg-[#6667DD]/10 text-[#6667DD] uppercase tracking-wide">
                {user.role}
            </span>
        </div>
    );
};

export default Profile;
