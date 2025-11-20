import { useState } from "react";
import { Home, FileText, Layout, LogOut, MessageCircle } from "lucide-react";

export default function BottomNavbar({ logout, onSelect, activePage }) {
  const [active, setActive] = useState(activePage || "Dashboard");

  const handleSelect = (page) => {
    setActive(page);
    onSelect(page);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) logout();
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home size={22} /> },
    { name: "Portfolio", icon: <FileText size={22} /> },
    { name: "Templates", icon: <Layout size={22} /> },
    {name: "Messages", icon: <MessageCircle size={22}/>}
  ];

  return (
    <>
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col justify-between w-56 min-h-screen bg-[#111] border-r border-gray-800 text-gray-300 p-5 fixed left-0 top-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img className="h-10 w-auto" src="../images/logo.png" alt="Brand Logo" />
            <span className="font-bold text-2xl bg-gradient-to-r from-[#20d78d] to-[#5ef2b3] bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(32,215,141,0.3)]">
              BunAi
            </span>
          </div>

          <h2 className="uppercase text-xs text-gray-500 mb-3">Navigation</h2>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSelect(item.name)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${active === item.name
                    ? "bg-[#20d78d]/20 text-[#20d78d]"
                    : "hover:bg-[#1b1b1b] hover:text-[#20d78d]"
                  }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-red-400 hover:bg-[#1b1b1b] transition-all mt-3"
            >
              <LogOut size={22} /> Logout
            </button>
          </nav>
        </div>
        <div className="pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} <span className="text-[#20d78d] font-semibold">BunAi</span><br />
          All rights reserved.
        </div>
      </aside>


      {/* Bottom Navbar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#1b1b1b]/90 backdrop-blur-md border-t border-gray-700">
        <div className="flex justify-around items-center py-3 relative">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleSelect(item.name)}
              className={`flex flex-col items-center text-gray-400 hover:text-[#20d78d] transition ${active === item.name ? "text-[#20d78d]" : ""
                }`}
            >
              {item.icon}
              <span className="text-[11px] mt-1">{item.name}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-gray-400 hover:text-red-400 transition"
          >
            <LogOut size={22} />
            <span className="text-[11px] mt-1">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
