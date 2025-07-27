import React from "react";
import useThemeStore from "../stores/useThemeStore";

const getStatusColor = (status, isDark) => {
  switch (status) {
    case "in stock":
      return isDark ? "bg-green-700 text-green-200" : "bg-green-100 text-green-700";
    case "low stock":
      return isDark ? "bg-orange-700 text-orange-200" : "bg-orange-100 text-orange-700";
    case "out of stock":
      return isDark ? "bg-red-700 text-red-200" : "bg-red-100 text-red-700";
    case "discontinued":
      return isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700";
    default:
      return isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700";
  }
};

export default function ProductCard({ product, onDetails, onUpdateStock }) {
  const { isDark } = useThemeStore();
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl shadow-lg border p-6 min-h-[320px] max-h-[360px] h-full transition hover:scale-105 hover:shadow-2xl duration-300 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700"
          : "bg-gradient-to-br from-white via-orange-50 to-white border-gray-200"
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{product.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold shadow ${getStatusColor(
            product.status,
            isDark
          )} border border-white/20`}
        >
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-center">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          <b>Category:</b> {product.category}
        </div>
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          <b>Description:</b> {product.description || <span className="italic text-gray-400">No description.</span>}
        </div>
      </div>
      <div className="flex items-end justify-between mt-4">
        <div>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Quantity</div>
          <div className={`text-xl font-bold ${isDark ? "text-orange-300" : "text-orange-600"}`}>{product.stock}</div>
        </div>
        <div className="text-right">
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Unit Price</div>
          <div className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>${product.unitprice?.toFixed(2)}</div>
        </div>
      </div>
      {/* Action buttons inside the card */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onDetails}
          className="flex-1 px-4 py-2 rounded-xl font-semibold bg-gray-100 text-gray-700 border border-gray-300 shadow-sm transition hover:bg-gray-200 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 text-sm md:text-base"
        >
          Details
        </button>
        <button
          onClick={onUpdateStock}
          className="flex-1 px-4 py-2 rounded-xl font-semibold bg-orange-500 text-white border border-orange-600 shadow-sm transition hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 text-sm md:text-base"
        >
          Update Stock
        </button>
      </div>
      {/* Decorative gradient overlay for extra polish */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{background: isDark ? 'linear-gradient(135deg,rgba(255,140,0,0.08) 0%,rgba(255,255,255,0.02) 100%)' : 'linear-gradient(135deg,rgba(255,140,0,0.10) 0%,rgba(255,255,255,0.04) 100%)'}}></div>
    </div>
  );
} 