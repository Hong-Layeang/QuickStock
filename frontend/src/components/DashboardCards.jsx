import { Boxes, PackagePlus, CircleAlert, PackageMinus, TrendingUp, TrendingDown, ArrowRight, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import useThemeStore from '../store/useThemeStore'

const DashboardCards = ({ cards, loading = false, onRefresh }) => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useThemeStore();

  const sampleCards = [
    { 
      icon: <Boxes className="w-6 h-6" />, 
      title: "Total Products", 
      value: "1,245", 
      subtitle: "products", 
      bg: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700", 
      text: "text-white",
      trend: "+12%",
      trendDirection: "up",
      change: "from last month",
      onClick: () => navigate('/admin/products'),
      description: "Total number of products in inventory"
    },
    { 
      icon: <CircleAlert className="w-6 h-6" />, 
      title: "Low in Stock", 
      value: "32", 
      subtitle: "items", 
      bg: "bg-gradient-to-br from-red-500 via-red-600 to-red-700", 
      text: "text-white",
      trend: "+5%",
      trendDirection: "up",
      change: "from last week",
      onClick: () => navigate('/admin/products?filter=low-stock'),
      description: "Products that need restocking"
    },
    { 
      icon: <PackagePlus className="w-6 h-6" />, 
      title: "Recent Stock-In", 
      value: "5", 
      subtitle: "products", 
      bg: "bg-gradient-to-br from-green-500 via-green-600 to-green-700", 
      text: "text-white",
      trend: "+8%",
      trendDirection: "up",
      change: "from yesterday",
      onClick: () => navigate('/admin/products?filter=stock-in'),
      description: "Products added to inventory recently"
    },
    { 
      icon: <PackageMinus className="w-6 h-6" />, 
      title: "Recent Stock-Out", 
      value: "3", 
      subtitle: "products", 
      bg: "bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600", 
      text: "text-white",
      trend: "-2%",
      trendDirection: "down",
      change: "from yesterday",
      onClick: () => navigate('/admin/products?filter=stock-out'),
      description: "Products that went out of stock"
    },
  ];

  const displayCards = cards && cards.length > 0 ? cards : sampleCards;

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`rounded-2xl shadow-lg border overflow-hidden ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                  <div className={`w-16 h-4 rounded ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                </div>
                <div className="space-y-2">
                  <div className={`w-24 h-4 rounded ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                  <div className={`w-16 h-8 rounded ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                  <div className={`w-20 h-3 rounded ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                </div>
                <div className={`pt-2 border-t ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className={`w-20 h-3 rounded ${
                      isDark ? 'bg-gray-600' : 'bg-gray-300'
                    }`}></div>
                    <div className={`w-16 h-3 rounded ${
                      isDark ? 'bg-gray-600' : 'bg-gray-300'
                    }`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Key Metrics
        </h3>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 disabled:opacity-50 hover:cursor-pointer ${
              isDark 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {displayCards.map((card, idx) => (
          <div 
            key={idx} 
            className={`${card.bg} ${card.text} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group cursor-pointer relative overflow-hidden`}
            onClick={card.onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.onClick();
              }
            }}
            aria-label={`${card.title}: ${card.value} ${card.subtitle}. ${card.description || ''}`}
          >
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="relative p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {card.trendDirection === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-200" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-200" />
                    )}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      card.trendDirection === "up" 
                        ? "bg-green-500/30 text-green-100" 
                        : "bg-red-500/30 text-red-100"
                    }`}>
                      {card.trend}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">
                    {card.title}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
                      {card.value}
                    </p>
                    <p className="text-xs opacity-80 font-medium uppercase tracking-wide">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-75 font-medium">
                      {card.change}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold opacity-75 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus ring for accessibility */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/0 focus-within:ring-white/50 transition-all duration-200 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Quick Stats Summary */}
      <div className={`mt-6 p-4 rounded-xl border ${
        isDark 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className={`flex items-center justify-between text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span className="font-medium">Summary:</span>
          <div className="flex items-center gap-4">
            <span>Total Value: <span className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>$45,230</span></span>
            <span>Active Products: <span className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>1,213</span></span>
            <span>Categories: <span className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>24</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCards
