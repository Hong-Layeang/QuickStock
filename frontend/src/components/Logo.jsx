import logo from '../assets/logo.png';

const Logo = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 hover:cursor-pointer">
      <img
        src={`${logo}?height=48&width=48`}
        alt="site logo"
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
      />
      <div className="text-orange-500 flex-col hidden sm:flex">
        <h1 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">QuickStock</h1>
        <div className="flex gap-1 sm:gap-2 mt-1">
          <div className="w-1 sm:w-1/13 h-1 sm:h-1.5 bg-orange-500"></div>
          <div className="w-1 sm:w-1/13 h-1 sm:h-1.5 bg-orange-500"></div>
          <div className="w-1 sm:w-1/13 h-1 sm:h-1.5 bg-orange-500"></div>
          <div className="w-8 sm:w-12 md:w-full h-1 sm:h-1.5 bg-orange-500"></div>
        </div>
      </div>
    </div>
  )
}

export default Logo
