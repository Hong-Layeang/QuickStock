import AdminLayout from "../../components/admin/AdminLayout.jsx";
import React, { useEffect, useState } from "react";
import useProductStore from "../../stores/useProductStore.js";
import { FaCheckCircle } from "react-icons/fa";
import { TbAlertTriangle } from "react-icons/tb";
import { FiEdit2, FiXCircle, FiTrash2 } from "react-icons/fi";
import useThemeStore from "../../stores/useThemeStore.js";

const initialForm = {
  name: "",
  category: "",
  unitprice: "",
  stock: 0,
  status: "in stock",
};

export default function Products() {
  const { isDark } = useThemeStore();
  const { products, loading, error, fetchProducts, addProduct, editProduct, deleteProduct } = useProductStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "in stock" && p.status === "in stock") ||
      (statusFilter === "low stock" && p.status === "low stock") ||
      (statusFilter === "out of stock" && p.status === "out of stock") ||
      (statusFilter === "discontinued" && p.status === "discontinued");
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy) return 0;
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === "unitprice") {
      valA = Number(valA);
      valB = Number(valB);
    } else {
      valA = valA?.toString().toLowerCase();
      valB = valB?.toString().toLowerCase();
    }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const pageSize = 5;
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  // Reset page on filter/search/sort change
  React.useEffect(() => { setCurrentPage(1); }, [search, statusFilter, sortBy, sortOrder]);

  // Sorting handler
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await addProduct(form);
    setShowAdd(false);
    setForm(initialForm);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    await editProduct(editId, form);
    setShowEdit(false);
    setForm(initialForm);
    setEditId(null);
  };
  const handleDelete = async () => {
    await deleteProduct(deleteId);
    setDeleteId(null);
  };

  // Bulk selection logic
  const isAllSelected = paginated.length > 0 && paginated.every(p => selected.includes(p.id));
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected(selected.filter(id => !paginated.some(p => p.id === id)));
    } else {
      setSelected([...new Set([...selected, ...paginated.map(p => p.id)])]);
    }
  };
  const handleSelectRow = (id) => {
    setSelected(selected.includes(id) ? selected.filter(sid => sid !== id) : [...selected, id]);
  };
  const handleBulkDelete = async () => {
    for (const id of selected) {
      await deleteProduct(id);
    }
    setSelected([]);
    setShowBulkDelete(false);
  };
  // Deselect on filter/search/page change
  React.useEffect(() => { setSelected([]); }, [search, statusFilter, categoryFilter, currentPage, loading]);

  return (
    <AdminLayout>
      <div className={`rounded-2xl p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className={`text-2xl font-bold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Products</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage all products here.</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition-all cursor-pointer">+ Add Product</button>
        </div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
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
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={`w-full sm:w-48 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent${
              isDark 
                ? 'border-gray-700 bg-gray-900 text-white' 
                : 'border-gray-300 bg-gray-50 text-gray-900'
            } cursor-pointer`}
          >
            <option value="all">All Statuses</option>
            <option value="in stock">In Stock</option>
            <option value="low stock">Low Stock</option>
            <option value="out of stock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className={`w-full sm:w-48 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent${
              isDark 
                ? 'border-gray-700 bg-gray-900 text-white' 
                : 'border-gray-300 bg-gray-50 text-gray-900'
            } cursor-pointer`}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {loading && (
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
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className={`border-b ${
                    isDark ? 'border-gray-800' : 'border-gray-100'
                  }`}>
                    <td className="py-3"><div className={`h-4 w-32 rounded animate-pulse ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`} /></td>
                    <td className="py-3"><div className={`h-4 w-24 rounded animate-pulse ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`} /></td>
                    <td className="py-3"><div className={`h-4 w-16 rounded animate-pulse ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`} /></td>
                    <td className="py-3"><div className={`h-4 w-20 rounded animate-pulse ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`} /></td>
                    <td className="py-3"><div className={`h-8 w-24 rounded animate-pulse ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <div className={`h-8 w-32 rounded animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <div className={`inline-block px-4 py-2 rounded-xl font-semibold border ${
              isDark 
                ? 'bg-red-900/20 text-red-400 border-red-700' 
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {error}
            </div>
          </div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            {/* Bulk Delete Button */}
            {selected.length > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>{selected.length} selected</span>
                <button
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer"
                  onClick={() => setShowBulkDelete(true)}
                >
                  Delete Selected
                </button>
              </div>
            )}
            <table className="w-full text-sm">
              {paginated.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={6} className="py-12">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-7xl mb-4 select-none">😕</span>
                        <div className="text-lg font-semibold mb-2 text-center">No products found.</div>
                        <div className="text-sm text-gray-400 text-center">Try adjusting your filters or add a new product!</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <>
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`py-3 font-semibold w-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          className="accent-orange-600 w-4 h-4 rounded"
                        />
                      </th>
                      <th className={`py-3 text-left font-semibold cursor-pointer select-none ${isDark ? 'text-white' : 'text-gray-900'}`} onClick={() => handleSort("name")}>Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                      <th className={`py-3 text-left font-semibold cursor-pointer select-none ${isDark ? 'text-white' : 'text-gray-900'}`} onClick={() => handleSort("category")}>Category {sortBy === "category" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                      <th className={`py-3 text-left font-semibold cursor-pointer select-none ${isDark ? 'text-white' : 'text-gray-900'}`} onClick={() => handleSort("unitprice")}>Unit Price {sortBy === "unitprice" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                      <th className={`py-3 text-left font-semibold cursor-pointer select-none ${isDark ? 'text-white' : 'text-gray-900'}`} onClick={() => handleSort("status")}>Status {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                      <th className={`py-3 text-left font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((p) => (
                      <tr key={p.id} className={`border-b transition ${
                        isDark 
                          ? 'border-gray-800 hover:bg-gray-700/40' 
                          : 'border-gray-100 hover:bg-orange-50'
                      }`}>
                        <td className={`py-3 w-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}>
                          <input
                            type="checkbox"
                            checked={selected.includes(p.id)}
                            onChange={() => handleSelectRow(p.id)}
                            className="accent-orange-600 w-4 h-4 rounded"
                          />
                        </td>
                        <td className={`py-3 font-medium text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name}</td>
                        <td className={`py-3 text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.category}</td>
                        <td className={`py-3 text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.unitprice ? `$${Number(p.unitprice).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
                        <td className="py-3 text-left">
                          {p.status === 'in stock' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                              isDark ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-100 text-green-700 border-green-300'
                            }`}>
                              <FaCheckCircle className="mr-1 w-3 h-3" /> In Stock
                            </span>
                          )}
                          {p.status === 'low stock' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                              isDark ? 'bg-amber-900/30 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}>
                              <TbAlertTriangle className="mr-1 w-3 h-3" /> Low Stock
                            </span>
                          )}
                          {p.status === 'out of stock' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                              isDark ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-100 text-red-700 border-red-300'
                            }`}>
                              <FiXCircle className="mr-1 w-3 h-3" /> Out of Stock
                            </span>
                          )}
                          {p.status === 'discontinued' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                              isDark ? 'bg-gray-800/30 text-gray-300 border-gray-600' : 'bg-gray-200 text-gray-700 border-gray-400'
                            }`}>
                              <FiXCircle className="mr-1 w-3 h-3" /> Discontinued
                            </span>
                          )}
                        </td>
                        <td className="py-3 flex gap-2">
                          <button onClick={() => { setShowEdit(true); setEditId(p.id); setForm({ name: p.name, category: p.category, unitprice: p.unitprice, stock: p.stock || 0, status: p.status }); }} className="flex items-center gap-1 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer">
                            <FiEdit2 className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer">
                            <FiTrash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
              <button
                className={`px-3 py-1 rounded-xl font-semibold disabled:opacity-50 ${
                  isDark ? 'bg-gray-700 text-gray-200 cursor-pointer' : 'bg-gray-200 text-gray-700 cursor-pointer'
                }`}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button
                className={`px-3 py-1 rounded-xl font-semibold disabled:opacity-50 ${
                  isDark ? 'bg-gray-700 text-gray-200 cursor-pointer' : 'bg-gray-200 text-gray-700 cursor-pointer'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded-xl font-semibold ${
                    page === currentPage 
                      ? 'bg-orange-600 text-white cursor-pointer' 
                      : isDark 
                        ? 'bg-gray-800 text-gray-200 cursor-pointer' 
                        : 'bg-gray-100 text-gray-700 cursor-pointer'
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className={`px-3 py-1 rounded-xl font-semibold disabled:opacity-50 ${
                  isDark ? 'bg-gray-700 text-gray-200 cursor-pointer' : 'bg-gray-200 text-gray-700 cursor-pointer'
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                className={`px-3 py-1 rounded-xl font-semibold disabled:opacity-50 ${
                  isDark ? 'bg-gray-700 text-gray-200 cursor-pointer' : 'bg-gray-200 text-gray-700 cursor-pointer'
                }`}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleAdd} className={`p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4">Add Product</h3>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Category</label>
              <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Unit Price</label>
              <input type="number" placeholder="Unit Price" value={form.unitprice} onChange={e => setForm({ ...form, unitprice: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" min="0" step="0.01" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Stock</label>
              <input type="number" placeholder="Stock Quantity" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} required className="w-full px-4 py-2 border rounded-xl" min="0" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 border rounded-xl">
                <option value="in stock">In Stock</option>
                <option value="low stock">Low Stock</option>
                <option value="out of stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button type="button" onClick={() => { setShowAdd(false); setForm(initialForm); }} className="px-4 py-2 rounded-xl bg-gray-200 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-orange-600 text-white cursor-pointer">Add</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleEdit} className={`p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Category</label>
              <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Unit Price</label>
              <input type="number" placeholder="Unit Price" value={form.unitprice} onChange={e => setForm({ ...form, unitprice: e.target.value })} required className="w-full px-4 py-2 border rounded-xl" min="0" step="0.01" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Stock</label>
              <input type="number" placeholder="Stock Quantity" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} required className="w-full px-4 py-2 border rounded-xl" min="0" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 border rounded-xl">
                <option value="in stock">In Stock</option>
                <option value="low stock">Low Stock</option>
                <option value="out of stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button type="button" onClick={() => { setShowEdit(false); setForm(initialForm); setEditId(null); }} className="px-4 py-2 rounded-xl bg-gray-200 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white cursor-pointer">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`p-8 rounded-2xl shadow-xl w-full max-w-sm ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`}><FiTrash2 className="w-5 h-5" /> Delete Product</h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Are you sure you want to delete this product?</p>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl bg-gray-200 cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`p-8 rounded-2xl shadow-xl w-full max-w-sm ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`}>Bulk Delete Products</h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Are you sure you want to delete {selected.length} selected products?</p>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setShowBulkDelete(false)} className="px-4 py-2 rounded-xl bg-gray-200 cursor-pointer">Cancel</button>
              <button onClick={handleBulkDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 