"use client"

import { Menu } from "lucide-react"
import { useEffect, useState } from "react"

const MobileMenuToggle = ({ onClick }) => {
  const [showButton, setShowButton] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowButton(false)
      } else {
        // Scrolling up
        setShowButton(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <button
        onClick={onClick}
        className={`
            lg:hidden fixed top-4 left-4 z-50 p-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer transition-opacity duration-300 ease-in-out
            ${showButton ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
    >
      <Menu className="h-4 w-4" />
    </button>
  )
}

export default MobileMenuToggle
