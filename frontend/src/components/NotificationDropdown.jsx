import { Bell, AlertTriangle, Package, Clock, CheckCircle, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import useThemeStore from '../stores/useThemeStore'

const NotificationDropdown = ({ userType = "admin" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { isDark } = useThemeStore()

  // Sample notifications data based on user type
  const getNotifications = () => {
    if (userType === "supplier") {
      return [
        {
          id: 1,
          type: "stock",
          message: "5 of your products are low in stock.",
          time: "2 minutes ago",
          read: false,
          action: () => window.location.href = "/supplier/my-products?filter=low-stock"
        },
        {
          id: 2,
          type: "success",
          message: "New product 'Widget X' added successfully.",
          time: "5 minutes ago",
          read: false,
          action: () => window.location.href = "/supplier/my-products"
        },
        {
          id: 3,
          type: "info",
          message: "Your supplier account is fully activated.",
          time: "1 hour ago",
          read: true,
          action: () => window.location.href = "/supplier/settings"
        },
        {
          id: 4,
          type: "warning",
          message: "Product 'Item Y' needs price update.",
          time: "2 hours ago",
          read: true,
          action: () => window.location.href = "/supplier/my-products"
        }
      ]
    } else {
      // Admin notifications
      return [
        {
          id: 1,
          type: "stock",
          message: "12 products are low in stock.",
          time: "2 minutes ago",
          read: false,
          action: () => window.location.href = "/admin/products?filter=low-stock"
        },
        {
          id: 2,
          type: "warning",
          message: "2 orders are pending approval.",
          time: "5 minutes ago",
          read: false,
          action: () => window.location.href = "/admin/orders?filter=pending"
        },
        {
          id: 3,
          type: "info",
          message: "Supplier registration requests pending.",
          time: "10 minutes ago",
          read: true,
          action: () => window.location.href = "/admin/suppliers?filter=pending"
        },
        {
          id: 4,
          type: "success",
          message: "New product added successfully.",
          time: "1 hour ago",
          read: true,
          action: () => window.location.href = "/admin/products"
        }
      ]
    }
  }

  const sampleNotifications = getNotifications()

  const iconMap = {
    warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    info: <Bell className="w-4 h-4 text-blue-500" />,
    stock: <Package className="w-4 h-4 text-red-500" />,
    time: <Clock className="w-4 h-4 text-purple-500" />,
    success: <CheckCircle className="w-4 h-4 text-green-500" />
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const unreadCount = sampleNotifications.filter(n => !n.read).length

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-colors relative group hover:cursor-pointer ${
          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
        }`}
        aria-label="Notifications"
      >
        <Bell className={`h-5 w-5 group-hover:scale-110 transition-transform ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg border z-50 animate-fade-in ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Notifications
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-lg transition-colors hover:cursor-pointer ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`h-4 w-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {sampleNotifications.length > 0 ? (
              <div className="p-2">
                {sampleNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      notification.action()
                      setIsOpen(false)
                    }}
                    className={`flex items-start mt-2 p-3 rounded-lg transition-colors cursor-pointer ${
                      !notification.read 
                        ? isDark 
                          ? 'bg-blue-900/20 hover:bg-blue-900/30' 
                          : 'bg-blue-50 hover:bg-blue-100'
                        : isDark 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {iconMap[notification.type] || iconMap.info}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {notification.time}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-4 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-3 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => {
                // Mark all as read functionality
                setIsOpen(false)
              }}
              className={`w-full text-sm font-medium transition-colors hover:cursor-pointer ${
                isDark 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown 