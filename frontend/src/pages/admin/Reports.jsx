import AdminLayout from "../../components/admin/AdminLayout.jsx"
import useThemeStore from "../../stores/useThemeStore.js";
import useReportStore from "../../stores/useReportStore.js";
import { useEffect } from "react";

export default function Reports() {
  const { isDark } = useThemeStore();
  const { reports, loading, error, fetchAdminReports } = useReportStore();

  useEffect(() => {
    fetchAdminReports();
  }, [fetchAdminReports]);

  return (
    <AdminLayout>
      <div className={`rounded-2xl p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Reports</h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage all reports submitted by suppliers.</p>
        {loading && <div className="mt-4 text-orange-500">Loading reports...</div>}
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto mt-6">
            <table className={`min-w-full text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              <thead>
                <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Supplier ID</th>
                  <th className="px-4 py-2 text-left">Product ID</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Total Price</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">No reports found.</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-orange-50'}>
                      <td className="px-4 py-2">{new Date(report.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2">{report.userId}</td>
                      <td className="px-4 py-2">{report.productId}</td>
                      <td className="px-4 py-2">{report.quantity}</td>
                      <td className="px-4 py-2">${report.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-2">{report.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 