import {
    Plus,
    TrendingUp,
    CreditCard,
    DollarSign,
    PieChart,
    Activity,
    TrendingUp as TrendingUpIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

// Recharts
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// Chart.js
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
} from 'chart.js';

// Nivo Radial Bar
import { ResponsiveRadialBar } from '@nivo/radial-bar';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, ChartTooltip, Legend);

// ========================= DATA =========================
const lineData = [
    { month: 'Jan', balance: 400 },
    { month: 'Feb', balance: 800 },
    { month: 'Mar', balance: 600 },
    { month: 'Apr', balance: 1000 },
    { month: 'May', balance: 1200 },
];

const incomeExpenseData = [
    { month: 'Jan', income: 1200, expense: 800 },
    { month: 'Feb', income: 1500, expense: 1000 },
    { month: 'Mar', income: 1000, expense: 700 },
    { month: 'Apr', income: 1800, expense: 1200 },
    { month: 'May', income: 2000, expense: 1500 },
];

const barData = {
    labels: ['Savings', 'Expenses', 'Investments', 'Debt'],
    datasets: [
        {
            label: 'Amount ($)',
            data: [500, 300, 200, 100],
            backgroundColor: ['#6667DD', '#FF6384', '#36A2EB', '#FFCE56'],
        },
    ],
};

const stackedBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
        {
            label: 'Savings',
            data: [500, 700, 600, 800, 900],
            backgroundColor: '#6667DD',
        },
        {
            label: 'Debt',
            data: [200, 300, 250, 400, 350],
            backgroundColor: '#FF6384',
        },
    ],
};

const doughnutData = {
    labels: ['Food', 'Travel', 'Shopping', 'Bills'],
    datasets: [
        {
            data: [150, 200, 100, 50],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#6667DD'],
            borderWidth: 1,
        },
    ],
};

const radialData = [
    {
        id: 'Budget',
        data: [
            { x: 'Used', y: 30 },
            { x: 'Remaining', y: 30 },
            { x: 'Saved', y: 40 }
        ],
    },
];

const quickStats = [
    { icon: <DollarSign size={20} />, label: 'Income', value: '$7,000' },
    { icon: <CreditCard size={20} />, label: 'Expenses', value: '$2,300' },
    { icon: <PieChart size={20} />, label: 'Investments', value: '$1,200' },
    { icon: <Activity size={20} />, label: 'Debt', value: '$800' },
    { icon: <TrendingUpIcon size={20} />, label: 'Profit', value: '$3,000' },
];

// ========================= CHART OPTIONS =========================
const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                font: {
                    family: "Poppins",
                    size: 13,
                },
                color: "#333",
            },
        },
    },
    scales: {
        x: {
            ticks: {
                font: {
                    family: "Poppins",
                    size: 12,
                },
                color: "#6667DD",
            },
        },
        y: {
            ticks: {
                font: {
                    family: "Poppins",
                    size: 12,
                },
                color: "#6667DD",
            },
        },
    },
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                font: {
                    family: "Poppins",
                    size: 13,
                },
                color: "#444",
            },
        },
    },
};

const Hero = ({ role }) => {
    const navigate = useNavigate();
    const { user } = useAppContext();

    const chartHeight = 350;

    return (
        <div className="px-5 py-6 bg-[#F6F9FC] p-regular">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[#6667DD] p-bold text-4xl tracking-tight">FinSync Dashboard</h1>
                    <p className="text-gray-600 p-regular mt-1 text-sm sm:text-base">
                        Overview of your balances, expenses, and investments
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to={"/users"} className="flex items-center gap-2 bg-[#6667DD] text-white px-4 py-3 rounded-full hover:bg-[#5556cc] cursor-pointer hover:scale-95 transition-all duration-300 p-regular">
                        <TrendingUp size={20} />
                        Invite Friends
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {quickStats.map((stat, index) => (
                    <div key={index} className="bg-transparent shadow-sm p-4 flex items-center gap-3">
                        <div className="p-3 bg-[#6667DD]/10 text-[#6667DD] rounded-full">{stat.icon}</div>
                        <div>
                            <p className="text-gray-500 p-regular">{stat.label}</p>
                            <p className="text-gray-800 p-semibold text-base">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Balance Trend */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm text-sm" style={{ height: chartHeight }}>
                    <h3 className="p-semibold text-gray-700 mb-2 text-base">Balance Trend</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={lineData}>
                            <XAxis dataKey="month" tick={{ fontFamily: "Poppins", fontSize: 12, fill: "#6667DD" }} />
                            <YAxis tick={{ fontFamily: "Poppins", fontSize: 12, fill: "#6667DD" }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="balance" stroke="#6667DD" fill="#6667DD" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Overview */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm" style={{ height: chartHeight }}>
                    <h3 className="p-semibold text-gray-700 mb-2">Monthly Overview</h3>
                    <div className="h-[90%]">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                {/* Spending Categories */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm" style={{ height: chartHeight }}>
                    <h3 className="p-semibold text-gray-700 mb-2">Spending Categories</h3>
                    <div className="h-[90%]">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Income vs Expenses (Line) */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm text-sm" style={{ height: chartHeight }}>
                    <h3 className="p-semibold text-gray-700 mb-2 text-base">Income vs Expenses</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={incomeExpenseData}>
                            <XAxis dataKey="month" tick={{ fontFamily: "Poppins", fontSize: 12, fill: "#6667DD" }} />
                            <YAxis tick={{ fontFamily: "Poppins", fontSize: 12, fill: "#6667DD" }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="income" stroke="#36A2EB" />
                            <Line type="monotone" dataKey="expense" stroke="#FF6384" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Savings vs Debt (Stacked Bar) */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm" style={{ height: chartHeight }}>
                    <h3 className="p-semibold text-gray-700 mb-2">Savings vs Debt</h3>
                    <div className="h-[90%]">
                        <Bar data={stackedBarData} options={barOptions} />
                    </div>
                </div>

                {/* Budget Utilization (Radial) */}
                <div className="bg-transparent p-4 rounded-2xl shadow-sm" style={{ height: chartHeight }}>
                    <h3 className="p-semibold text-gray-700 mb-2">Budget Utilization</h3>
                    <ResponsiveRadialBar
                        data={radialData}
                        valueFormat=">-.2f"
                        colors={['#6667DD', '#FFCE56', '#FF4069']}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        innerRadius={0.3}
                        padding={0.4}
                        cornerRadius={2}
                        theme={{
                            text: {
                                fontFamily: "Poppins",
                                fontSize: 12,
                                fill: "#6667DD",
                            },
                            axis: {
                                ticks: {
                                    text: {
                                        fontFamily: "Poppins",
                                        fontSize: 12,
                                        fill: "#6667DD",
                                    },
                                },
                            },
                            legends: {
                                text: {
                                    fontFamily: "Poppins",
                                    fontSize: 12,
                                    fill: "#444",
                                },
                            },
                            tooltip: {
                                container: {
                                    fontFamily: "Poppins",
                                    fontSize: 12,
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
