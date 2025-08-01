import AdminLayout from "../../components/admin/AdminLayout.jsx"
import useThemeStore from "../../stores/useThemeStore.js";
import useReportStore from "../../stores/useReportStore.js";
import useUserStore from "../../stores/useUserStore.js";
import { useEffect, useState, useRef } from "react";
import { FiSearch, FiCalendar, FiX } from "react-icons/fi";

export default function Reports() {
  const { isDark } = useThemeStore();
  const { reports, loading, error, fetchAdminReports } = useReportStore();
  const { users, fetchUsers } = useUserStore();
  
  // Status counts for badges
  const completedCount = reports.filter(r => r.status === 'completed').length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const rejectedCount = reports.filter(r => r.status === 'rejected').length;
  
  // Get unique suppliers from users with supplier role
  const suppliers = users.filter(user => user.role === 'supplier');
  
  // Print function
  const handlePrint = () => {
    window.print();
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
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
      const matchesSupplier = supplierFilter ? 
        (report.supplierName === supplierFilter) : true;
      const reportDate = new Date(report.createdAt);
      const matchesDateFrom = dateFrom ? reportDate >= new Date(dateFrom) : true;
      const matchesDateTo = dateTo ? reportDate <= new Date(dateTo + 'T23:59:59') : true;
      return matchesSearch && matchesStatus && matchesSupplier && matchesDateFrom && matchesDateTo;
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
    fetchUsers();
  }, [fetchAdminReports, fetchUsers]);

  return (
    <AdminLayout>
      <div className={`rounded-2xl p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex-1">
            <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Reports</h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage all reports submitted by suppliers.</p>
            {/* Status summary badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
              }`}>
                Completed: {completedCount}
              </span>
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
              }`}>
                Pending: {pendingCount}
              </span>
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
              }`}>
                Rejected: {rejectedCount}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button onClick={handlePrint} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-5 py-2 rounded-xl shadow transition-all cursor-pointer print:hidden text-sm sm:text-base">
              Print Report
            </button>
          </div>
        </div>
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-4 mb-6">
          {/* Search input with icon */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <FiSearch size={18} className="sm:w-5 sm:h-5" />
            </span>
            <input
              type="text"
              placeholder="Search products, orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            />
          </div>
          
          {/* Status filter */}
          <div className="lg:col-span-1">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          {/* Supplier filter */}
          <div className="lg:col-span-1">
            <select
              value={supplierFilter}
              onChange={e => setSupplierFilter(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            >
              <option value="">All Suppliers</option>
              {suppliers.length > 0 ? suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.name}>
                  {supplier.name}
                </option>
              )) : (
                <option disabled>No suppliers found</option>
              )}
            </select>
          </div>
          
          {/* Date filter dropdown button (custom) */}
          <div className="relative lg:col-span-1" ref={dateDropdownRef}>
            <button
              type="button"
              className={`w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              onClick={() => setDateDropdownOpen((open) => !open)}
            >
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <FiCalendar size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate text-xs sm:text-sm">
                  {dateFrom && dateTo
                    ? `${dateFrom} - ${dateTo}`
                    : dateFrom
                    ? `From ${dateFrom}`
                    : dateTo
                    ? `To ${dateTo}`
                    : 'Date Filter'}
                </span>
              </div>
            </button>
            {dateDropdownOpen && (
              <div className={`absolute z-20 mt-2 p-3 sm:p-4 rounded-xl shadow-lg border min-w-full sm:min-w-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                      className={`w-full px-2 sm:px-3 py-1 sm:py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 text-sm ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                      className={`w-full px-2 sm:px-3 py-1 sm:py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 text-sm ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Reset date filter button */}
          {(dateFrom || dateTo) && (
            <div className="flex justify-end sm:justify-start lg:col-span-1">
              <button
                type="button"
                className="p-2 sm:p-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all duration-200 cursor-pointer"
                title="Reset date filter"
                onClick={() => { setDateFrom(""); setDateTo(""); }}
              >
                <FiX size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
        {loading && <div className="mt-4 text-orange-500">Loading reports...</div>}
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto mt-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <table className={`min-w-full text-xs sm:text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              <thead>
                <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                  <th className="px-3 sm:px-4 py-3 text-left font-medium w-40">Date</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-medium w-35">Supplier</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-medium w-0">Product</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-medium w-16">Qty</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-medium w-20">Price</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-medium w-20">Payment</th>
                  <th className="px-3 sm:px-4 py-3 text-left font-medium w-20">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      <div className="flex flex-col items-center">
                        <div className="text-base sm:text-lg font-medium">No reports found</div>
                        <div className="text-xs sm:text-sm mt-1">Try adjusting your filters</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className={`border-t ${isDark ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-orange-50 border-gray-200'}`}>
                      <td className="px-3 sm:px-4 py-3 w-40">
                        <div className="text-xs sm:text-sm text-left">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        <div className={`text-xs text-left ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 w-35">
                        <div className="text-xs sm:text-sm font-medium truncate text-left">
                          {report.supplierName || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 w-0">
                        <div className="text-xs sm:text-sm truncate text-left">
                          {report.productName || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm w-16 text-left">
                        {report.quantity || 0}
                      </td>
                      <td className="px-3 sm:px-4 py-3 w-20 text-left">
                        <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                          ${report.totalPrice?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 w-20">
                        <span className={`text-xs capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {report.paymentMethod === 'qr' ? 'QR' : 'Cash'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 w-20 text-left">
                        <span className={`inline-block px-1 py-1 rounded text-xs font-medium ${
                          report.status === 'completed'
                            ? isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                            : report.status === 'pending'
                            ? isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                            : isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
                        }`}>
                          {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                        </span>
                      </td>
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