import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    DollarSign,
    CreditCard,
    List,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    CalendarClock,
} from 'lucide-react';

// Import Charting Libraries and register necessary components
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, ChartTooltip, Legend, Filler);

// Import your custom data-fetching hook
import { fetchDashboardStats } from '../hooks/dashboard';


// ========================= HELPER FUNCTIONS & CONFIG =========================

// Helper to format currency values
const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // You can make this dynamic later if needed
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// Common options for all charts to maintain a consistent look
const commonChartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { font: { family: "Poppins", size: 12 }, color: "#333", padding: 20 },
        },
        title: {
            display: true,
            text: titleText,
            font: { size: 16, family: 'Poppins', weight: '600' },
            color: '#333',
            padding: { top: 10, bottom: 20 }
        },
    },
});

// Specific options for the bar chart
const barChartOptions = (titleText) => ({
    ...commonChartOptions(titleText),
    plugins: { // Override plugins to hide legend for the bar chart
        ...commonChartOptions(titleText).plugins,
        legend: { display: false },
    },
    scales: {
        x: { grid: { display: false } },
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1, // Ensures y-axis counts integers (1, 2, 3...)
                precision: 0,
            }
        }
    }
});


// ========================= SKELETON LOADER COMPONENTS =========================

// Skeleton for the small stat cards at the top
const StatCardSkeleton = () => (
    <div className="bg-transparent shadow-sm p-4 flex items-center gap-3 animate-pulse rounded-lg">
        <div className="p-3 bg-gray-200 rounded-full h-12 w-12"></div>
        <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
    </div>
);

// Skeleton for a chart area
const ChartSkeleton = ({ height = 0 }) => (
    <div className="rounded-2xl animate-pulse h-68">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-full bg-gray-200 rounded"></div>
    </div>
);


// ========================= MAIN COMPONENT =========================

const Hero = () => {
    // Fetch all dashboard data with a single, efficient useQuery call
    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
    });

    // Handle Error State: Show a user-friendly error message
    if (isError) {
        return <div className="p-6 text-center text-red-500">Could not load dashboard data. Please try again later.</div>;
    }

    // --- Prepare Quick Stats Data (with safety checks) ---
    const quickStats = isLoading || !stats
        ? Array(5).fill({}) // Create placeholders for skeleton loaders
        : [
            { icon: <DollarSign size={20} className="text-green-500" />, label: 'Income', value: formatCurrency(stats.totalIncome) },
            { icon: <CreditCard size={20} className="text-red-500" />, label: 'Expenses', value: formatCurrency(stats.totalExpenses) },
            { icon: <List size={20} className="text-blue-500" />, label: 'Transactions', value: stats.totalTransactions },
            { icon: <Users size={20} className="text-teal-500" />, label: 'Connected Users', value: stats.connectedUsers?.length || 0 },
            { icon: <CalendarClock size={20} className="text-purple-500" />, label: 'Upcoming Schedules', value: stats.upcomingSchedules },
        ];

    // --- Prepare Chart Data (with robust safety checks) ---
    const incomeData = {
        labels: stats?.incomeByCategory?.map(item => item._id) || [],
        datasets: [{
            data: stats?.incomeByCategory?.map(item => item.totalAmount) || [],
            backgroundColor: ['#4BC0C0', '#9966FF', '#FF9F40', '#36A2EB'],
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    const expenseData = {
        labels: stats?.expenseByCategory?.map(item => item._id) || [],
        datasets: [{
            data: stats?.expenseByCategory?.map(item => item.totalAmount) || [],
            backgroundColor: ['#fa7b8c', '#55575a', '#bf9aca', '#9966FF'],
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    const connectedUsersData = {
        labels: stats?.connectedUsers?.map(user => user.name) || [],
        datasets: [{
            label: 'Users',
            data: Array(stats?.connectedUsers?.length || 0).fill(1),
            backgroundColor: '#6667DD',
            borderRadius: 5,
        }]
    };

    const usageData = {
        labels: stats?.dailyUsage?.map(item => new Date(item.day).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })) || [],
        datasets: [{
            label: 'Transactions',
            data: stats?.dailyUsage?.map(item => item.count) || [],
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.3,
        }]
    };

    // const scheduledPaymentsChartData = {
    //     labels: ['Scheduled Payments'],
    //     datasets: [{
    //         label: 'Count',
    //         data: [stats?.upcomingSchedules || 0],
    //         backgroundColor: '#9966FF',
    //         borderRadius: 5,
    //     }]
    // };

    const chartHeight = 350;

    return (
        <div className="px-4 sm:px-5 py-6 bg-[#F6F9FC] p-regular">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[#6667DD] p-bold text-2xl sm:text-4xl">FinSync Dashboard</h1>
                    <p className="text-gray-600 p-regular mt-1">Your monthly financial and activity overview.</p>
                </div>
                <Link to={"/transactions"} className="flex items-center gap-2 bg-[#6667DD] text-white px-4 py-3 rounded-full shadow-md hover:bg-[#5152b8] transition-all">
                    <TrendingUp size={20} /> Create Transaction
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {(isLoading || !stats) ? (
                    Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    quickStats.map((stat, index) => (
                        <div key={index} className="bg-transparent shadow-sm p-4 flex items-center gap-3 rounded-lg">
                            <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
                            <div>
                                <p className="text-gray-500 text-sm p-regular">{stat.label}</p>
                                <p className="text-gray-800 p-semibold text-lg sm:text-xl">{stat.value}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Chart 1: Income Categories */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm" style={{ height: chartHeight }}>
                    {isLoading ? <ChartSkeleton height={chartHeight} /> : (stats?.incomeByCategory.length > 0 ? <Doughnut data={incomeData} options={commonChartOptions('Income by Category (This Month)')} /> : <div className="h-full flex items-center justify-center text-gray-500">No income data this month.</div>)}
                </div>

                {/* Chart 2: Expense Categories */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm" style={{ height: chartHeight }}>
                    {isLoading ? <ChartSkeleton height={chartHeight} /> : (stats?.expenseByCategory.length > 0 ? <Doughnut data={expenseData} options={commonChartOptions('Expenses by Category (This Month)')} /> : <div className="h-full flex items-center justify-center text-gray-500">No expense data this month.</div>)}
                </div>

                {/* Chart 3: Connected Users */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm" style={{ height: chartHeight }}>
                    {isLoading ? <ChartSkeleton height={chartHeight} /> : (stats?.connectedUsers.length > 0 ? <Bar data={connectedUsersData} options={barChartOptions('Connected Users')} /> : <div className="h-full flex items-center justify-center text-gray-500">No connected users yet.</div>)}
                </div>

                {/* Chart 4: App Usage */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm" style={{ height: chartHeight }}>
                    {isLoading ? <ChartSkeleton height={chartHeight} /> : (stats?.dailyUsage.length > 0 ? <Line data={usageData} options={commonChartOptions('App Usage (Transactions per Day)')} /> : <div className="h-full flex items-center justify-center text-gray-500">No app usage data this month.</div>)}
                </div>

                {/* <div className="bg-white p-4 rounded-2xl shadow-md" style={{ height: chartHeight }}>
                    {isLoading ? <ChartSkeleton height={chartHeight} /> : (stats?.upcomingSchedules > 0 ? <Bar data={scheduledPaymentsChartData} options={barChartOptions('Upcoming Scheduled Payments')} /> : <div className="h-full flex items-center justify-center text-gray-500">No scheduled payments.</div>)}
                </div> */}
            </div>

            {/* Section 5: Recent Transactions */}
            <div className="bg-transparent backdrop-blur-sm p-4 sm:p-6 rounded-3xl shadow-sm border border-purple-100/50">
                <h3 className="p-semibold text-gray-800 mb-6 text-lg">Recent Transactions</h3>
                {isLoading ? (
                    <div>{Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl mb-3 animate-pulse"></div>)}</div>
                ) : (stats?.recentTransactions && stats.recentTransactions.length > 0) ? (
                    <div className="space-y-2">
                        {stats.recentTransactions.slice(0, 5).map(tx => (
                            <div key={tx._id} className="flex justify-between items-center px-4 py-3 sm:p-4 bg-[#F9F2FD] hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-pink-50/80 rounded-2xl transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer group">
                                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-4">
                                    <div className={`p-3 rounded-2xl transition-all duration-300 ${tx.type === 'income' ? 'bg-gradient-to-br from-green-100 to-emerald-50 group-hover:shadow-md' : 'bg-gradient-to-br from-red-100 to-rose-50 group-hover:shadow-md'}`}>
                                        {tx.type === 'income' ? <ArrowUpRight size={20} className="text-green-600" /> : <ArrowDownRight size={20} className="text-red-600" />}
                                    </div>
                                    <div>
                                        <p className="p-semibold text-gray-800 mb-0.5">{tx.title}</p>
                                        <p className="text-xs text-gray-500 font-medium">{tx.category}</p>
                                    </div>
                                </div>
                                <p className={`p-semibold text-base ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 p-8 bg-gray-50/50 rounded-2xl">No recent transactions.</div>
                )}
            </div>
        </div>
    );
};

export default Hero;