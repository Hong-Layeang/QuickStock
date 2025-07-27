
import maleImg from "../../assets/male.png";
import femaleImg from "../../assets/female.png";
import otherImg from "../../assets/other.png";
import useThemeStore from "../../stores/useThemeStore.js";
import useUserStore from "../../stores/useUserStore.js";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { useEffect } from "react";

const genderImages = {
  male: maleImg,
  female: femaleImg,
  other: otherImg,
};

export default function Suppliers() {
  const { isDark } = useThemeStore();
  const { users, fetchUsers, loading } = useUserStore();
  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  // Filter suppliers only
  const suppliers = users.filter(u => u.role === 'supplier');

  return (
    <AdminLayout>
      <div className={`rounded-2xl p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Suppliers</h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage all suppliers here.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-orange-500 font-semibold">Loading suppliers...</div>
          ) : suppliers.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No suppliers found.</div>
          ) : suppliers.map(supplier => {
            const imgSrc = genderImages[supplier.gender?.toLowerCase()] || genderImages.other;
            return (
              <div key={supplier.id} className={`rounded-2xl shadow-md border p-6 flex flex-col items-center transition-all hover:shadow-lg ${
                isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <img
                  src={imgSrc}
                  alt={supplier.gender || 'profile'}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-orange-400 shadow"
                  style={{ background: isDark ? '#222' : '#eee' }}
                />
                <div className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{supplier.username || supplier.name}</div>
                <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{supplier.email}</div>
                <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{supplier.position || 'Supplier'}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{supplier.phone}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}