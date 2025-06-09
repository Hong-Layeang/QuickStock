import { LuChartNoAxesCombined } from "react-icons/lu";
import { BsBoxes } from "react-icons/bs";
import { LuClipboardList } from "react-icons/lu";
import { GrUserManager } from "react-icons/gr";
import { useState } from "react";
import Logo from "./Logo";

const AdminSideBar = () => {
  const [active, setActive] = useState('dashboard');

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <LuChartNoAxesCombined /> },
    { key: "products", label: "Products", icon: <BsBoxes /> },
    { key: "orders", label: "Orders", icon: <LuClipboardList /> },
    { key: "suppliers", label: "Suppliers", icon: <GrUserManager /> }
  ];

  return (
    <div className="fixed h-screen flex flex-col w-[60px] sm:w-[230px] transition-all duration-300">
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center sm:justify-start">
        <Logo />
      </div>

      {/* Menu Items Section */}
      <div className="flex-1 flex flex-col mt-6 border-r-1 border-orange-400">
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex items-center gap-3 px-2 sm:px-4 py-3 cursor-pointer text-xl transition duration-200
              ${active === item.key ? "bg-orange-400 text-white" : "hover:bg-orange-200"}`}
          >
            <div>{item.icon}</div>
            <span className="hidden sm:inline">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSideBar;
