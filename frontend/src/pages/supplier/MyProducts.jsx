import SupplierLayout from "../../components/supplier/SupplierLayout.jsx";
import React, { useEffect, useState, useCallback } from "react";
import useSupplierProductStore from "../../stores/useSupplierProductStore.js";
import useThemeStore from "../../stores/useThemeStore.js";
import { FaCheckCircle, FaShoppingCart, FaReceipt, FaTimes } from "react-icons/fa";
import { TbAlertTriangle } from "react-icons/tb";
import { FiXCircle, FiLoader, FiGrid, FiList } from "react-icons/fi";
import axios from "axios";
import { API_BASE_URL } from "../../configs/config";
import QRCodeImg from "../../assets/QR-CODE.jpg";

const initialSaleForm = {
  productId: "",
  quantity: 1,
  paymentMethod: "cash"
};

export default function MyProducts() {
  const { isDark } = useThemeStore();
  const { products, loading, error, fetchProducts } = useSupplierProductStore();

  // Status counts (match admin dashboard logic)
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const inStockCount = products.filter(p => p.status === 'in stock').length;
  const outOfStockCount = products.filter(p => p.status === 'out of stock').length;
  const discontinuedCount = products.filter(p => p.status === 'discontinued').length;

  // Sales functionality state
  const [showSale, setShowSale] = useState(false);
  const [saleForm, setSaleForm] = useState(initialSaleForm);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [makingSale, setMakingSale] = useState(false);

  // Admin-like filtering and UI state (exactly like admin)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table"); // Add view mode toggle

  useEffect(() => { 
    fetchProducts(); 
  }, [fetchProducts]);

  // Get unique categories for filter dropdown (same as admin)
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Filtering logic (same as admin, but no supplier filter since this is supplier-specific)
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

  // Sorting (exactly like admin - Always show newest products first by default)
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

  // Pagination (exactly like admin)
  const pageSize = 30;
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  // Reset page on filter/search/sort change
  React.useEffect(() => { setCurrentPage(1); }, [search, statusFilter, categoryFilter, sortBy, sortOrder]);

  // Sorting handler (exactly like admin)
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Sales functionality
  const handleMakeSale = useCallback(async (product) => {
    setSaleForm({ ...initialSaleForm, productId: product.id });
    setShowSale(true);
  }, []);

  const handleSaleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate quantity before going to payment
    const product = products.find(p => p.id === saleForm.productId);
    if (!product) {
      alert('Product not found. Please try again.');
      return;
    }
    
    if (saleForm.quantity < 1) {
      alert('Quantity must be at least 1.');
      return;
    }
    
    if (saleForm.quantity > product.stock) {
      alert(`Cannot sell ${saleForm.quantity} units. Only ${product.stock} units available.`);
      return;
    }
    
    // Go to payment selection
    setShowSale(false);
    setShowPayment(true);
  }, [saleForm, products]);

  const handlePaymentComplete = useCallback(async (paymentMethod) => {
    setMakingSale(true);
    
    try {
      const product = products.find(p => p.id === saleForm.productId);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/supplier/submit-report`, {
        productId: saleForm.productId,
        quantity: saleForm.quantity,
        totalPrice: saleForm.quantity * product.unitprice,
        paymentMethod: paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Generate receipt data
        const receiptInfo = {
          receiptNumber: `RCP-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          product: product,
          quantity: saleForm.quantity,
          unitPrice: product.unitprice,
          totalPrice: saleForm.quantity * product.unitprice,
          paymentMethod: paymentMethod
        };
        
        setReceiptData(receiptInfo);
        setShowPayment(false);
        setShowReceipt(true);
        setSaleForm(initialSaleForm);
        
        // Refresh products to update stock
        fetchProducts();
      }
    } catch (err) {
      console.error('Sale submission error:', err);
      alert('Failed to process sale. Please try again.');
    } finally {
      setMakingSale(false);
    }
  }, [saleForm, products, fetchProducts]);

  const printReceipt = () => {
    window.print();
  };

  return (
    <SupplierLayout>
      <div className={`rounded-2xl p-4 sm:p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header - Exact Admin Match */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex-1">
            <h2 className={`text-xl sm:text-2xl font-bold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>My Products</h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your products and make sales to customers.</p>
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
          <div className="flex-shrink-0 flex gap-3 items-center">
            {/* View Toggle Button */}
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {viewMode === 'table' ? <FiGrid className="w-4 h-4" /> : <FiList className="w-4 h-4" />}
              <span className="hidden sm:inline">{viewMode === 'table' ? 'Grid View' : 'Table View'}</span>
            </button>
          </div>
        </div>
        
        {/* Filters - Exact Admin Match */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
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
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="overflow-x-auto">
            <table className="table-fixed w-full text-sm" style={{minWidth: '800px'}}>
              <thead>
                <tr className={`border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <th className="py-3 px-4 text-left font-semibold" style={{width: '25%'}}>Name</th>
                  <th className="py-3 px-4 text-left font-semibold" style={{width: '18%'}}>Category</th>
                  <th className="py-3 px-4 text-center font-semibold" style={{width: '10%'}}>Quantity</th>
                  <th className="py-3 px-4 text-center font-semibold" style={{width: '15%'}}>Unit Price</th>
                  <th className="py-3 px-4 text-center font-semibold" style={{width: '15%'}}>Status</th>
                  <th className="py-3 px-4 text-center font-semibold" style={{width: '17%'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className={`border-b ${
                    isDark ? 'border-gray-800' : 'border-gray-100'
                  }`}>
                    <td className="py-3 px-4" style={{width: '25%'}}>
                      <div className={`h-4 w-32 rounded animate-pulse ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />
                    </td>
                    <td className="py-3 px-4" style={{width: '18%'}}>
                      <div className={`h-4 w-24 rounded animate-pulse ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />
                    </td>
                    <td className="py-3 px-4 text-center" style={{width: '10%'}}>
                      <div className={`h-4 w-12 rounded animate-pulse mx-auto ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />
                    </td>
                    <td className="py-3 px-4 text-center" style={{width: '15%'}}>
                      <div className={`h-4 w-16 rounded animate-pulse mx-auto ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />
                    </td>
                    <td className="py-3 px-4 text-center" style={{width: '15%'}}>
                      <div className={`h-6 w-20 rounded-full animate-pulse mx-auto ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />
                    </td>
                    <td className="py-3 px-4" style={{width: '17%'}}>
                      <div className="flex justify-center gap-2">
                        <div className={`h-7 w-16 rounded-lg animate-pulse ${
                          isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-6">
              <div className={`h-8 w-64 rounded animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            </div>
          </div>
        )}
        
        {/* Error State */}
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
        
        {/* Content */}
        {!loading && !error && (
          <>
            {viewMode === 'table' ? (
              /* Table View */
              <div className="overflow-x-auto">
                <table className="table-fixed w-full text-sm" style={{minWidth: '800px'}}>
                  {paginated.length === 0 ? (
                    <tbody>
                      <tr>
                        <td colSpan={6} className="py-12">
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-7xl mb-4 select-none">😕</span>
                            <div className="text-lg font-semibold mb-2 text-center">No products found.</div>
                            <div className="text-sm text-gray-400 text-center">Try adjusting your filters!</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <>
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className={`py-3 px-4 text-left font-semibold cursor-pointer select-none ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '25%'}} onClick={() => handleSort("name")}>Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                          <th className={`py-3 px-4 text-left font-semibold cursor-pointer select-none ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '18%'}} onClick={() => handleSort("category")}>Category {sortBy === "category" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                          <th className={`py-3 px-4 text-center font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '10%'}}>Quantity</th>
                          <th className={`py-3 px-4 text-center font-semibold cursor-pointer select-none ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '15%'}} onClick={() => handleSort("unitprice")}>Unit Price {sortBy === "unitprice" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                          <th className={`py-3 px-4 text-center font-semibold cursor-pointer select-none ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '15%'}} onClick={() => handleSort("status")}>Status {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                          <th className={`py-3 px-4 text-center font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '17%'}}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((p) => (
                          <tr key={p.id} className={`border-b transition ${
                            isDark 
                              ? 'border-gray-800 hover:bg-gray-700/40' 
                              : 'border-gray-100 hover:bg-orange-50'
                          }`}>
                            <td className={`py-3 font-medium text-left w-1/5 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '20%'}}>{p.name}</td>
                            <td className={`py-3 text-left w-1/5 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '12%'}}>{p.category}</td>
                            <td className={`py-3 text-center w-1/12 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{width: '8%'}}>{p.stock ?? 0}</td>
                            <td className={`py-3 text-center w-1/6 text-green-600 dark:text-green-400`} style={{width: '12%'}}>{p.unitprice ? `$${Number(p.unitprice).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
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
                            <td className="py-3 px-4" style={{width: '17%'}}>
                              <div className="flex justify-center gap-2">
                                <button 
                                  onClick={() => handleMakeSale(p)}
                                  disabled={p.stock === 0}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer
                                    ${p.stock === 0
                                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                      : isDark 
                                        ? 'bg-gray-700 text-green-400 hover:bg-gray-600 hover:text-green-300' 
                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                    }`}
                                >
                                  <FaShoppingCart className="w-3.5 h-3.5" /> 
                                  <span>Sale</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
            ) : (
              /* Card/Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <span className="text-7xl mb-4 select-none">😕</span>
                    <div className="text-lg font-semibold mb-2 text-center">No products found.</div>
                    <div className="text-sm text-gray-400 text-center">Try adjusting your filters!</div>
                  </div>
                ) : (
                  paginated.map((p) => (
                    <div key={p.id} className={`rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}>
                      {/* Product Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {p.name}
                          </h3>
                          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {p.category}
                          </p>
                        </div>
                        {/* Status Badge */}
                        <div className="ml-2 flex-shrink-0">
                          {p.status === 'in stock' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                              isDark ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-100 text-green-700 border-green-300'
                            }`}>
                              <FaCheckCircle className="w-3 h-3" />
                            </span>
                          )}
                          {p.status === 'low stock' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                              isDark ? 'bg-amber-900/30 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}>
                              <TbAlertTriangle className="w-3 h-3" />
                            </span>
                          )}
                          {p.status === 'out of stock' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                              isDark ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-100 text-red-700 border-red-300'
                            }`}>
                              <FiXCircle className="w-3 h-3" />
                            </span>
                          )}
                          {p.status === 'discontinued' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                              isDark ? 'bg-gray-800/30 text-gray-300 border-gray-600' : 'bg-gray-200 text-gray-700 border-gray-400'
                            }`}>
                              <FiXCircle className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Price:
                          </span>
                          <span className="text-green-600 font-bold">
                            {p.unitprice ? `$${Number(p.unitprice).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Stock:
                          </span>
                          <span className={`font-medium ${
                            p.stock < 10 ? 'text-red-600' : isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {p.stock ?? 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Status:
                          </span>
                          <span className={`text-sm font-medium ${
                            p.status === 'in stock' ? 'text-green-600' :
                            p.status === 'low stock' ? 'text-yellow-600' :
                            p.status === 'out of stock' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {p.status === 'in stock' ? 'In Stock' :
                             p.status === 'low stock' ? 'Low Stock' :
                             p.status === 'out of stock' ? 'Out of Stock' :
                             'Discontinued'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMakeSale(p)}
                          disabled={p.stock === 0}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                            ${p.stock === 0
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : isDark 
                                ? 'bg-gray-600 text-green-400 hover:bg-gray-500 hover:text-green-300' 
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                        >
                          <FaShoppingCart className="w-4 h-4" />
                          <span>Make Sale</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
                <button
                  className={`px-3 py-1 rounded-xl font-semibold disabled:opacity-50 cursor-pointer ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button
                  className={`px-3 py-1 rounded-xl font-semibold disabled:opacity-50 cursor-pointer ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded-xl font-semibold cursor-pointer ${
                      page === currentPage 
                        ? 'bg-orange-600 text-white' 
                        : isDark 
                          ? 'bg-gray-800 text-gray-200' 
                          : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className={`px-3 py-1 rounded-xl font-semibold disabled:opacity-50 cursor-pointer ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  className={`px-3 py-1 rounded-xl font-semibold disabled:opacity-50 cursor-pointer ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Make Sale Modal */}
      {showSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <form onSubmit={handleSaleSubmit} className={`p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Make Sale
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Complete a sale transaction
              </p>
            </div>
            
            {/* Product Info Card */}
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`block font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Product
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {products.find(p => p.id === saleForm.productId)?.name || ''}
                  </span>
                </div>
                <div>
                  <span className={`block font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Category
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {products.find(p => p.id === saleForm.productId)?.category || ''}
                  </span>
                </div>
                <div>
                  <span className={`block font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Unit Price
                  </span>
                  <span className="text-green-600 font-bold">
                    ${Number(products.find(p => p.id === saleForm.productId)?.unitprice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className={`block font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Available Stock
                  </span>
                  <span className={`font-semibold ${
                    (products.find(p => p.id === saleForm.productId)?.stock || 0) < 10 ? 'text-red-600' : isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {products.find(p => p.id === saleForm.productId)?.stock || 0} units
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                Quantity *
              </label>
              <div className="flex items-center">
                <button 
                  type="button"
                  disabled={saleForm.quantity <= 1}
                  onClick={() => setSaleForm(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                  className={`px-3 py-2.5 rounded-l-xl border-r-0 transition-colors duration-200 ${
                    saleForm.quantity <= 1 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer'
                  } ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  } border`}
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1"
                  max={products.find(p => p.id === saleForm.productId)?.stock || 1}
                  value={saleForm.quantity} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const maxStock = products.find(p => p.id === saleForm.productId)?.stock || 1;
                    setSaleForm({...saleForm, quantity: Math.min(Math.max(1, value), maxStock)});
                  }}
                  className={`w-full px-4 py-2.5 transition-colors duration-200 text-center appearance-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300'
                  } border-y focus:ring-2 focus:ring-orange-500/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                />
                <button 
                  type="button"
                  disabled={saleForm.quantity >= (products.find(p => p.id === saleForm.productId)?.stock || 1)}
                  onClick={() => {
                    const maxStock = products.find(p => p.id === saleForm.productId)?.stock || 1;
                    setSaleForm(prev => ({ ...prev, quantity: Math.min(prev.quantity + 1, maxStock) }));
                  }}
                  className={`px-3 py-2.5 rounded-r-xl border-l-0 transition-colors duration-200 ${
                    saleForm.quantity >= (products.find(p => p.id === saleForm.productId)?.stock || 1)
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer'
                  } ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  } border`}
                >
                  +
                </button>
              </div>
              <p className={`text-xs mt-1 text-left pl-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Max: {products.find(p => p.id === saleForm.productId)?.stock || 0} units
              </p>
            </div>

            <div>
              <label className={`block text-base mb-2 text-left pl-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                Total Amount
              </label>
              <div className={`px-4 py-3 rounded-xl border text-center font-bold text-xl ${
                isDark ? 'bg-gray-700/50 border-gray-600 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                ${((products.find(p => p.id === saleForm.productId)?.unitprice || 0) * saleForm.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mt-8">
              <button
                type="button"
                onClick={() => setShowSale(false)}
                className={`px-5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer font-semibold text-base ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                }`}
                disabled={makingSale}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  makingSale || 
                  saleForm.quantity < 1 || 
                  saleForm.quantity > (products.find(p => p.id === saleForm.productId)?.stock || 0)
                }
                className={`px-5 py-2.5 rounded-2xl border transition-all duration-200 font-semibold text-base flex items-center justify-center gap-2 ${
                  makingSale || 
                  saleForm.quantity < 1 || 
                  saleForm.quantity > (products.find(p => p.id === saleForm.productId)?.stock || 0)
                    ? 'bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white border-green-600 hover:bg-green-700 cursor-pointer'
                }`}
              >
                {makingSale ? (
                  <>
                    <FiLoader className="animate-spin w-5 h-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="w-4 h-4" />
                    Continue to Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={`relative p-6 rounded-2xl shadow-xl w-full max-w-sm ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>

            <div className="text-center mb-4">
              <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Payment
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Complete the payment for this sale
              </p>
            </div>
            
            {/* Sale Summary */}
            <div className={`p-3 rounded-lg border mb-4 ${
              isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-center">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {products.find(p => p.id === saleForm.productId)?.name} × {saleForm.quantity}
                </p>
                <p className={`text-xl font-bold text-green-600 mt-1`}>
                  ${((products.find(p => p.id === saleForm.productId)?.unitprice || 0) * saleForm.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center mb-4">
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Customer can scan QR code or pay with cash
              </p>
              <div className="flex justify-center mb-4">
                <div className="w-80 h-80 bg-white rounded-xl shadow-lg p-4 flex items-center justify-center">
                  <img 
                    src={QRCodeImg} 
                    alt="QR Code for Payment" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {makingSale && (
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin w-5 h-5" />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Processing payment...
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowPayment(false);
                  setShowSale(true);
                }}
                disabled={makingSale}
                className={`px-5 py-3 rounded-xl border transition-all duration-200 font-semibold ${
                  isDark 
                    ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                } ${makingSale ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Back
              </button>
              <button
                onClick={() => handlePaymentComplete('cash')}
                disabled={makingSale}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                } ${makingSale ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Payment Received
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-xl w-full max-w-md ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-green-900/30' : 'bg-green-100'
                  }`}>
                    <FaCheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h2 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Payment Completed!
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Transaction completed successfully
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <p className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    QuickStock Receipt
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Receipt #{receiptData.receiptNumber}
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {receiptData.date}
                  </p>
                </div>

                <div className={`border-t border-b py-4 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Product:
                      </span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        {receiptData.product.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Quantity:
                      </span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        {receiptData.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Unit Price:
                      </span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        ${receiptData.unitPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        Payment Method:
                      </span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        {receiptData.paymentMethod === 'qr' ? 'QR Code' : 'Cash'}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        Total:
                      </span>
                      <span className="text-green-600">
                        ${receiptData.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Thank you for choosing QuickStock!
                  </p>
                </div>

                {receiptData.notes && (
                  <div>
                    <p className={`text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Notes:
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {receiptData.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReceipt(false)}
                  className={`px-5 py-3 rounded-xl border transition-all duration-200 font-semibold cursor-pointer ${
                    isDark 
                      ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                      : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={printReceipt}
                  className="flex-1 px-5 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-200 font-semibold cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaReceipt className="w-4 h-4" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SupplierLayout>
  );
}
