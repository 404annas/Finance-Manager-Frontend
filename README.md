# 💰 FINANCE-APP

**FINANCE-APP** is a modern **Finance Manager Web Platform** designed for secure, seamless, and efficient financial management.  
A **mobile application** built with **React Native** will be released soon for users on the go.  

The project leverages **React 19 + Tailwind CSS 4** and modern libraries to provide a sleek, responsive, and interactive **dashboard system**.  
The backend is powered by **Node.js, Express, and MongoDB**, ensuring speed, scalability, and reliability.  

Users can **create accounts, log in securely, manage payments, transactions, reminders, and collaborations** from a beautifully designed, real-time dashboard.  

---

## ✨ Key Features

### 👤 User Dashboards
- Personalized and responsive dashboards for **dynamic financial insights**.  
- Interactive charts using **Recharts, React-ChartJS-2, Nivo (Pie & Radial Bar)**.  
- Real-time updates with **TanStack Query** (⚡ fast, cache-efficient, reactive data fetching).

### 💳 Payment Management
- Add and track payments with statuses: **Completed, Pending, Processing, or Custom**.  
- Schedule payments with **date & time reminders**.  
- Automated email reminders via **Nodemailer**.  

### 💱 Transactions
- Categorized transactions management.  
- Modern, interactive tables using **React Data Table Component**.  
- Always synced in real-time with backend updates.

### 📧 Reminders & Notifications
- Send reminders to specific users via email.  
- Keep business partners or team members aligned on deadlines.

### 🫂 Collaborative Payments
- Invite users or business partners to contribute to payments.  
- Manage participants via **Users** and **Recipients** menus.  
- Create shared categories for group payments.  
- Automatic email notifications for all participants.

### 🔐 Authentication & Security
- Finance apps require **robust security** — FINANCE-APP ensures data protection and safe authentication.  
- Secure login/registration using:  
  - **JWT (JSON Web Tokens)** for authentication.  
  - **bcrypt** for password hashing.  
  - **Role-Based Access Control (RBAC)** for Admin and User privileges.  
  - **Secure cookies & HTTPS** for encrypted communication.  
- Guarantees credentials, transactions, and records remain **private and tamper-proof**.

### 📞 Contact & Support
- Built-in **Contact Us form** for queries, bug reports, or feedback.  
- Direct support channel for timely issue resolution.

---

## 🛠️ Tech Stack

### Core
- **Frontend**: React 19, Tailwind CSS 4 (`@tailwindcss/vite`)  
- **Backend**: Node.js, Express, MongoDB  
- **Mobile (upcoming)**: React Native  

### Libraries & Tools
- **UI & Styling**: Tailwind CSS, Lucide-React, React Icons  
- **Charts & Visualization**: Recharts, React-ChartJS-2, @nivo/pie, @nivo/radial-bar  
- **Animations**: Framer Motion  
- **Forms & Inputs**: React Datepicker  
- **Tables**: React Data Table Component  
- **State & Data Management**: TanStack Query, React Context API  
- **Routing**: React Router DOM  
- **Utilities**: Axios, Sonner (toast notifications)  
- **Communication**: Nodemailer  

---

## 📂 Project Structure

FINANCE-APP/
|
├── public/              # Static assets available to the browser
├── src/
│   ├── assets/          # Images, icons, and other media
│   ├── components/      # Reusable UI components (e.g., Sidebar, Hero)
│   ├── context/         # Global state management (AppContext.jsx)
│   ├── routes/          # Application routing configuration
│   ├── screens/         # Top-level screen components (Dashboards)
│   ├── App.jsx          # Main application component and router setup
│   └── main.jsx         # Application's primary entry point
|
├── .env                 # Environment variables configuration
├── .gitignore           # Specifies intentionally untracked files
├── index.html           # The main HTML template for Vite
├── package.json         # Project metadata and dependencies
└── vite.config.js       # Vite build and server configuration

---

## 🖥️ Usage Flow

1. 🔑 **User Authentication** → Register/Login securely with encrypted credentials.  
2. 📊 **Dashboard Access** → View charts, tables, and real-time financial data.  
3. 💳 **Manage Payments** → Add, track, and schedule payments with reminders.  
4. 🔔 **Notifications** → Receive automated email alerts/reminders.  
5. 💱 **Transactions** → Add categorized transactions with live updates.  
6. 🫂 **Collaboration** → Invite users, manage group payments, and share dashboards.  
7. 📧 **Reminders** → Send emails for specific payment/transaction cases.  
8. 📞 **Support** → Contact management for queries, bugs, or issues.  

---

## 📬 Contact

For any queries, suggestions, or issues, feel free to reach out:  

📧 **Email**: annasking601@gmail.com  
🌐 **Project Link**: [FINANCE-APP](https://finance-manage-kappa.vercel.app/)

---