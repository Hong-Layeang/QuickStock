import AdminLayout from "../../components/admin/AdminLayout.jsx"
import useThemeStore from "../../stores/useThemeStore.js";
import useReportStore from "../../stores/useReportStore.js";
import { useEffect, useState, useRef } from "react";
import { FiSearch, FiCalendar, FiX } from "react-icons/fi";

export default function Reports() {
  const { isDark } = useThemeStore();
  const { reports, loading, error, fetchAdminReports } = useReportStore();
  // Status counts for badges
  const completedCount = reports.filter(r => r.status === 'completed').length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const rejectedCount = reports.filter(r => r.status === 'rejected').length;
  // Print function
  const handlePrint = () => {
    window.print();
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  // Filtered and sorted reports: newest first (matches dashboard logic)
  const filteredReports = reports
    .filter((report) => {
      const matchesSearch =
        report.productName?.toLowerCase().includes(search.toLowerCase()) ||
        report.supplierName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? report.status === statusFilter : true;
      const reportDate = new Date(report.createdAt);
      const matchesDateFrom = dateFrom ? reportDate >= new Date(dateFrom) : true;
      const matchesDateTo = dateTo ? reportDate <= new Date(dateTo + 'T23:59:59') : true;
      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setDateDropdownOpen(false);
      }
    }
    if (dateDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dateDropdownOpen]);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-4">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Reports</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage all reports submitted by suppliers.</p>
            {/* Status summary badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
              }`}>
                Completed: {completedCount}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
              }`}>
                Pending: {pendingCount}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
              }`}>
                Rejected: {rejectedCount}
              </span>
            </div>
          </div>
          <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition-all cursor-pointer print:hidden">Print Report</button>
        </div>
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 mb-4 items-center">
          {/* Search input with icon */}
          <div className="relative w-full md:w-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <FiSearch size={22} />
            </span>
            <input
              type="text"
              placeholder="Search products, orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`pl-12 pr-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              style={{ minWidth: 260 }}
            />
          </div>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            style={{ minWidth: 200 }}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          {/* Date filter dropdown button (custom) */}
          <div className="relative" ref={dateDropdownRef}>
            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              onClick={() => setDateDropdownOpen((open) => !open)}
            >
              <FiCalendar size={20} className="cursor-pointer" />
              <span>
                {dateFrom && dateTo
                  ? `${dateFrom} to ${dateTo}`
                  : dateFrom
                  ? `From ${dateFrom}`
                  : dateTo
                  ? `To ${dateTo}`
                  : 'Date Filter'}
              </span>
            </button>
            {dateDropdownOpen && (
              <div className={`absolute z-20 mt-2 p-4 rounded-xl shadow-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} style={{ minWidth: 260 }}>
                <div className="flex flex-col gap-2">
                  <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                  <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Reset date filter button */}
          {(dateFrom || dateTo) && (
            <button
              type="button"
              className="ml-2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all duration-200 cursor-pointer"
              title="Reset date filter"
              onClick={() => { setDateFrom(""); setDateTo(""); }}
            >
              <FiX size={18} />
            </button>
          )}
        </div>
        {loading && <div className="mt-4 text-orange-500">Loading reports...</div>}
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto mt-6">
            <table className={`min-w-full text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              <thead>
                <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Supplier Name</th>
                  <th className="px-4 py-2 text-left">Product Name</th>
                  <th className="px-4 py-2 text-left md:px-1">Quantity</th>
                  <th className="px-4 py-2 text-left">Total Price</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">No reports found.</td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-orange-50'}>
                      <td className="px-4 py-2 text-left">{new Date(report.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2 text-left">{report.supplierName}</td>
                      <td className="px-4 py-2 text-left">{report.productName}</td>
                      <td className="px-4 py-2 text-left">{report.quantity}</td>
                      <td className="px-4 py-2 text-left">${report.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 text-left">{report.status}</td>
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