import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';

// Modern styling for the modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        borderRadius: '12px',
        padding: '2rem',
        width: '90%',
        maxWidth: '600px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        background: '#F6F9FC',
    },
    overlay: {
        backgroundColor: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
    },
};

// Bind modal to your app's root element for accessibility
Modal.setAppElement('#root');

const UpdateProfileModal = ({ isOpen, onRequestClose, user, onUpdate, isUpdating }) => {
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setPreviewImage(user.profileImage);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }
        onUpdate(formData);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Update Profile Modal"
            closeTimeoutMS={300}
        >
            <div className="relative">
                <button
                    onClick={onRequestClose}
                    className="absolute -top-4 -right-4 text-gray-500 hover:text-gray-700 transition-all duration-300 bg-gray-200 rounded-full p-2 cursor-pointer"
                >
                    <X size={20} />
                </button>
                <h2 className="text-2xl p-bold text-[#6667DD] mb-6 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col items-center">
                        <label htmlFor="profile-upload" className="cursor-pointer group relative">
                            <img
                                src={previewImage || "https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&auto=format&fit=crop&q=60"}
                                alt="Profile Preview"
                                className="w-28 h-28 rounded-full object-cover border-4 border-[#6667DD] shadow-md transition-all duration-300 group-hover:opacity-60"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm p-semibold">Change</span>
                            </div>
                        </label>
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isUpdating}
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm p-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isUpdating}
                            className="w-full px-4 py-2 bg-transaprent border border-gray-300 rounded-lg shadow-sm outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm p-medium text-gray-700 mb-1">Email</label>
                        <p id="email" className="w-full px-4 py-2 bg-gray-200 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        type="submit" disabled={isUpdating}
                        className="w-full bg-[#6667DD] text-white py-3 px-4 rounded-lg p-semibold hover:bg-[#6667DD]transition-all duration-300 hover:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default UpdateProfileModal;