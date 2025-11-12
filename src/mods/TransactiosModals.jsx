import { X, Trash2, Upload } from "lucide-react";

export const AddTransactionModal = ({
    isOpen,
    setIsOpen,
    handleSubmit,
    handleChange,
    formData,
    isAdding,
    isEditing,
}) => {
    if (!isOpen) return null;

    const isFormValid =
        formData.title &&
        formData.category &&
        formData.amount &&
        formData.type &&
        formData.date;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#F6F9FC] rounded-2xl shadow-xl w-full max-w-2xl p-4 sm:p-6 relative animate-scaleUp border-2 border-[#6667DD] max-h-[80vh] sm:max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer transition-all duration-300"
                >
                    <X size={22} />
                </button>
                <h2 className="text-xl p-semibold text-gray-800 mb-6">
                    {isEditing ? "Edit Transaction" : "Add New Transaction"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            type="text"
                            name="title"
                            placeholder="Transaction Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD] p-regular"
                        />
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD] p-regular cursor-pointer"
                        >
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Rent">Rent</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Salary">Salary</option>
                            <option value="Investment">Investment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-regular">
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD] cursor-pointer"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="PKR">PKR (₨)</option>
                            <option value="INR">INR (₹)</option>
                        </select>
                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD]"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => handleChange({ target: { name: "type", value: "income" } })}
                            className={`flex-1 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer p-regular ${formData.type === "income"
                                ? "bg-gradient-to-r from-green-400 to-green-600 text-white border-green-400"
                                : "bg-green-100 text-gray-700 border-green-200"
                                }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChange({ target: { name: "type", value: "expense" } })}
                            className={`flex-1 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer p-regular ${formData.type === "expense"
                                ? "bg-gradient-to-r from-red-400 to-red-600 text-white border-red-500"
                                : "bg-red-100 text-gray-700 border-red-200"
                                }`}
                        >
                            Expense
                        </button>
                    </div>

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD] p-regular"
                    />

                    <textarea
                        name="description"
                        placeholder="Description (optional)"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD] p-regular resize-none"
                        rows={3}
                    ></textarea>

                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#6667DD] rounded-lg cursor-pointer hover:bg-gray-100 transition">
                        <Upload size={24} className="mb-2 text-gray-600" />
                        <span className="text-gray-600 p-regular">
                            {formData.image ? formData.image.name : "Upload Image (optional)"}
                        </span>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleChange}
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isAdding || !isFormValid}
                        className={`w-full py-3 rounded-lg shadow transition-all duration-300 p-regular text-white ${isAdding || !isFormValid
                            ? "bg-[#9BA0E0] hover:cursor-not-allowed"
                            : "bg-gradient-to-r from-[#6667DD] to-[#7C81F8] hover:scale-98 cursor-pointer"
                            }`}
                    >
                        {isAdding ? "Saving..." : (isEditing ? "Save Changes" : "Add Transaction")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const ConfirmDeleteModal = ({
    isOpen,
    setIsOpen,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative animate-scaleUp border border-gray-300">
                <X
                    size={20}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                />
                <div className="p-3 bg-red-200 rounded-full mx-auto w-fit mb-3">
                    <Trash2 size={20} className="text-red-500" />
                </div>
                <h2 className="text-lg p-semibold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-6 p-regular text-sm">{description}</p>
                <div className="flex sm:flex-row flex-col justify-center gap-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 outline-none cursor-pointer text-sm text-gray-700 p-regular"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all outline-none duration-300 cursor-pointer text-sm p-regular"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ImagePreviewModal = ({ image, onClose }) => {
    if (!image) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs"
            onClick={onClose}
        >
            <img
                src={image}
                alt="Full View"
                className="max-w-[90%] max-h-[90%] object-cover rounded-lg shadow-lg bg-white/20"
            />
        </div>
    );
};
