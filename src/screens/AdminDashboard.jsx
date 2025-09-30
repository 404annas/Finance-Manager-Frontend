import Sidebar from "../components/Sidebar";
import HeroNav from "../components/HeroNav";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div className="flex h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col">
                <HeroNav role="admin"/>
                <div className="p-4 flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
