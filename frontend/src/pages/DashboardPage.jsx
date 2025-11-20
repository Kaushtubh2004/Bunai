import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BottomNavbar from '../components/ui/BottomNavbar';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import PortfolioPage from '../components/PortfolioPage';
import Template from '../components/Template';
import Message from '../components/Message';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("Dashboard");

  const handleLogout = () => {
    logout();
    console.log("User logged out");
  };

  if (!user) {
    return (
      <div className="h-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center px-4">
        <div className="bg-[#222222] border border-[#20d78d]/30 rounded-2xl p-8 text-center shadow-[0_0_15px_#20d78d20] max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-[#20d78d] mb-3">
            No User Data Found
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            It seems like we couldn’t retrieve your account information.
            Please try logging in again or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#0e0e0e] text-white min-h-screen">
      <BottomNavbar logout={handleLogout} onSelect={setActivePage} activePage={activePage} />
      <div className="flex-1 ml-0 md:ml-56 pb-20 md:pb-0 transition-all duration-300">
        {activePage === "Dashboard" && <AnalyticsDashboard name={user?.name} userId={user?._id}/>}
        {activePage === "Portfolio" && <PortfolioPage userId={user?._id}/>}
        {activePage === "Templates" && <Template userId={user?._id}/>}
        {activePage === "Messages" && <Message userId={user?._id}/>}
      </div>
    </div>
  );
};

export default DashboardPage;
