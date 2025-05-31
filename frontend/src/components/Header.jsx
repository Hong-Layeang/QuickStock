import Logo from './Logo.jsx'
import { MdSunny } from "react-icons/md";

const Header = () => {
  return (
    <div className=" flex justify-between ">
        <Logo />
        <div className="text-2x1">Inventory Admin</div>
        <div>
            <div><MdSunny /></div>
            <div></div>
            <div></div>
        </div>
    </div>
  )
}

export default Header;