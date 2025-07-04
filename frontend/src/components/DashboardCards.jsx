import { Boxes, PackagePlus, CircleAlert, PackageMinus, TrendingUp, TrendingDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

const DashboardCards = ({ cards }) => {
  const navigate = useNavigate();
  const sampleCards = [
    { 
      icon: <Boxes className="w-6 h-6" />, 
      title: "Total Products", 
      value: "1,245", 
      subtitle: "products", 
      bg: "bg-gradient-to-br from-blue-500 to-blue-600", 
      text: "text-white",
      trend: "+12%",
      trendDirection: "up",
      change: "from last month",
      onClick: () => navigate('/admin/products')
    },
    { 
      icon: <CircleAlert className="w-6 h-6" />, 
      title: "Low in Stock", 
      value: "32", 
      subtitle: "items", 
      bg: "bg-gradient-to-br from-red-500 to-red-600", 
      text: "text-white",
      trend: "+5%",
      trendDirection: "up",
      change: "from last week",
      onClick: () => navigate('/admin/products?filter=low-stock')
    },
    { 
      icon: <PackagePlus className="w-6 h-6" />, 
      title: "Recent Stock-In", 
      value: "5", 
      subtitle: "products", 
      bg: "bg-gradient-to-br from-green-500 to-green-600", 
      text: "text-white",
      trend: "+8%",
      trendDirection: "up",
      change: "from yesterday",
      onClick: () => navigate('/admin/products?filter=stock-in')
    },
    { 
      icon: <PackageMinus className="w-6 h-6" />, 
      title: "Recent Stock-Out", 
      value: "3", 
      subtitle: "products", 
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600", 
      text: "text-white",
      trend: "-2%",
      trendDirection: "down",
      change: "from yesterday",
      onClick: () => navigate('/admin/products?filter=stock-out')
    },
  ];
  const displayCards = cards && cards.length > 0 ? cards : sampleCards;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {displayCards.map((card, idx) => (
        <div 
          key={idx} 
          className={`${card.bg} ${card.text} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer`}
        >
          <div className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  {card.icon}
                </div>
                <div className="flex items-center gap-1">
                  {card.trendDirection === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium opacity-90">
                    {card.trend}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium opacity-90">{card.title}</h3>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{card.value}</p>
                  <p className="text-xs opacity-80">{card.subtitle}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-75">{card.change}</span>
                  <button
                    className="text-xs underline opacity-75 hover:opacity-100 transition-opacity font-medium"
                    onClick={card.onClick}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards
