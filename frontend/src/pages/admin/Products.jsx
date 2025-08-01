import AdminLayout from "../../components/admin/AdminLayout.jsx";
import React, { useEffect, useState } from "react";
import useProductStore from "../../stores/useProductStore.js";
import { FaCheckCircle } from "react-icons/fa";
import { TbAlertTriangle } from "react-icons/tb";
import { FiEdit2, FiXCircle, FiTrash2 } from "react-icons/fi";
import { FiLoader } from "react-icons/fi";
import useThemeStore from "../../stores/useThemeStore.js";
import useUserStore from "../../stores/useUserStore.js";

const initialForm = {
  name: "",
  category: "",
  unitprice: "",
  stock: 0,
  status: "in stock",
  supplierId: "", // for assignment
};

export default function Products() {
  const { isDark } = useThemeStore();
  const { products, loading, error, fetchProducts, addProduct, editProduct, deleteProduct } = useProductStore();
  const { users, fetchUsers } = useUserStore();
  // Status counts (match dashboard logic)
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const inStockCount = products.filter(p => p.status === 'in stock').length;
  const outOfStockCount = products.filter(p => p.status === 'out of stock').length;
  const discontinuedCount = products.filter(p => p.status === 'discontinued').length;
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchProducts(); fetchUsers(); }, []);

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Filter suppliers from users
  const suppliers = users.filter(u => u.role === 'supplier');

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "in stock" && p.status === "in stock") ||
      (statusFilter === "low stock" && p.status === "low stock") ||
      (statusFilter === "out of stock" && p.status === "out of stock") ||
      (statusFilter === "discontinued" && p.status === "discontinued");
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesSupplier = supplierFilter === "all" || 
      (p.supplierId && p.supplierId.toString() === supplierFilter);
    return matchesSearch && matchesStatus && matchesCategory && matchesSupplier;
  });

  // Sorting
  // Always show newest products first by default (matches dashboard)
  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
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
  const pageSize = 30;
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  // Reset page on filter/search/sort change
  React.useEffect(() => { setCurrentPage(1); }, [search, statusFilter, categoryFilter, supplierFilter, sortBy, sortOrder]);

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
    setFormError("");
    if (Number(form.unitprice) <= 0) {
      setFormError("Unit price must be greater than 0.");
      return;
    }
    if (Number(form.stock) <= 0) {
      setFormError("Stock must be greater than 0.");
      return;
    }
    setAdding(true);
    await addProduct(form);
    setAdding(false);
    setShowAdd(false);
    setForm(initialForm);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (Number(form.unitprice) <= 0) {
      setFormError("Unit price must be greater than 0.");
      return;
    }
    if (Number(form.stock) <= 0) {
      setFormError("Stock must be greater than 0.");
      return;
    }
    setEditing(true);
    await editProduct(editId, form);
    setEditing(false);
    setShowEdit(false);
    setForm(initialForm);
    setEditId(null);
  };
  const handleDelete = async () => {
    setDeleting(true);
    await deleteProduct(deleteId);
    setDeleting(false);
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
  React.useEffect(() => { setSelected([]); }, [search, statusFilter, categoryFilter, supplierFilter, currentPage, loading]);

  return (
    <AdminLayout>
      <div className={`rounded-2xl p-4 sm:p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex-1">
            <h2 className={`text-xl sm:text-2xl font-bold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Products</h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage all products here.</p>
            {/* Status summary badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
              }`}>
                In Stock: {inStockCount}
              </span>
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
              }`}>
                Low Stock: {lowStockCount}
              </span>
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
              }`}>
                Out of Stock: {outOfStockCount}
              </span>
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-gray-900/30 text-gray-300' : 'bg-gray-100 text-gray-800'
              }`}>
                Discontinued: {discontinuedCount}
              </span>
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-orange-900 text-orange-100' : 'bg-orange-200 text-orange-700'
              }`}>
                Total Products: {products.length}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={() => setShowAdd(true)} 
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 py-2 rounded-xl shadow transition-all cursor-pointer text-sm sm:text-base hover:scale-105"
            >
              + Add Product
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            >
              <option value="all">All Statuses</option>
              <option value="in stock">In Stock</option>
              <option value="low stock">Low Stock</option>
              <option value="out of stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={supplierFilter}
              onChange={e => setSupplierFilter(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200 cursor-pointer text-sm sm:text-base ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            >
              <option value="all">All Suppliers</option>
              {suppliers.length > 0 ? suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </option>
              )) : (
                <option disabled>No suppliers found</option>
              )}
            </select>
          </div>
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
            <table className="table-fixed w-full text-sm" style={{minWidth: '800px'}}>
              {paginated.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={7} className="py-12">
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
                      <th className="py-3 w-10" style={{width: '40px', minWidth: '40px', maxWidth: '40px'}}>
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className={`h-4 w-4 rounded-md border-2 cursor-pointer transition-all duration-200
                              ${isDark 
                                ? 'border-gray-600 bg-gray-700 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-500' 
                                : 'border-gray-300 bg-gray-100 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400'
                              } focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
                          />
                        </div>
                      </th>
                      <th className={`py-3 text-left font-semibold cursor-pointer select-none w-1/5 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '20%'}} onClick={() => handleSort("name")}>Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                      <th className={`py-3 text-left font-semibold cursor-pointer select-none w-1/5 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '12%'}} onClick={() => handleSort("category")}>Category {sortBy === "category" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                      <th className={`py-3 text-center font-semibold w-1/12 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '8%'}}>Quantity</th>
                      <th className={`py-3 font-semibold cursor-pointer select-none w-1/6 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '16%', textAlign: 'center'}} onClick={() => handleSort("unitprice")}>Unit Price {sortBy === "unitprice" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                      <th className={`py-3 text-left font-semibold w-1/6 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '12%'}}>Supplier</th>
                      <th className={`py-3 text-center font-semibold cursor-pointer select-none w-1/6 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '12%'}} onClick={() => handleSort("status")}>Status {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                      <th className={`py-3 text-center font-semibold w-1/4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '20%'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((p) => (
                      <tr key={p.id} className={`border-b transition ${
                        isDark 
                          ? 'border-gray-800 hover:bg-gray-700/40' 
                          : 'border-gray-100 hover:bg-orange-50'
                      }`}>
                        <td className="py-3 w-10" style={{width: '40px', minWidth: '40px', maxWidth: '40px'}}>
                          <div className="flex justify-center">
                            <input
                              type="checkbox"
                              checked={selected.includes(p.id)}
                              onChange={() => handleSelectRow(p.id)}
                              className={`h-4 w-4 rounded-md border-2 cursor-pointer transition-all duration-200
                                ${isDark 
                                  ? 'border-gray-600 bg-gray-700 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-500' 
                                  : 'border-gray-300 bg-gray-100 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400'
                                } focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
                            />
                          </div>
                        </td>
                        <td className={`py-3 font-medium text-left w-1/5 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '20%'}}>{p.name}</td>
                        <td className={`py-3 text-left w-1/5 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '12%'}}>{p.category}</td>
                        <td className={`py-3 text-center w-1/12 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '8%'}}>{p.stock ?? 0}</td>
                        <td className={`py-3 text-center w-1/6 text-green-600 dark:text-green-400`} style={{width: '12%'}}>{p.unitprice ? `$${Number(p.unitprice).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
                        <td className={`py-3 text-left w-1/6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} style={{width: '16%'}}>
                          {suppliers.find(s => s.id === p.supplierId)?.name || 'N/A'}
                        </td>
                        <td className="py-3 w-1/6" style={{width: '12%'}}>
                          <div className="flex justify-center">
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
                          </div>
                        </td>
                        <td className="py-3 w-1/4" style={{width: '20%'}}>
                          <div className="flex justify-center gap-1 sm:gap-2">
                            <button 
                              onClick={() => { 
                                setShowEdit(true); 
                                setEditId(p.id); 
                                setForm({ 
                                  name: p.name, 
                                  category: p.category, 
                                  unitprice: p.unitprice, 
                                  stock: p.stock || 0, 
                                  status: p.status,
                                  supplierId: p.supplierId || ""
                                }); 
                              }} 
                              className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer
                                ${isDark 
                                  ? 'bg-gray-700 text-blue-400 hover:bg-gray-600 hover:text-blue-300' 
                                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                            >
                              <FiEdit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 
                              <span className="hidden sm:inline">Edit</span>
                              <span className="sm:hidden">E</span>
                            </button>
                            <button 
                              onClick={() => setDeleteId(p.id)} 
                              className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer
                                ${isDark 
                                  ? 'bg-gray-700 text-red-400 hover:bg-gray-600 hover:text-red-300' 
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                            >
                              <FiTrash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 
                              <span className="hidden sm:inline">Delete</span>
                              <span className="sm:hidden">D</span>
                            </button>
                          </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <form onSubmit={handleAdd} className={`p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 text-left pl-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Add Product</h3>
            {formError && (
              <div className="mb-2 text-center text-red-400 bg-red-900/10 rounded-lg py-2 px-3 text-sm">{formError}</div>
            )}
            <div className="space-y-4">
                <div>
                  <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Name</label>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    required 
                    className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500' 
                        : 'bg-white border-gray-300 focus:border-orange-500'
                    } border focus:ring-2 focus:ring-orange-500/20`}
                  />
                </div>
                <div>
                  <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Category</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={e => {
                        if (e.target.value === "new") {
                          const newCategory = prompt("Enter new category name:");
                          if (newCategory && newCategory.trim()) {
                            setForm({ ...form, category: newCategory.trim() });
                          }
                        } else {
                          setForm({ ...form, category: e.target.value });
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 appearance-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500' 
                          : 'bg-white border-gray-300 focus:border-orange-500'
                      } border focus:ring-2 focus:ring-orange-500/20 cursor-pointer`}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="new">+ Add New Category</option>
                    </select>
                    <div className={`absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Unit Price</label>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => {
                        const currentPrice = parseFloat(form.unitprice) || 0;
                        setForm(prev => ({ 
                          ...prev, 
                          unitprice: Math.max(0, currentPrice - 0.01).toFixed(2)
                        }));
                      }}
                      className={`px-3 py-2.5 rounded-l-xl border-r-0 transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={form.unitprice} 
                        onChange={e => setForm({ ...form, unitprice: e.target.value })} 
                        required 
                        min="0" 
                        step="0.01"
                        className={`w-full pl-8 pr-4 py-2.5 transition-colors duration-200 text-center appearance-none ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300'
                        } border-y focus:ring-2 focus:ring-orange-500/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const currentPrice = parseFloat(form.unitprice) || 0;
                        setForm(prev => ({ 
                          ...prev, 
                          unitprice: (currentPrice + 0.01).toFixed(2)
                        }));
                      }}
                      className={`px-3 py-2.5 rounded-r-xl border-l-0 transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Stock</label>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, stock: Math.max(0, (prev.stock || 0) - 1) }))}
                      className={`px-3 py-2.5 rounded-l-xl border-r-0 transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={form.stock} 
                      onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} 
                      required 
                      min="0"
                      className={`w-full px-4 py-2.5 transition-colors duration-200 text-center appearance-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300'
                      } border-y focus:ring-2 focus:ring-orange-500/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    />
                    <button 
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, stock: (prev.stock || 0) + 1 }))}
                      className={`px-3 py-2.5 rounded-r-xl border-l-0 transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Status</label>
                  <select 
                    value={form.status} 
                    onChange={e => setForm({ ...form, status: e.target.value })} 
                    className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 focus:border-orange-500'
                    } border focus:ring-2 focus:ring-orange-500/20`}
                  >
                    <option value="in stock">In Stock</option>
                    <option value="low stock">Low Stock</option>
                    <option value="out of stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Assign to Supplier (optional)</label>
                  <select
                    value={form.supplierId}
                    onChange={e => setForm({ ...form, supplierId: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer border focus:ring-2 focus:ring-orange-500/20 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">-- Admin Owned --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name || s.username || s.email}</option>
                    ))}
                  </select>
                </div>
              </div>
            <div className="flex gap-3 justify-end mt-8">
              <button 
                type="button" 
                onClick={() => { setShowAdd(false); setForm(initialForm); setFormError(""); }} 
                className={`px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer font-semibold text-base ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                }`}
                disabled={adding}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer font-semibold text-base flex items-center justify-center gap-2 bg-orange-600 text-white border-orange-600 hover:bg-orange-700"
                disabled={adding}
              >
                {adding ? <FiLoader className="animate-spin w-5 h-5" /> : null}
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <form onSubmit={handleEdit} className={`p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 text-left pl-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Product</h3>
            {formError && (
              <div className="mb-2 text-center text-red-400 bg-red-900/10 rounded-lg py-2 px-3 text-sm">{formError}</div>
            )}
            <div className="space-y-4">
                <div>
                  <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Name</label>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    required 
                    className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 focus:border-blue-500'
                    } border focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
                <div>
                  <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Category</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={e => {
                        if (e.target.value === "new") {
                          const newCategory = prompt("Enter new category name:");
                          if (newCategory && newCategory.trim()) {
                            setForm({ ...form, category: newCategory.trim() });
                          }
                        } else {
                          setForm({ ...form, category: e.target.value });
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 appearance-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-300 focus:border-blue-500'
                      } border focus:ring-2 focus:ring-blue-500/20 cursor-pointer`}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="new">+ Add New Category</option>
                    </select>
                    <div className={`absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={`block text-base mb-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Unit Price</label>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => {
                        const currentPrice = parseFloat(form.unitprice) || 0;
                        setForm(prev => ({ 
                          ...prev, 
                          unitprice: Math.max(0, currentPrice - 0.01).toFixed(2)
                        }));
                      }}
                      className={`px-3 py-2.5 rounded-l-xl border-r-0 transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={form.unitprice} 
                        onChange={e => setForm({ ...form, unitprice: e.target.value })} 
                        required 
                        min="0" 
                        step="0.01"
                        className={`w-full pl-8 pr-4 py-2.5 transition-colors duration-200 text-center appearance-none ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300'
                        } border-y focus:ring-2 focus:ring-blue-500/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const currentPrice = parseFloat(form.unitprice) || 0;
                        setForm(prev => ({ 
                          ...prev, 
                          unitprice: (currentPrice + 0.01).toFixed(2)
                        }));
                      }}
                      className={`px-3 py-2.5 rounded-r-xl border-l-0 transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-base mb-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Stock</label>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, stock: Math.max(0, (prev.stock || 0) - 1) }))}
                      className={`px-3 py-2.5 rounded-l-xl border-r-0 transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={form.stock} 
                      onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} 
                      required 
                      min="0"
                      className={`w-full px-4 py-2.5 transition-colors duration-200 text-center appearance-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300'
                      } border-y focus:ring-2 focus:ring-blue-500/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    />
                    <button 
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, stock: (prev.stock || 0) + 1 }))}
                      className={`px-3 py-2.5 rounded-r-xl border-l-0 transition-colors duration-200 cursor-pointer ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      } border`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-base mb-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Status</label>
                  <select 
                    value={form.status} 
                    onChange={e => setForm({ ...form, status: e.target.value })} 
                    className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 focus:border-blue-500'
                    } border focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="in stock">In Stock</option>
                    <option value="low stock">Low Stock</option>
                    <option value="out of stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-base mb-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Assign to Supplier (optional)</label>
                  <select
                    value={form.supplierId}
                    onChange={e => setForm({ ...form, supplierId: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer border focus:ring-2 focus:ring-blue-500/20 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">-- Admin Owned --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name || s.username || s.email}</option>
                    ))}
                  </select>
                </div>
              </div>
            <div className="flex gap-3 justify-end mt-8">
              <button 
                type="button" 
                onClick={() => { setShowEdit(false); setForm(initialForm); setEditId(null); setFormError(""); }} 
                className={`px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer font-semibold text-base ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                }`}
                disabled={editing}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer font-semibold text-base flex items-center justify-center gap-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                disabled={editing}
              >
                {editing ? <FiLoader className="animate-spin w-5 h-5" /> : null}
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`p-8 rounded-2xl shadow-xl w-full max-w-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              <FiTrash2 className="w-5 h-5" /> Delete Product
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Are you sure you want to delete this product?</p>
            <div className="flex gap-3 justify-end mt-8">
              <button onClick={() => setDeleteId(null)} className={`px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer font-semibold text-base ${isDark ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'}`}>Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer font-semibold text-base flex items-center justify-center gap-2 bg-red-600 text-white border-red-600 hover:bg-red-700" disabled={deleting}>
                {deleting ? <FiLoader className="animate-spin w-5 h-5" /> : null}
                Delete
              </button>
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