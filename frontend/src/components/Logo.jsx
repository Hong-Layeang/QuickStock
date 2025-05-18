import logo from '../assets/logo.png';

const Logo = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-3">
      <img src={logo} alt="site logo" className="w-12" />
      <div className="text-orange-500 flex flex-col">
        <h1 className="font-bold text-3xl">QuickStock</h1>
        <div className="flex gap-2 mt-1">
          <div className="w-1/13 h-1.5 bg-orange-500"></div>
          <div className="w-1/13 h-1.5 bg-orange-500"></div>
          <div className="w-1/13 h-1.5 bg-orange-500"></div>
          <div className="w-full h-1.5 bg-orange-500"></div>
        </div>
      </div>
    </div>
  )
}

export default Logo;