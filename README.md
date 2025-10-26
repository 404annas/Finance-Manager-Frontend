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
- Real-time updates powered by **TanStack Query** and **Socket.io**.  
- TanStack handles **smart caching**, **auto refetching**, and **data synchronization**.
- Socket.io delivers **instant updates** for payments, transactions, and user activities.

### 💳 Payment Management
- Add and track payments with statuses: **Completed, Pending, Processing, or Custom**.  
- Schedule payments with **date & time reminders**.  
- Automated email reminders via **Nodemailer**.  
- Real-time synchronization using **Socket.io** for instant dashboard updates.

### 💱 Transactions
- Categorized transactions management.  
- Modern, interactive tables using **React Data Table Component**.  
- Always synced with backend updates via **TanStack Query** and WebSocket events.  

### 📧 Reminders & Notifications
- Send reminders to specific users via email.  
- Keep business partners or team members aligned on deadlines.  
- Real-time UI updates when reminders are sent or payments are updated.

### 🤝 Collaborative Payments
- Invite users or business partners to contribute to payments.  
- Manage participants via **Users** and **Recipients** menus.  
- Create shared categories for group payments.  
- Automatic **email + real-time Socket notifications** for all participants.

### 🔐 Authentication & Security
- Finance apps require **robust security** — FINANCE-APP ensures data protection and safe authentication.  
- Secure login/registration using:  
  - **JWT (JSON Web Tokens)** for authentication.  
  - **bcrypt** for password hashing.  
  - **Role-Based Access Control (RBAC)** for Admin and User privileges.  
  - **Secure cookies & HTTPS** for encrypted communication.  
- Guarantees credentials, transactions, and records remain **private and tamper-proof**.

### 🧠 TanStack Query Integration
- All asynchronous requests are managed using **TanStack Query** (React Query).  
- Ensures **real-time synchronization** between client and server with **minimal API calls**.  
- Handles background refetching, caching, and automatic data invalidation for smoother UX.  
- Custom hooks inside the `/hooks` folder make logic **reusable**, **clean**, and **scalable** —  
  for example:
  - `useFetchPayments.js`  
  - `useAddTransaction.js`  
  - `useInviteUser.js`  
  - `useDeleteUser.js`  
  - `useRealTimeUpdates.js` (via Socket.io)  

### ⚡ Real-Time Updates (Socket.io)
- **Socket.io** ensures all users see **instant changes** (no refresh needed).  
- Used for:
  - Payment creation/deletion.
  - Transaction updates.
  - Shared user collaboration.
  - Live notifications.
- Makes the dashboard feel **interactive and modern** just like a live finance tracking app.

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
- **Real-Time Communication**: Socket.io  
- **Routing**: React Router DOM  
- **Utilities**: Axios, Sonner (toast notifications)  
- **Communication**: Nodemailer  

---

## 📂 Project Structure

```
FINANCE-APP/
|
├── public/              # Static assets available to the browser
├── src/
│   ├── assets/          # Images, icons, and other media
│   ├── components/      # Reusable UI components (e.g., Sidebar, Hero)
│   ├── hooks/           # Making Business Logic & Ui Logic Seperate via TanStack
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
```

---

## 🖥️ Usage Flow

1. 🔑 **User Authentication** → Register/Login securely with encrypted credentials.  
2. 📊 **Dashboard Access** → View charts, tables, and real-time financial data.  
3. 💳 **Manage Payments** → Add, track, and schedule payments with reminders.  
4. 🔔 **Notifications** → Receive automated email and live Socket alerts.  
5. 💱 **Transactions** → Add categorized transactions with instant updates.  
6. 🤝 **Collaboration** → Invite users, manage group payments, and share dashboards.  
7. 📧 **Reminders** → Send emails for specific payment/transaction cases.  
8. ⚡ **Live Sync** → Dashboard auto-refreshes via **TanStack Query** & **Socket.io**.  
9. 📞 **Support** → Contact management for queries, bugs, or issues.  

---

## 📬 Contact

For any queries, suggestions, or issues, feel free to reach out:  

📧 **Email**: annasking601@gmail.com  
🌐 **Project Link**: [FINANCE-APP](https://finance-manage-kappa.vercel.app/)