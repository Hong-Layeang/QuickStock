import SupplierLayout from "../../components/supplier/SupplierLayout.jsx";
import React, { useEffect, useState } from "react";
import useSupplierProductStore from "../../stores/useSupplierProductStore.js";
import useThemeStore from "../../stores/useThemeStore.js";

export default function MyProducts() {
  const { isDark } = useThemeStore();
  const { products, loading, error, fetchProducts, editProduct } = useSupplierProductStore();
  const [search, setSearch] = useState("");
  const [showStock, setShowStock] = useState(false);
  const [stockValue, setStockValue] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  // For demo, show all products. In real app, filter by assigned supplier.
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

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
        </div>
        {loading && <div className="text-center py-8 text-orange-600 font-semibold">Loading...</div>}
        {error && <div className="text-center py-8 text-red-500 font-semibold">{error}</div>}
        {!loading && !error && (
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