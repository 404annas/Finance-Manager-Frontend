import { useState, useEffect } from "react";
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

const handleApiError = (error, customMessage = "An unexpected error occurred.") => {
  if (error.response) {
    toast.error(error.response.data.message || customMessage);
  } else {
    toast.error("A network error occurred. Please check your connection.");
  }
};

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
  // Modal and Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    title: "", amount: "", category: "", currency: "USD", type: "income",
    date: new Date().toISOString().split("T")[0], description: "", image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("Entire");
  const [customDateRange, setCustomDateRange] = useState({ from: "", to: "" });

  // Pagination & Sort State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState({ field: 'date', order: 'desc' });

  const [apiDateParams, setApiDateParams] = useState({ dateFrom: null, dateTo: null });

  useEffect(() => {
    const today = new Date();
    let start = null;
    let end = null;

    switch (dateFilter) {
      case "Today":
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(new Date().setHours(23, 59, 59, 999));
        break;
      case "Last Week":
        start = new Date(new Date().setDate(today.getDate() - 7));
        end = new Date();
        break;
      case "This Month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case "Last Month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
        break;
      case "Last 3 Months":
        start = new Date(new Date().setMonth(today.getMonth() - 3));
        end = new Date();
        break;
      case "This Year":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case "Custom":
        start = customDateRange.from ? new Date(customDateRange.from) : null;
        end = customDateRange.to ? new Date(new Date(customDateRange.to).setHours(23, 59, 59, 999)) : null;
        break;
      default: // 'Entire'
        start = null;
        end = null;
    }

    setApiDateParams({
      dateFrom: start ? start.toISOString() : null,
      dateTo: end ? end.toISOString() : null,
    });
  }, [dateFilter, customDateRange]);

  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", page, limit, sortConfig, selectedCategory, apiDateParams],
    queryFn: () => fetchTransactions({
      page,
      limit,
      sort: sortConfig.field,
      order: sortConfig.order,
      category: selectedCategory,
      dateFrom: apiDateParams.dateFrom,
      dateTo: apiDateParams.dateTo,
    }),
    keepPreviousData: true,
    onError: (error) => handleApiError(error, "Failed to fetch transactions."),
  });

  const transactions = data?.transactions || [];

  // --- Mutations ---
  const { mutate: addTransactionMutate, isPending: isAdding } = useMutation({
    mutationFn: addTransactions,
    onSuccess: () => {
      toast.success("Transaction added successfully!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsModalOpen(false);
      setFormData({
        title: "", amount: "", category: "", currency: "USD", type: "income",
        date: new Date().toISOString().split("T")[0], description: "", image: null,
      });
    },
    onError: (error) => handleApiError(error, "Failed to add transaction."),
  });

  const { mutate: updateTransactionMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      toast.success("Transaction updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsModalOpen(false);
      setEditingTransaction(null);
    },
    onError: (error) => handleApiError(error, "Failed to update transaction."),
  });

  const { mutate: deleteTransactionMutate } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success("Transaction deleted.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => handleApiError(error, "Failed to delete transaction."),
  });

  const { mutate: deleteAllMutate } = useMutation({
    mutationFn: deleteAllTransactions,
    onSuccess: () => {
      toast.success("All transactions have been deleted.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => handleApiError(error, "Failed to delete all transactions."),
  });

  // --- Handlers ---
  const handleChange = (e) => {
    if (e.target.name === "image") setFormData({ ...formData, image: e.target.files[0] });
    else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setFormData({ title: "", amount: "", category: "", currency: "USD", type: "income", date: new Date().toISOString().split("T")[0], description: "", image: null });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      ...transaction,
      date: new Date(transaction.date).toISOString().split("T")[0],
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) return toast.error("Please fill in all required fields.");
    const body = new FormData();
    Object.keys(formData).forEach((key) => { if (formData[key]) body.append(key, formData[key]); });
    if (editingTransaction) {
      updateTransactionMutate({ id: editingTransaction._id, formData: body });
    } else {
      addTransactionMutate(body);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSortConfig({ field: column.selector, order: sortDirection });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerRowsChange = (newLimit, newPage) => {
    setLimit(newLimit);
    setPage(newPage);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      try {
        DownloadTransactionsPDF(transactions, selectedCategory, dateFilter, customDateRange);
      } catch {
        toast.error("Failed to download transactions!");
      } finally {
        setIsDownloading(false);
      }
    }, 0);
  };

  const columns = [
    { name: "Title", selector: "title", sortable: true, cell: row => <span>{row.title}</span>, width: "200px" },
    { name: "Category", selector: "category", sortable: true, cell: row => <span className={`p-regular px-2 py-1 rounded ${categoryColors[row.category] || "bg-gray-200"}`}>{row.category || "Other"}</span>, width: "130px" },
    { name: "Type", selector: "type", sortable: true, cell: row => <span className={`p-regular ${row.type === "income" ? "text-green-500" : "text-red-500"}`}>{row.type.charAt(0).toUpperCase() + row.type.slice(1)}</span> },
    { name: "Amount", selector: "amount", sortable: true, cell: row => <span className={`p-regular ${row.type === "income" ? "text-green-500" : "text-red-500"}`}>{row.type === "income" ? "+" : "-"} {currencySymbols[row.currency]} {row.amount} ({row.currency})</span>, width: "180px" },
    { name: "Date", selector: "date", sortable: true, cell: row => <span className="p-regular text-gray-700">{new Date(row.date).toLocaleDateString()}</span>, width: "110px" },
    { name: "Description", selector: "description", sortable: true, cell: row => <span className="p-regular text-gray-700 line-clamp-2">{row.description || "-"}</span>, width: "200px" },
    { name: "Image", selector: "imageUrl", cell: row => row.imageUrl ? <img loading="lazy" src={row.imageUrl} alt="txn" onClick={() => setSelectedImage(row.imageUrl)} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover cursor-pointer" /> : <span className="p-regular text-gray-500">No Image</span> },
    { name: "Action", cell: row => (<div className="flex items-center justify-center gap-2 w-[100px] sm:w-[120px]"><button onClick={() => { setTransactionToDelete(row._id); setIsDeleteModalOpen(true); }} className="bg-red-100 hover:bg-red-200 p-2 cursor-pointer rounded-full transition-all duration-300"><Trash2 size={16} className="sm:size-[18px] text-red-500" /></button><button onClick={() => handleOpenEditModal(row)} className="bg-blue-100 hover:bg-blue-200 p-2 cursor-pointer rounded-full transition-all duration-300"><SquarePen size={16} className="sm:size-[18px] text-blue-500" /></button></div>) },
  ];

  const customStyles = { headCells: { style: { fontSize: "14px", fontWeight: "500", fontFamily: "Poppins", color: "#5759C7", textTransform: "uppercase" } } };
  const categories = ["All", "Food", "Rent", "Shopping", "Salary", "Investment", "Other"];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="bg-[#F7F9FC] p-3 sm:p-6 relative max-w-7xl mx-auto min-h-[80vh] w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl p-semibold text-[#6667DD]">My Transactions</h2>
        <button onClick={handleOpenAddModal} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6667DD] to-[#7C81F8] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md cursor-pointer hover:scale-[0.98] transition-all duration-300">
          <Plus size={16} className="sm:size-[18px]" /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-transparent p-3 sm:p-4 rounded-xl shadow-sm mb-5 flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-3">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full lg:w-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs sm:text-sm cursor-pointer transition-all duration-300 ${selectedCategory === cat ? categoryButtonColors[cat] || "bg-[#6667DD] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full lg:w-auto">
          {["Entire", "Today", "Last Week", "This Month", "Last Month", "Last 3 Months", "This Year", "Custom"].map((filter) => (
            <button key={filter} onClick={() => setDateFilter(filter)} className={`px-3 py-1.5 rounded-full text-xs sm:text-sm cursor-pointer transition-all duration-200 ${dateFilter === filter ? "bg-[#6667DD] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Filter */}
      {dateFilter === "Custom" && (
        <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
          <input type="date" value={customDateRange.from} onChange={(e) => setCustomDateRange({ ...customDateRange, from: e.target.value })} className="rounded-lg border border-[#6667DD] px-3 py-1 text-sm outline-none w-full sm:w-auto" />
          <span className="p-regular text-sm">to</span>
          <input type="date" value={customDateRange.to} onChange={(e) => setCustomDateRange({ ...customDateRange, to: e.target.value })} className="rounded-lg border border-[#6667DD] px-3 py-1 text-sm outline-none w-full sm:w-auto" />
        </div>
      )}

      {/* Stats & Download */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto justify-center sm:justify-start">
          <div className="bg-[#D4F5E9] text-gray-700 px-4 py-1.5 rounded-lg text-sm p-medium">💰 Income: {currencySymbols["USD"]} {totalIncome}</div>
          <div className="bg-[#FFDADA] text-gray-700 px-4 py-1.5 rounded-lg text-sm p-medium">💸 Expense: {currencySymbols["USD"]} {totalExpense}</div>
        </div>
        <button onClick={handleDownload} disabled={isDownloading || transactions.length === 0} className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2 cursor-pointer rounded-lg text-sm p-medium transition-all duration-300 w-full sm:w-auto ${isDownloading || transactions.length === 0 ? "bg-gray-300 text-gray-700 hover:cursor-not-allowed" : "bg-[#E0E2FD] hover:bg-[#C8CBFC] text-[#4447AA]"}`}>
          <DownloadCloud size={16} className="sm:size-[18px]" />
          {isDownloading ? "Downloading..." : transactions.length === 0 ? "No Transactions" : "Download PDF"}
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto">
        {isLoadingTransactions && !data ? (
          <p className="text-[#6667DD] text-center mt-10 sm:mt-20 text-base sm:text-lg p-regular animate-pulse">Loading Transactions...</p>
        ) : (
          <div className="max-w-full mx-auto">
            <DataTable
              columns={columns}
              data={transactions}
              progressPending={isLoadingTransactions}
              pagination
              paginationServer
              sortServer
              paginationTotalRows={data?.totalTransactions}

              // --- THE FIX IS HERE ---
              // This prop tells the table how many rows to display per page,
              // fixing both the dropdown and the next page button issues.
              paginationPerPage={limit}

              onSort={handleSort}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              highlightOnHover
              striped
              fixedHeader
              customStyles={customStyles}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTransactionModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} isAdding={isAdding || isUpdating} isEditing={!!editingTransaction} />

      <ConfirmDeleteModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} onConfirm={() => { deleteTransactionMutate(transactionToDelete); setIsDeleteModalOpen(false); }} title="Are you sure?" description="Do you really want to delete this transaction? This action cannot be undone." />

      <ConfirmDeleteModal isOpen={isDeleteAllModalOpen} setIsOpen={setIsDeleteAllModalOpen} onConfirm={() => { deleteAllMutate(); setIsDeleteAllModalOpen(false); }} title="Are you sure?" description="Do you really want to delete all transactions? This action cannot be undone." />

      <ImagePreviewModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default Transactions;