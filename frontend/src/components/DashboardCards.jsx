import { Boxes, PackagePlus, CircleAlert, PackageMinus, TrendingUp, TrendingDown, ArrowRight, RefreshCw, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import useThemeStore from '../stores/useThemeStore'

const DashboardCards = ({ cards, loading = false, onRefresh }) => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useThemeStore();

  // Icon mapping for dynamic icons
  const getIcon = (iconName) => {
    const iconMap = {
      'boxes': <Boxes className="w-6 h-6" />,
      'package-plus': <PackagePlus className="w-6 h-6" />,
      'circle-alert': <CircleAlert className="w-6 h-6" />,
      'package-minus': <PackageMinus className="w-6 h-6" />,
      'users': <Users className="w-6 h-6" />
    };
    return iconMap[iconName] || <Boxes className="w-6 h-6" />;
  };

  // Get theme-aware card styling
  const getCardStyling = (card) => {
    const baseClasses = "rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group cursor-pointer relative overflow-hidden";
    // If card.bg is provided by backend, use it directly
    if (card.bg) return `${baseClasses} ${card.bg} ${card.text || ''}`;
    // Otherwise, use themeStyles fallback
    const themeStyles = {
      'Total Products': {
        light: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white',
        dark: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white'
      },
      'Low in Stock': {
        light: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white',
        dark: 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600 text-white'
      },
      'Out of Stock': {
        light: 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white',
        dark: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white'
      },
      'Recent Products': {
        light: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white',
        dark: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white'
      }
    };
    const cardStyle = themeStyles[card.title] || themeStyles['Total Products'];
    const themeStyle = isDark ? cardStyle.dark : cardStyle.light;
    return `${baseClasses} ${themeStyle}`;
  };

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

  // Show loading state
  if (loading) {
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
      </div>
    );
  }

  // Show message if no cards data
  if (!cards || cards.length === 0) {
    // Fallback: show 4 cards with zero/default values
    const fallbackCards = [
      { icon: 'boxes', title: 'Total Products', value: '0', subtitle: 'products', trend: '0%', trendDirection: 'up', change: '', description: 'Total number of products in inventory' },
      { icon: 'circle-alert', title: 'Low in Stock', value: '0', subtitle: 'items', trend: '0%', trendDirection: 'up', change: '', description: 'Products that need restocking' },
      { icon: 'package-plus', title: 'Recent Products', value: '0', subtitle: 'products', trend: '0%', trendDirection: 'up', change: '', description: 'Products added recently' },
      { icon: 'users', title: 'Total Users', value: '0', subtitle: 'users', trend: '0%', trendDirection: 'up', change: '', description: 'Total registered users' }
    ];
    return (
      <div className="space-y-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {fallbackCards.map((card, i) => (
            <div key={i} className={getCardStyling(card)}>
              <div className="relative p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/20 rounded-xl">
                      {getIcon(card.icon)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-green-200" />
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/30 text-green-100">0%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-sm">{card.subtitle}</div>
                  </div>
                  <div className="pt-2 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-white/80">{card.description}</div>
                      <div className="text-xs text-white/80">{card.change}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className={getCardStyling(card)}
            onClick={() => {
              if (card.title === 'Low in Stock') {
                navigate('/supplier/my-products?filter=low-stock');
              } else if (card.title === 'Recent Products') {
                navigate('/supplier/my-products?filter=recent');
              } else if (card.title === 'In Stock') {
                navigate('/supplier/my-products?filter=in-stock');
              } else if (card.title === 'Out of Stock') {
                navigate('/supplier/my-products?filter=out-of-stock');
              } else {
                navigate(card.link || '/admin/dashboard');
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (card.title === 'Low in Stock') {
                  navigate('/supplier/my-products?filter=low-stock');
                } else if (card.title === 'Recent Products') {
                  navigate('/supplier/my-products?filter=recent');
                } else if (card.title === 'In Stock') {
                  navigate('/supplier/my-products?filter=in-stock');
                } else if (card.title === 'Out of Stock') {
                  navigate('/supplier/my-products?filter=out-of-stock');
                } else {
                  navigate(card.link || '/admin/dashboard');
                }
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
                    {getIcon(card.icon)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {card.trendDirection === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-200" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-200" />
                    )}
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/40 text-white shadow-sm">
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
      {/* REMOVED: The summary container below the four boxes */}
    </div>
  )
}

export default DashboardCards
