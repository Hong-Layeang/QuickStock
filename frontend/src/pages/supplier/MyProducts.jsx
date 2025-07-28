import SupplierLayout from "../../components/supplier/SupplierLayout.jsx";
import React, { useEffect, useState } from "react";
import useSupplierProductStore from "../../stores/useSupplierProductStore.js";
import useThemeStore from "../../stores/useThemeStore.js";
import ProductCard from "../../components/ProductCard.jsx";
import { useLocation, useNavigate } from "react-router-dom";

export default function MyProducts() {
  const { isDark } = useThemeStore();
  const { products, loading, error, fetchProducts, editProduct } = useSupplierProductStore();
  const [search, setSearch] = useState("");
  const [showStock, setShowStock] = useState(false);
  const [stockValue, setStockValue] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'

  const location = useLocation();
  const navigate = useNavigate();

  // Check for stock/recent filters in URL
  const params = new URLSearchParams(location.search);
  const lowStockFilter = params.get("filter") === "low-stock";
  const recentFilter = params.get("filter") === "recent";
  const inStockFilter = params.get("filter") === "in-stock";
  const outOfStockFilter = params.get("filter") === "out-of-stock";

  // For demo, show all products. In real app, filter by assigned supplier.
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  if (lowStockFilter) {
    filtered = filtered.filter(p => p.stock <= 2);
  } else if (recentFilter) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    filtered = filtered.filter(p => new Date(p.createdAt) >= sevenDaysAgo);
  } else if (inStockFilter) {
    filtered = filtered.filter(p => p.status === 'in stock');
  } else if (outOfStockFilter) {
    filtered = filtered.filter(p => p.status === 'out of stock');
  }

  useEffect(() => { fetchProducts(); }, []);

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    await editProduct(selected.id, { ...selected, stock: Number(stockValue) });
    setShowStock(false);
    setSelected(null);
  };

  return (
    <SupplierLayout>
      <div className={`rounded-2xl p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className={`text-2xl font-bold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>My Products</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>View and manage your assigned products here.</p>
          </div>
          <div className="flex gap-2 items-center mt-2 sm:mt-0">
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition border ${viewMode === 'table' ? (isDark ? 'bg-orange-600 text-white border-orange-700' : 'bg-orange-500 text-white border-orange-600') : (isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300')}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition border ${viewMode === 'card' ? (isDark ? 'bg-orange-600 text-white border-orange-700' : 'bg-orange-500 text-white border-orange-600') : (isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300')}`}
              onClick={() => setViewMode('card')}
            >
              Card View
            </button>
          </div>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full sm:w-64 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              isDark 
                ? 'border-gray-700 bg-gray-900 text-white' 
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}
          />
          {lowStockFilter && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm ml-0 sm:ml-4 mt-2 sm:mt-0">
              Showing only low stock (≤ 2)
              <button
                className="ml-2 px-2 py-0.5 rounded bg-orange-200 hover:bg-orange-300 text-orange-800 text-xs font-bold"
                onClick={() => navigate('/supplier/my-products')}
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
          {recentFilter && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm ml-0 sm:ml-4 mt-2 sm:mt-0">
              Showing only recent products (last 7 days)
              <button
                className="ml-2 px-2 py-0.5 rounded bg-blue-200 hover:bg-blue-300 text-blue-800 text-xs font-bold"
                onClick={() => navigate('/supplier/my-products')}
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
          {inStockFilter && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm ml-0 sm:ml-4 mt-2 sm:mt-0">
              Showing only in stock products
              <button
                className="ml-2 px-2 py-0.5 rounded bg-green-200 hover:bg-green-300 text-green-800 text-xs font-bold"
                onClick={() => navigate('/supplier/my-products')}
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
          {outOfStockFilter && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm ml-0 sm:ml-4 mt-2 sm:mt-0">
              Showing only out of stock products
              <button
                className="ml-2 px-2 py-0.5 rounded bg-red-200 hover:bg-red-300 text-red-800 text-xs font-bold"
                onClick={() => navigate('/supplier/my-products')}
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
        {loading && <div className="text-center py-8 text-orange-600 font-semibold">Loading...</div>}
        {error && <div className="text-center py-8 text-red-500 font-semibold">{error}</div>}
        {!loading && !error && (
          <>
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <th className="py-3 text-left font-semibold">Name</th>
                      <th className="py-3 text-left font-semibold">Category</th>
                      <th className="py-3 text-left font-semibold">Unit Price</th>
                      <th className="py-3 text-left font-semibold">Status</th>
                      <th className="py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-400">No products found.</td></tr>
                    ) : filtered.map((p) => (
                      <tr key={p.id} className={`border-b transition ${
                        isDark 
                          ? 'border-gray-800 hover:bg-gray-800/40' 
                          : 'border-gray-100 hover:bg-orange-50'
                      }`}>
                        <td className="py-3 font-medium">{p.name}</td>
                        <td className="py-3">{p.category}</td>
                        <td className="py-3">${p.unitprice.toFixed(2)}</td>
                        <td className="py-3">{p.status}</td>
                        <td className="py-3 flex gap-2">
                          <button onClick={() => { setShowDetails(true); setSelected(p); }} className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600">Details</button>
                          <button onClick={() => { setShowStock(true); setSelected(p); setStockValue(p.stock || 0); }} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">Update Stock</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-400">No products found.</div>
                ) : filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onDetails={() => { setShowDetails(true); setSelected(p); }}
                    onUpdateStock={() => { setShowStock(true); setSelected(p); setStockValue(p.stock || 0); }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Update Stock Modal */}
      {showStock && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleStockUpdate} className={`p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4 ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-2">Update Stock</h3>
            <input type="number" placeholder="Stock Quantity" value={stockValue} onChange={e => setStockValue(e.target.value)} required className="w-full px-4 py-2 border rounded-xl" min="0" />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setShowStock(false); setSelected(null); }} className="px-4 py-2 rounded-xl bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetails && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`p-8 rounded-2xl shadow-xl w-full max-w-md ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4">Product Details</h3>
            <div className="mb-2"><b>Name:</b> {selected.name}</div>
            <div className="mb-2"><b>Category:</b> {selected.category}</div>
            <div className="mb-2"><b>Unit Price:</b> ${selected.unitprice.toFixed(2)}</div>
            <div className="mb-2"><b>Status:</b> {selected.status}</div>
            <div className="mb-2"><b>Stock:</b> {selected.stock ?? 'N/A'}</div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => { setShowDetails(false); setSelected(null); }} className="px-4 py-2 rounded-xl bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </SupplierLayout>
  );
} 