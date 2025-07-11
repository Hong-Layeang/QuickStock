import { Clock, User, Activity } from "lucide-react"
import useThemeStore from '../stores/useThemeStore'

const ActivityTable = ({ activities }) => {
  const { isDark } = useThemeStore();
  const sampleActivities = [
    {
      date: "2025-05-17 10:45AM",
      activity: "Stocked In Keyboard (20 pcs)",
      by: "Admin (Alice)",
      type: "stock-in",
      status: "completed"
    },
    {
      date: "2025-05-17 09:30AM",
      activity: "Deleted Old Printer",
      by: "Admin (Bob)",
      type: "delete",
      status: "completed"
    },
    {
      date: "2025-05-17 08:15AM",
      activity: "Updated Product Price",
      by: "Supplier (John)",
      type: "update",
      status: "completed"
    },
    {
      date: "2025-05-16 16:20PM",
      activity: "Low Stock Alert - Mouse",
      by: "System",
      type: "alert",
      status: "pending"
    },
    {
      date: "2025-05-16 14:10PM",
      activity: "New Order Received",
      by: "Customer Portal",
      type: "order",
      status: "completed"
    }
  ];
  const displayActivities = activities && activities.length > 0 ? activities : sampleActivities;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'stock-in':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'delete':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      case 'update':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      case 'alert':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
      case 'order':
        return <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    }
  }

  const getStatusColor = (status) => {
    return status === 'completed' ? 'text-green-600' : 'text-yellow-600'
  }

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
              isDark ? 'bg-orange-900/20' : 'bg-orange-100'
            }`}>
              <Activity className={`w-5 h-5 ${
                isDark ? 'text-orange-400' : 'text-orange-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Recent Activities</h2>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Latest inventory activities</p>
            </div>
          </div>
          <button className={`text-sm font-medium transition-colors ${
            isDark 
              ? 'text-orange-400 hover:text-orange-300' 
              : 'text-orange-600 hover:text-orange-700'
          }`}>
            View All
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
                    Activity
                  </th>
                  <th className={`py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Performed By
                  </th>
                  <th className={`py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Date/Time
                  </th>
                  <th className={`py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {displayActivities.map((item, i) => (
                  <tr key={i} className={`transition-colors ${
                    isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {getActivityIcon(item.type)}
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.activity}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{item.by}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{item.date}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
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
          {displayActivities.map((item, i) => (
            <div key={i} className={`border rounded-xl p-4 transition-colors ${
              isDark 
                ? 'border-gray-700 hover:bg-gray-700/50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getActivityIcon(item.type)}
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.activity}
                  </span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <User className="w-4 h-4" />
                  <span>{item.by}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActivityTable
