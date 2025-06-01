import { LuChartNoAxesCombined } from "react-icons/lu";
import { BsBoxes } from "react-icons/bs";
import { LuClipboardList } from "react-icons/lu";
import { GrUserManager } from "react-icons/gr";
import { useState } from "react";

const SideBar = () => {
    const [active, setActive] = useState('dashboard');

    const menuItems = [
        { key: "dashboard", label: "Dashboard", icon: <LuChartNoAxesCombined /> },
        { key: "products", label: "Products", icon: <BsBoxes /> },
        { key: "orders", label: "Orders", icon: <LuClipboardList /> },
        { key: "suppliers", label: "Suppliers", icon: <GrUserManager /> }
    ];

  return (
    <div className=" sidebar fixed w-[200px] h-[300px] overflow-y-auto mt-20 flex flex-col gap-5 border-r-1 border-solid border-orange-400">

      {menuItems.map((item) => (
        <div
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`text-2xl flex gap-3 items-center px-4 py-2 cursor-pointer duration-200
            ${active === item.key ? "bg-orange-400 text-white" : "hover:bg-orange-200"}`}
        >
          <div>{item.icon}</div>
          <span>{item.label}</span>
        </div>
        ))}

        {/* <div className=" text-2xl flex gap-3 items-center duration-300 cursor-pointer hover:bg-orange-400">
            <div><LuChartNoAxesCombined /></div>
            <span>Dashboard</span>
        </div>
        <div className=" text-2xl flex gap-3 items-center">
            <div><BsBoxes /></div>
            <span>Products</span>
        </div>
        <div className=" text-2xl flex gap-3 items-center">
            <div><LuClipboardList /></div>
            <span>Orders</span>
        </div>
        <div className=" text-2xl flex gap-3 items-center">
            <div><GrUserManager /></div>
            <span>Suppliers</span>
        </div> */}
    </div>
  )
}

export default SideBar;