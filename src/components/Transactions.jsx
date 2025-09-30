import React, { useState, useEffect } from "react";
import { Plus, X, Upload, Trash2 } from "lucide-react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { toast } from "sonner";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  PKR: "₨",
  INR: "₹",
};

const categoryColors = {
  Food: "bg-red-200",
  Rent: "bg-yellow-200",
  Shopping: "bg-blue-200",
  Salary: "bg-green-200",
  Other: "bg-gray-200",
};

const categoryButtonColors = {
  Food: "bg-red-500 text-white",
  Rent: "bg-yellow-500 text-white",
  Shopping: "bg-blue-500 text-white",
  Salary: "bg-green-500 text-white",
  Other: "bg-gray-500 text-white",
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    currency: "USD",
    type: "income",
    image: null,
  });
  const [selectedCategory, setSelectedCategory] = useState("All");

  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    try {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("amount", formData.amount);
      body.append("category", formData.category);
      body.append("currency", formData.currency);
      body.append("type", formData.type);
      if (formData.image) body.append("image", formData.image);

      const { data } = await axios.post("/api/transactions", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTransactions([data, ...transactions]);
      setIsModalOpen(false);
      setFormData({
        title: "",
        amount: "",
        category: "",
        currency: "USD",
        type: "income",
        image: null,
      });
      toast.success("Transaction added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((t) => t._id !== id));
      toast.success("Transaction deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete transaction");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions([]);
      toast.success("All transactions deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete all transactions");
    }
  };

  const filteredTransactions =
    selectedCategory === "All"
      ? transactions
      : transactions.filter((t) => t.category === selectedCategory);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => <span className="p-regular text-gray-800">{row.title}</span>,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      cell: (row) => (
        <span
          className={`p-regular px-2 py-1 rounded ${categoryColors[row.category] || "bg-gray-200"
            }`}
        >
          {row.category || "Other"}
        </span>
      ),
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      cell: (row) => (
        <span
          className={`p-regular ${row.type === "income" ? "text-green-500" : "text-red-500"}`}
        >
          {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
        </span>
      ),
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      cell: (row) => (
        <span className="p-regular text-gray-900">
          {row.type === "income" ? "+" : "-"} {currencySymbols[row.currency]} {row.amount} ({row.currency})
        </span>
      ),
    },
    {
      name: "Image",
      selector: (row) => row.imageUrl,
      cell: (row) =>
        row.imageUrl ? (
          <img loading="lazy" src={row.imageUrl} alt="txn" className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <span className="p-regular text-gray-500">No Image</span>
        ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-300"
        >
          <Trash2 size={18} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "500",
        fontFamily: "Poppins",
        color: "#5759C7",
        textTransform: "uppercase",
      },
    },
  };

  const categories = ["All", "Food", "Rent", "Shopping", "Salary", "Other"];

  return (
    <div className="bg-[#F6F9FC] p-6 relative max-w-7xl mx-auto min-h-[70vh] p-regular">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl p-semibold text-[#6667DD]">My Transactions</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#6667DD] hover:bg-[#5557c4] text-white px-4 py-3 rounded-full shadow transition-all duration-300 cursor-pointer hover:scale-95 p-regular"
        >
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full p-regular cursor-pointer transition-all duration-300 ${selectedCategory === cat
                ? categoryButtonColors[cat] || "bg-[#6667DD] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Delete All Button */}
      {transactions.length > 0 && (
        <div className="mb-4 text-right">
          <button
            onClick={handleDeleteAll}
            className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-1 rounded transition-all duration-300 p-regular"
          >
            Delete All
          </button>
        </div>
      )}

      {/* Data Table */}
      {transactions.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredTransactions}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
        />
      ) : (
        <p className="text-gray-500 text-center mt-20 text-lg p-regular">
          No Current Transactions
        </p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative animate-scaleUp border-2 border-[#6667DD]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer transition-all duration-300"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl p-semibold text-gray-800 mb-6">Add New Transaction</h2>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Transaction Title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD] p-regular"
                />
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD] p-regular cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Rent">Rent</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Salary">Salary</option>
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
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 outline-none border-2 border-[#6667DD]"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income" })}
                  className={`flex-1 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer p-regular ${formData.type === "income"
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense" })}
                  className={`flex-1 py-2 rounded-lg border-2 transition-all duration-300 cursor-pointer p-regular ${formData.type === "expense"
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                  Expense
                </button>
              </div>

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
                className="w-full bg-[#6667DD] hover:bg-[#5253b8] text-white py-3 rounded-lg shadow transition-all duration-300 cursor-pointer p-regular"
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
