import { Clock, User, Activity } from "lucide-react"
import useThemeStore from '../stores/useThemeStore'

const ActivityTable = ({ activities }) => {
  const { isDark } = useThemeStore();

  const getActivityIcon = (type) => {
    // Use blue for admin, green for supplier, gray for others
    if (type === 'admin') {
      return <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>;
    } else if (type === 'supplier') {
      return <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>;
    } else {
      return <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>;
    }
  }

  const getStatusColor = (status) => {
    return status === 'completed' ? 'text-green-600' : 'text-yellow-600'
  }

  // Show message if no activities data
  if (!activities || activities.length === 0) {
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
          </div>
          <div className={`p-8 text-center rounded-xl border ${
            isDark 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No recent activities.
            </p>
          </div>
        </div>
      </div>
    );
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
          <button className={`text-sm font-medium transition-colors hover:cursor-pointer ${
            isDark 
              ? 'text-orange-400 hover:text-orange-300' 
              : 'text-orange-600 hover:text-orange-700'
          }`}>
            View All
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
            <table className="w-full table-auto">
              <thead>
                <tr className={`border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <th className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Activity
                  </th>
                  <th className={`py-3 text-center text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Performed By
                  </th>
                  <th className={`py-3 text-center text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Date/Time
                  </th>
                  <th className={`py-3 text-center text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {activities.slice(0, 9).map((item, i) => (
                  <tr key={i} className={`transition-colors ${
                    isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}>
                    <td className="py-5 px-4 text-left align-middle max-w-xl truncate">
                      <div className="flex items-center gap-3 min-w-0">
                        {getActivityIcon(item.type)}
                        <span
                          className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                          } truncate max-w-xl`}
                          title={item.activity}
                          style={{ display: 'inline-block', maxWidth: '24ch', verticalAlign: 'middle' }}
                        >
                          {item.activity}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>{item.by}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {new Date(item.date).toLocaleString(undefined, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-6">
          {activities.map((item, i) => (
            <div key={i} className={`border rounded-xl p-6 shadow-sm transition-colors mt-2 ${
              isDark 
                ? 'border-gray-700 bg-gray-800 hover:bg-gray-700/50' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  {getActivityIcon(item.type)}
                  <span
                    className={`text-base font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                    } truncate max-w-[12rem]`}
                    title={item.activity}
                    style={{ display: 'inline-block', maxWidth: '12rem', verticalAlign: 'bottom' }}
                  >
                    {item.activity}
                  </span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="space-y-2 pl-7">
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
                  <span>
                    {new Date(item.date).toLocaleString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </span>
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
