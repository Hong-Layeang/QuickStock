import { TrendingUp, DollarSign, Package, BarChart3, ClipboardList, Star, UserCheck, Layers, Users } from "lucide-react"
import useThemeStore from '../stores/useThemeStore'

const TransactionSummary = ({ metrics }) => {
  const { isDark } = useThemeStore();

  // Icon mapping for dynamic icons
  const getIcon = (iconName) => {
    const iconMap = {
      'package': <Package className="w-5 h-5" />,
      'trending-up': <TrendingUp className="w-5 h-5" />,
      'dollar-sign': <DollarSign className="w-5 h-5" />,
      'bar-chart-3': <BarChart3 className="w-5 h-5" />,
      'clipboard-list': <ClipboardList className="w-5 h-5" />,
      'star': <Star className="w-5 h-5" />,
      'user-check': <UserCheck className="w-5 h-5" />,
      'layers': <Layers className="w-5 h-5" />,
      'users': <Users className="w-5 h-5" />,
    };
    return iconMap[iconName] || <Package className="w-5 h-5" />;
  };

  // Show message if no metrics data or error
  if ((!metrics || metrics.length === 0)) {
    // Fallback: show empty
    metrics = [];
  }

  // Find total inventory value metric (for bottom display)
  const totalValueMetric = metrics.find(m => m.label === 'Total Inventory Value');

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
          <button className={`text-sm font-medium transition-colors hover:cursor-pointer ${
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
                  <th className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Metric
                  </th>
                  <th className={`py-3 text-center text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {metrics.filter(m => m.label !== 'Total Inventory Value').map((item, i) => (
                  <tr key={i} className={`transition-colors ${
                    isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}>
                    <td className="py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${item.bgColor}`}>
                          <div className={item.color}>
                            {getIcon(item.icon)}
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`text-sm font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-6">
          {metrics.filter(m => m.label !== 'Total Inventory Value').map((item, i) => (
            <div key={i} className={`border rounded-xl p-6 transition-colors mt-2 ${
              isDark 
                ? 'border-gray-700 bg-gray-800 hover:bg-gray-700/50' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${item.bgColor}`}>
                    <div className={item.color}>
                      {getIcon(item.icon)}
                    </div>
                  </div>
                  <span className={`text-base font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </div>
              <div className="pl-11 text-center">
                <span className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Inventory Value at the bottom */}
        {totalValueMetric && (
          <div className={`mt-8 pt-6 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col items-center justify-center">
              <p className={`text-lg font-medium mb-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Value</p>
              <p className="text-3xl font-extrabold text-green-500">{totalValueMetric.value}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionSummary
