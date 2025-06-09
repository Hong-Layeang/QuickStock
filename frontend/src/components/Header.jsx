import { MdSunny } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { FaMoon } from "react-icons/fa";
import { useEffect, useState } from 'react';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkmode = () => {
    setDarkMode(prev => !prev);
  }

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className=" pl-3 pr-3 flex justify-between items-center">
        <h1 className="text-5xl text-orange-900">Inventory Admin</h1>
        <div className=" text-4xl flex gap-3">
            <div onClick={handleDarkmode} className="cursor-pointer">
              { darkMode ? <FaMoon className="text-blue-400"/> : <MdSunny className="text-yellow-500"/> }
            </div>
            <div className="text-orange-500"><BsBell /></div>
            <div className="text-blue-500"><IoPersonCircle /></div>
        </div>
    </div>
  )
}

export default Header;