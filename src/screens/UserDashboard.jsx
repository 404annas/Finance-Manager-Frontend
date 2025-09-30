import Sidebar from "../components/Sidebar";
import HeroNav from "../components/HeroNav";
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar role="user" />
      <div className="flex-1 flex flex-col">
        <HeroNav role="user" />
        <div className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
