import { TrendingUp, DollarSign, Package, BarChart3 } from "lucide-react"

const TransactionSummary = ({ metrics }) => {
  const sampleMetrics = [
    { 
      label: "Total Sales (Today)", 
      value: "$1,240", 
      change: "+12%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    { 
      label: "Total Sales (This Week)", 
      value: "$9,880", 
      change: "+8%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    { 
      label: "Best-Selling Product", 
      value: "Mouse", 
      change: "Wireless Pro",
      icon: <Package className="w-5 h-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    },
    { 
      label: "Total Items Sold (This Week)", 
      value: "340 units", 
      change: "+15%",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
  ];
  const displayMetrics = metrics && metrics.length > 0 ? metrics : sampleMetrics;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Summary</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sales and performance metrics</p>
            </div>
          </div>
          <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors">
            View Details
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayMetrics.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${item.bgColor}`}>
                          <div className={item.color}>
                            {item.icon}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
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
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${item.bgColor}`}>
                    <div className={item.color}>
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.color} bg-opacity-10`}>
                  {item.change}
                </span>
              </div>
              
              <div className="pl-11">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$11,120</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">+10.5%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">vs last week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionSummary
