
import maleImg from "../../assets/male.png";
import femaleImg from "../../assets/female.png";
import otherImg from "../../assets/other.png";
import { useState, useEffect } from "react";
import useThemeStore from "../../stores/useThemeStore.js";
import useUserStore from "../../stores/useUserStore.js";
import useProductStore from "../../stores/useProductStore.js";
import useReportStore from "../../stores/useReportStore.js";
import AdminLayout from "../../components/admin/AdminLayout.jsx";

const genderImages = {
  male: maleImg,
  female: femaleImg,
  other: otherImg,
};


export default function Suppliers() {
  const { isDark } = useThemeStore();
  const { users, fetchUsers, loading: loadingUsers } = useUserStore();
  const { products, fetchProducts, loading: loadingProducts } = useProductStore();
  const { reports, fetchAdminReports, loading: loadingReports } = useReportStore();
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); fetchProducts(); fetchAdminReports(); }, [fetchUsers, fetchProducts, fetchAdminReports]);

  // Filter suppliers only
  const allSuppliers = users.filter(u => u.role === 'supplier');

  // Apply search filter
  const suppliers = allSuppliers.filter(supplier =>
    (supplier.name?.toLowerCase().includes(search.toLowerCase()) ||
     supplier.username?.toLowerCase().includes(search.toLowerCase()) ||
     supplier.email?.toLowerCase().includes(search.toLowerCase()) ||
     supplier.phone?.toLowerCase().includes(search.toLowerCase()))
  );

  // Aggregate real performance data
  const supplierPerformance = suppliers.map(supplier => {
    // Products listed by this supplier
    const supplierProducts = products.filter(p => p.supplierId === supplier.id);
    // Reports for this supplier's products
    const supplierProductIds = supplierProducts.map(p => p.id);
    const supplierReports = reports.filter(r => supplierProductIds.includes(r.productId) && r.status === 'completed');
    // Total sales (sum of quantity)
    const totalSales = supplierReports.reduce((sum, r) => sum + (r.quantity || 0), 0);
    // (Optional) Average rating if available
    // const avgRating = ...
    return {
      id: supplier.id,
      sales: totalSales,
      products: supplierProducts.length,
      // rating: avgRating || (Math.random() * 2 + 3).toFixed(2), // fallback if no rating
    };
  });

  // Sort suppliers by sales descending
  const sortedSuppliers = [...suppliers].sort((a, b) => {
    const perfA = supplierPerformance.find(p => p.id === a.id)?.sales || 0;
    const perfB = supplierPerformance.find(p => p.id === b.id)?.sales || 0;
    return perfB - perfA;
  });
  
  // Get top 3 supplier rankings
  const getSupplierRank = (supplierId) => {
    const index = sortedSuppliers.findIndex(s => s.id === supplierId);
    return index >= 0 && index < 3 ? index + 1 : null;
  };

  // Ranking badge colors and styles
  const getRankingBadge = (rank) => {
    if (!rank) return null;
    const badges = {
      1: { emoji: '🏆', text: '#1', color: 'bg-yellow-400 text-yellow-900', ring: 'ring-yellow-300' },
      2: { emoji: '🥈', text: '#2', color: 'bg-gray-300 text-gray-800', ring: 'ring-gray-200' },
      3: { emoji: '🥉', text: '#3', color: 'bg-orange-300 text-orange-900', ring: 'ring-orange-200' }
    };
    return badges[rank];
  };

  // Avatar skin logic with ranking
  const getAvatarBorder = (id) => {
    const rank = getSupplierRank(id);
    if (rank === 1) return 'border-4 border-yellow-400 shadow-lg ring-4 ring-yellow-300 animate-pulse';
    if (rank === 2) return 'border-4 border-gray-400 shadow-lg ring-4 ring-gray-300';
    if (rank === 3) return 'border-4 border-orange-400 shadow-lg ring-4 ring-orange-300';
    return 'border-4 border-orange-400 shadow';
  };

  // Skeleton loader
  const skeletons = Array(4).fill(0);

  return (
    <AdminLayout>
      <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-orange-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className={`text-2xl font-extrabold mb-1 tracking-tight ${
              isDark ? 'text-yellow-300 drop-shadow' : 'text-orange-600 drop-shadow'
            }`}>Suppliers</h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Manage all suppliers here.</p>
            {/* Badge for total suppliers */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-orange-900 text-orange-100' : 'bg-orange-200 text-orange-700'
              }`}>
                Total Suppliers: {allSuppliers.length}
              </span>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              placeholder="Search suppliers by name, email, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full sm:w-64 px-4 py-2 rounded-xl font-semibold bg-transparent border-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder:font-semibold ${
                isDark 
                  ? 'border-gray-700 bg-gray-900 text-white placeholder:text-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
              }`}
              style={{ minWidth: 0 }}
            />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {loadingUsers || loadingProducts || loadingReports ? (
            skeletons.map((_, i) => (
              <div key={i} className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center animate-pulse ${
                isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 sm:mb-4 bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700 mb-2" />
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-800 mb-1" />
                <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-800 mb-1" />
                <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ))
          ) : suppliers.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              {search ? `No suppliers found matching "${search}".` : 'No suppliers found.'}
            </div>
          ) : sortedSuppliers.map(supplier => {
            const imgSrc = genderImages[supplier.gender?.toLowerCase()] || genderImages.other;
            const perf = supplierPerformance.find(p => p.id === supplier.id) || { sales: 0, products: 0 };
            const rank = getSupplierRank(supplier.id);
            const rankBadge = getRankingBadge(rank);
            return (
              <div
                key={supplier.id}
                className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center transition-all hover:shadow-xl cursor-pointer group relative ${
                  isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-orange-200'
                } ${rank && rank <= 3 ? `ring-2 ${rankBadge.ring}` : ''}`}
                onClick={() => setSelectedSupplier({ ...supplier, ...perf, rank })}
                title={rank ? `Rank #${rank} Supplier` : 'Supplier'}
                style={{ transition: 'box-shadow 0.2s, border-color 0.2s' }}
              >
                {/* Ranking Badge in top-right corner */}
                {rankBadge && (
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${rankBadge.color} animate-bounce`}>
                    {rankBadge.text}
                  </div>
                )}
                <img
                  src={imgSrc}
                  alt={supplier.gender || 'profile'}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-3 sm:mb-4 ${getAvatarBorder(supplier.id)}`}
                  style={{ background: isDark ? '#222' : '#eee' }}
                />
                <div className={`text-base sm:text-lg font-bold mb-1 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{supplier.username || supplier.name}</div>
                <div className={`text-xs sm:text-sm mb-1 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{supplier.email}</div>
                <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{supplier.position || 'Supplier'}</div>
                {supplier.phone && (
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{supplier.phone}</div>
                )}
                {/* Quick badges for sales and products */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold shadow ${isDark ? 'bg-yellow-700 text-yellow-100' : 'bg-orange-200 text-orange-700'}`}>
                    Sales: {perf.sales}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold shadow ${isDark ? 'bg-yellow-700 text-yellow-100' : 'bg-orange-200 text-orange-700'}`}>
                    Products: {perf.products}
                  </span>
                </div>
                {/* Ranking Badge at bottom */}
                {rankBadge && (
                  <span className={`mt-4 px-3 py-1 rounded-full text-xs font-bold shadow-md ${rankBadge.color} flex items-center gap-1 animate-pulse`}>
                    {rankBadge.emoji} Top {rank}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Supplier Performance Popup */}
        {selectedSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedSupplier(null)}>
            <div
              className={`p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg space-y-6 relative border-2 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-yellow-700' : 'bg-gradient-to-br from-yellow-50 via-white to-orange-100 border-orange-300'}`}
              onClick={e => e.stopPropagation()}
              style={{ transition: 'background 0.3s, border-color 0.3s' }}
            >
              <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold cursor-pointer transition-colors" onClick={() => setSelectedSupplier(null)}>&times;</button>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={genderImages[selectedSupplier.gender?.toLowerCase()] || genderImages.other}
                    alt={selectedSupplier.gender || 'profile'}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 ${getAvatarBorder(selectedSupplier.id)}`}
                    style={{ background: isDark ? '#222' : '#eee', borderWidth: 5, borderStyle: 'solid' }}
                  />
                  {/* Ranking badge on avatar */}
                  {selectedSupplier.rank && selectedSupplier.rank <= 3 && (
                    <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${getRankingBadge(selectedSupplier.rank).color}`}>
                      {getRankingBadge(selectedSupplier.rank).text}
                    </div>
                  )}
                </div>
                <div className={`text-xl sm:text-2xl font-extrabold mb-1 tracking-tight text-center ${isDark ? 'text-white' : 'text-orange-700'}`}>{selectedSupplier.username || selectedSupplier.name}</div>
                {/* Ranking title */}
                {selectedSupplier.rank && selectedSupplier.rank <= 3 && (
                  <div className={`text-lg font-bold mb-2 text-center ${selectedSupplier.rank === 1 ? 'text-yellow-400' : selectedSupplier.rank === 2 ? 'text-gray-400' : 'text-orange-400'}`}>
                    {getRankingBadge(selectedSupplier.rank).emoji} Rank #{selectedSupplier.rank} Supplier
                  </div>
                )}
                <div className={`text-sm mb-1 text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>{selectedSupplier.email}</div>
                <div className={`text-xs mb-2 ${isDark ? 'text-gray-100' : 'text-gray-500'}`}>{selectedSupplier.position || 'Supplier'}</div>
                {selectedSupplier.phone && (
                  <div className={`text-xs ${isDark ? 'text-gray-100' : 'text-gray-500'}`}>{selectedSupplier.phone}</div>
                )}
                {/* More details */}
                <div className="flex flex-wrap gap-2 mt-2 justify-center w-full">
                  {selectedSupplier.address && (
                    <span className={`px-2 py-1 rounded text-xs bg-opacity-30 ${isDark ? 'bg-yellow-800 text-yellow-100' : 'bg-orange-200 text-orange-700'}`}>{selectedSupplier.address}</span>
                  )}
                  {selectedSupplier.createdAt && (
                    <span className={`px-2 py-1 rounded text-xs bg-opacity-30 ${isDark ? 'bg-yellow-800 text-yellow-100' : 'bg-orange-200 text-orange-700'}`}>Joined: {new Date(selectedSupplier.createdAt).toLocaleDateString()}</span>
                  )}
                  {selectedSupplier.lastActivity && (
                    <span className={`px-2 py-1 rounded text-xs bg-opacity-30 ${isDark ? 'bg-yellow-800 text-yellow-100' : 'bg-orange-200 text-orange-700'}`}>Last Active: {new Date(selectedSupplier.lastActivity).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {/* Ranking display */}
                {selectedSupplier.rank && (
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Performance Rank:</span>
                    <span className={`font-mono text-lg font-bold flex items-center gap-2 ${selectedSupplier.rank === 1 ? 'text-yellow-400' : selectedSupplier.rank === 2 ? 'text-gray-400' : selectedSupplier.rank === 3 ? 'text-orange-400' : (isDark ? 'text-yellow-200' : 'text-orange-700')}`}>
                      {selectedSupplier.rank <= 3 && getRankingBadge(selectedSupplier.rank).emoji} #{selectedSupplier.rank}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Total Sales:</span>
                  <span className={`font-mono text-lg font-bold ${isDark ? 'text-yellow-200' : 'text-orange-700'}`}>{selectedSupplier.sales}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Products Listed:</span>
                  <span className={`font-mono text-lg font-bold ${isDark ? 'text-yellow-200' : 'text-orange-700'}`}>{selectedSupplier.products}</span>
                </div>
                {/* Enhanced visual bar for sales vs products */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className={isDark ? 'text-yellow-200' : 'text-orange-700'}>Sales</span>
                    <span className={isDark ? 'text-yellow-200' : 'text-orange-700'}>Products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 sm:h-5 rounded-full shadow-inner border-2 ${isDark ? 'bg-yellow-400/90 border-yellow-200' : 'bg-orange-400/90 border-orange-300'}`} style={{ width: `${Math.max(16, Math.min(100, (selectedSupplier.sales / (selectedSupplier.sales + selectedSupplier.products || 1)) * 100))}%`, minWidth: 16, transition: 'width 0.3s' }} />
                    <div className={`h-4 sm:h-5 rounded-full shadow-inner border-2 ${isDark ? 'bg-yellow-200/90 border-yellow-100' : 'bg-orange-200/90 border-orange-100'}`} style={{ width: `${Math.max(16, Math.min(100, (selectedSupplier.products / (selectedSupplier.sales + selectedSupplier.products || 1)) * 100))}%`, minWidth: 16, transition: 'width 0.3s' }} />
                  </div>
                </div>
                {/* Ranking celebration */}
                {selectedSupplier.rank && selectedSupplier.rank <= 3 && (
                  <div className="mt-6 text-center">
                    <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm sm:text-lg shadow animate-bounce ${getRankingBadge(selectedSupplier.rank).color} flex items-center gap-2 justify-center`}>
                      {getRankingBadge(selectedSupplier.rank).emoji} 
                      {selectedSupplier.rank === 1 ? 'Top Performer!' : 
                       selectedSupplier.rank === 2 ? 'Second Place!' : 
                       'Third Place!'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}