import { useState } from "react";
import { Plus, SquarePen, Trash2, DownloadCloud } from "lucide-react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchTransactions,
  addTransactions,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
} from "../hooks/transactions";
import DownloadTransactionsPDF from "../utils/DownloadTransactionsPDF";
import {
  AddTransactionModal,
  ConfirmDeleteModal,
  ImagePreviewModal,
} from "../mods/TransactiosModals";

const currencySymbols = { USD: "$", EUR: "€", PKR: "₨", INR: "₹" };
const categoryColors = {
  Food: "bg-red-200",
  Rent: "bg-yellow-200",
  Shopping: "bg-blue-200",
  Salary: "bg-green-200",
  Investment: "bg-purple-200",
  Other: "bg-gray-200",
};
const categoryButtonColors = {
  Food: "bg-red-500 text-white",
  Rent: "bg-yellow-500 text-white",
  Shopping: "bg-blue-500 text-white",
  Salary: "bg-green-500 text-white",
  Investment: "bg-purple-500 text-white",
  Other: "bg-gray-500 text-white",
};

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    currency: "USD",
    type: "income",
    date: new Date().toISOString().split("T")[0],
    description: "",
    image: null,
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  const [dateFilter, setDateFilter] = useState("Entire");
  const [customDateRange, setCustomDateRange] = useState({ from: "", to: "" });

  const [isDownloading, setIsDownloading] = useState(false);

  const queryClient = useQueryClient();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  const { mutate: addTransactionMutate, isPending: isAdding } = useMutation({
    mutationFn: addTransactions,
    onSuccess: () => {
      toast.success("Transaction added successfully!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsModalOpen(false);
      setFormData({
        title: "",
        amount: "",
        category: "",
        currency: "USD",
        type: "income",
        date: new Date().toISOString().split("T")[0],
        description: "",
        image: null,
      });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to add transaction"),
  });

  const { mutate: updateTransactionMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      toast.success("Transaction updated successfully.")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      setIsModalOpen(false);
      setEditingTransaction(null);
    },
    onError: () => {
      toast.error(err.response?.data?.message || "Failed to update transaction")
    }
  })

  const { mutate: deleteTransactionMutate } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success("Transaction deleted.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete transaction"),
  });

  const { mutate: deleteAllMutate } = useMutation({
    mutationFn: deleteAllTransactions,
    onSuccess: () => {
      toast.success("All transactions have been deleted.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete all transactions"),
  });

  const handleChange = (e) => {
    if (e.target.name === "image")
      setFormData({ ...formData, image: e.target.files[0] });
    else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. CREATE a handler for opening the modal in "add" mode
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setFormData({ title: "", amount: "", category: "", currency: "USD", type: "income", date: new Date().toISOString().split("T")[0], description: "", image: null });
    setIsModalOpen(true);
  };

  // 5. CREATE a handler for opening the modal in "edit" mode
  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      ...transaction,
      date: new Date(transaction.date).toISOString().split("T")[0], // Format date correctly
      image: null, // Reset image field
    });
    setIsModalOpen(true);
  };

  // 6. RENAME and UPDATE the form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) return toast.error("Please fill in all required fields.");

    const body = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) body.append(key, formData[key]);
    });

    if (editingTransaction) {
      // If editing, call the update mutation
      updateTransactionMutate({ id: editingTransaction._id, formData: body });
    } else {
      // If adding, call the add mutation
      addTransactionMutate(body);
    }
  };

  const filterByDate = (txn) => {
    const txnDate = new Date(txn.date);
    const today = new Date();
    let start, end;

    switch (dateFilter) {
      case "Today":
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "Last Week":
        start = new Date();
        start.setDate(today.getDate() - 7);
        end = new Date();
        break;
      case "This Month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last Month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Last 3 Months":
        start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "This Year":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case "Custom":
        if (customDateRange.from && customDateRange.to) {
          start = new Date(customDateRange.from);
          end = new Date(customDateRange.to);
        } else return true;
        break;
      default:
        return true;
    }
    return txnDate >= start && txnDate <= end;
  };

  const filteredTransactions = transactions
    .filter((t) => selectedCategory === "All" || t.category === selectedCategory)
    .filter(filterByDate);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      try {
        DownloadTransactionsPDF(
          filteredTransactions,
          selectedCategory,
          dateFilter,
          customDateRange
        );
        toast.success("Transactions downloaded successfully!");
      } catch {
        toast.error("Failed to download transactions!");
      } finally {
        setIsDownloading(false);
      }
    }, 0);
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => <span className="p-regular text-gray-800">{row.title}</span>,
      width: "200px",
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
      width: "130px",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      cell: (row) => (
        <span
          className={`p-regular ${row.type === "income" ? "text-green-500" : "text-red-500"
            }`}
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
        <span
          className={`p-regular ${row.type === "income" ? "text-green-500" : "text-red-500"
            }`}
        >
          {row.type === "income" ? "+" : "-"} {currencySymbols[row.currency]}{" "}
          {row.amount} ({row.currency})
        </span>
      ),
      width: "180px",
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      cell: (row) => (
        <span className="p-regular text-gray-700">
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
      width: "110px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      cell: (row) => (
        <span className="p-regular text-gray-700 line-clamp-2">
          {row.description || "-"}
        </span>
      ),
      width: "200px",
    },
    {
      name: "Image",
      selector: (row) => row.imageUrl,
      cell: (row) =>
        row.imageUrl ? (
          <img
            loading="lazy"
            src={row.imageUrl}
            alt="txn"
            onClick={() => setSelectedImage(row.imageUrl)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover cursor-pointer"
          />
        ) : (
          <span className="p-regular text-gray-500">No Image</span>
        ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2 w-[100px] sm:w-[120px]">
          <button
            onClick={() => {
              setTransactionToDelete(row._id);
              setIsDeleteModalOpen(true);
            }}
            className="bg-red-100 hover:bg-red-200 p-2 cursor-pointer rounded-full transition-all duration-300"
          >
            <Trash2 size={16} className="sm:size-[18px] text-red-500" />
          </button>
          <button
            onClick={() => handleOpenEditModal(row)}
            className="bg-blue-100 hover:bg-blue-200 p-2 cursor-pointer rounded-full transition-all duration-300">
            <SquarePen size={16} className="sm:size-[18px] text-blue-500" />
          </button>
        </div>
      ),
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

  const categories = ["All", "Food", "Rent", "Shopping", "Salary", "Investment", "Other"];

  const totalIncome = filteredTransactions
    .filter((txn) => txn.type === "income")
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const totalExpense = filteredTransactions
    .filter((txn) => txn.type === "expense")
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  return (
    <div className="bg-[#F7F9FC] p-3 sm:p-6 relative max-w-7xl mx-auto min-h-[80vh] w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl p-semibold text-[#6667DD]">
          My Transactions
        </h2>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6667DD] to-[#7C81F8] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md cursor-pointer hover:scale-[0.98] transition-all duration-300"
        >
          <Plus size={16} className="sm:size-[18px]" /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-transparent p-3 sm:p-4 rounded-xl shadow-sm mb-5 flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-3">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full lg:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm cursor-pointer transition-all duration-300 ${selectedCategory === cat
                ? categoryButtonColors[cat] || "bg-[#6667DD] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full lg:w-auto">
          {[
            "Entire",
            "Today",
            "Last Week",
            "This Month",
            "Last Month",
            "Last 3 Months",
            "This Year",
            "Custom",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm cursor-pointer transition-all duration-200 ${dateFilter === filter
                ? "bg-[#6667DD] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Filter */}
      {dateFilter === "Custom" && (
        <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
          <input
            type="date"
            value={customDateRange.from}
            onChange={(e) =>
              setCustomDateRange({ ...customDateRange, from: e.target.value })
            }
            className="rounded-lg border border-[#6667DD] px-3 py-1 text-sm outline-none w-full sm:w-auto"
          />
          <span className="p-regular text-sm">to</span>
          <input
            type="date"
            value={customDateRange.to}
            onChange={(e) =>
              setCustomDateRange({ ...customDateRange, to: e.target.value })
            }
            className="rounded-lg border border-[#6667DD] px-3 py-1 text-sm outline-none w-full sm:w-auto"
          />
        </div>
      )}

      {/* Stats & Download */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto justify-center sm:justify-start">
          <div className="bg-[#D4F5E9] text-gray-700 px-4 py-1.5 rounded-lg text-sm p-medium">
            💰 Income: {currencySymbols["USD"]}
            {totalIncome}
          </div>
          <div className="bg-[#FFDADA] text-gray-700 px-4 py-1.5 rounded-lg text-sm p-medium">
            💸 Expense: {currencySymbols["USD"]}
            {totalExpense}
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2 cursor-pointer rounded-lg text-sm p-medium transition-all duration-300 w-full sm:w-auto ${isDownloading
            ? "bg-gray-300 hover:cursor-not-allowed"
            : "bg-[#E0E2FD] hover:bg-[#C8CBFC] text-[#4447AA]"
            }`}
        >
          <DownloadCloud size={16} className="sm:size-[18px]" />
          {isDownloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto">
        {isLoadingTransactions ? (
          <p className="text-[#6667DD] text-center mt-10 sm:mt-20 text-base sm:text-lg p-regular animate-pulse">
            Loading Transactions...
          </p>
        ) : transactions.length > 0 ? (
          <div className="max-w-full mx-auto">
            <DataTable
              columns={columns}
              data={filteredTransactions}
              pagination
              highlightOnHover
              striped
              fixedHeader
              customStyles={customStyles}
            />
          </div>
        ) : (
          <p className="text-gray-700 text-center mt-10 sm:mt-14 text-base sm:text-lg p-regular bg-[#F3E8FF] py-4">
            No Current Transactions
          </p>
        )}
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        isAdding={isAdding || isUpdating}
        isEditing={!!editingTransaction}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onConfirm={() => {
          deleteTransactionMutate(transactionToDelete);
          setIsDeleteModalOpen(false);
        }}
        title="Are you sure?"
        description="Do you really want to delete this transaction? This action cannot be undone."
      />

      <ConfirmDeleteModal
        isOpen={isDeleteAllModalOpen}
        setIsOpen={setIsDeleteAllModalOpen}
        onConfirm={() => {
          deleteAllMutate();
          setIsDeleteAllModalOpen(false);
        }}
        title="Are you sure?"
        description="Do you really want to delete all transactions? This action cannot be undone."
      />

      <ImagePreviewModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default Transactions;
