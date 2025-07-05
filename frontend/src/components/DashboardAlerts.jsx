import { AlertTriangle, Bell, Package, Clock } from "lucide-react";
import useThemeStore from '../store/useThemeStore';

const iconMap = {
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Bell className="w-5 h-5 text-blue-500" />,
  stock: <Package className="w-5 h-5 text-red-500" />,
  time: <Clock className="w-5 h-5 text-purple-500" />,
};

const DashboardAlerts = ({ alerts, loading, error }) => {
  const { isDark } = useThemeStore();
  const sampleAlerts = [
    {
      type: "stock",
      message: "12 products are low in stock.",
      actionText: "View",
      onAction: () => window.location.href = "/admin/products?filter=low-stock"
    },
    {
      type: "warning",
      message: "2 orders are pending approval.",
      actionText: "Review",
      onAction: () => window.location.href = "/admin/orders?filter=pending"
    },
    {
      type: "info",
      message: "Supplier registration requests pending.",
      actionText: "Manage",
      onAction: () => window.location.href = "/admin/suppliers?filter=pending"
    },
  ];

  const displayAlerts = alerts && alerts.length > 0 ? alerts : sampleAlerts;

  return (
    <div className="mb-6">
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => (
            <div key={i} className={`h-12 rounded-xl animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      ) : error ? (
        <div className={`flex items-center justify-center font-semibold rounded-xl p-4 ${
          isDark 
            ? 'text-red-400 bg-red-900/20' 
            : 'text-red-600 bg-red-50'
        }`}>
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between border rounded-xl px-4 py-3 shadow-sm ${
                isDark 
                  ? 'bg-yellow-900/20 border-yellow-700' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {iconMap[alert.type] || iconMap.info}
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-100' : 'text-gray-800'
                }`}>{alert.message}</span>
              </div>
              {alert.actionText && (
                <button
                  className={`ml-4 text-xs font-semibold underline hover:opacity-80 transition hover:cursor-pointer ${
                    isDark ? 'text-yellow-300' : 'text-yellow-700'
                  }`}
                  onClick={alert.onAction}
                >
                  {alert.actionText}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAlerts; 