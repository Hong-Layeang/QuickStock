import { AlertTriangle, Bell, Package, Clock } from "lucide-react";

const iconMap = {
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Bell className="w-5 h-5 text-blue-500" />,
  stock: <Package className="w-5 h-5 text-red-500" />,
  time: <Clock className="w-5 h-5 text-purple-500" />,
};

const DashboardAlerts = ({ alerts, loading, error }) => {
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
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center text-red-600 dark:text-red-400 font-semibold rounded-xl bg-red-50 dark:bg-red-900/20 p-4">
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {iconMap[alert.type] || iconMap.info}
                <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">{alert.message}</span>
              </div>
              {alert.actionText && (
                <button
                  className="ml-4 text-xs font-semibold text-yellow-700 dark:text-yellow-300 underline hover:opacity-80 transition"
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