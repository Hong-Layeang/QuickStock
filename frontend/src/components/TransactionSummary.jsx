import { TrendingUp, DollarSign, Package, BarChart3 } from "lucide-react"
import useThemeStore from '../stores/useThemeStore'

const TransactionSummary = ({ metrics }) => {
  const { isDark } = useThemeStore();
  const sampleMetrics = [
    { 
      label: "Total Sales (Today)", 
      value: "$1,240", 
      change: "+12%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: isDark ? "bg-green-900/20" : "bg-green-100"
    },
    { 
      label: "Total Sales (This Week)", 
      value: "$9,880", 
      change: "+8%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: isDark ? "bg-blue-900/20" : "bg-blue-100"
    },
    { 
      label: "Best-Selling Product", 
      value: "Mouse", 
      change: "Wireless Pro",
      icon: <Package className="w-5 h-5" />,
      color: "text-orange-600",
      bgColor: isDark ? "bg-orange-900/20" : "bg-orange-100"
    },
    { 
      label: "Total Items Sold (This Week)", 
      value: "340 units", 
      change: "+15%",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: isDark ? "bg-purple-900/20" : "bg-purple-100"
    },
  ];
  const displayMetrics = metrics && metrics.length > 0 ? metrics : sampleMetrics;

  return (
    <div className={`rounded-2xl shadow-sm border ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isDark ? 'bg-green-900/20' : 'bg-green-100'
            }`}>
              <TrendingUp className={`w-5 h-5 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Transaction Summary</h2>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Sales and performance metrics</p>
            </div>
          </div>
          <button className={`text-sm font-medium transition-colors ${
            isDark 
              ? 'text-green-400 hover:text-green-300' 
              : 'text-green-600 hover:text-green-700'
          }`}>
            View Details
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <th className={`py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Metric
                  </th>
                  <th className={`py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Value
                  </th>
                  <th className={`py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {displayMetrics.map((item, i) => (
                  <tr key={i} className={`transition-colors ${
                    isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${item.bgColor}`}>
                          <div className={item.color}>
                            {item.icon}
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-sm font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.value}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color} bg-opacity-10`}>
                        {item.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {displayMetrics.map((item, i) => (
            <div key={i} className={`border rounded-xl p-4 transition-colors ${
              isDark 
                ? 'border-gray-700 hover:bg-gray-700/50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${item.bgColor}`}>
                    <div className={item.color}>
                      {item.icon}
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.color} bg-opacity-10`}>
                  {item.change}
                </span>
              </div>
              
              <div className="pl-11">
                <span className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className={`mt-6 pt-6 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Revenue</p>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>$11,120</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>+10.5%</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>vs last week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionSummary
