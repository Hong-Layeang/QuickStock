import AdminLayout from "../../components/admin/AdminLayout.jsx"
import useThemeStore from "../../store/useThemeStore";
import Header from "../../components/admin/Header.jsx";
import SideBar from "../../components/admin/SideBar.jsx";

export default function Orders() {
  const { isDark } = useThemeStore();
  return (
    <AdminLayout>
      <div className={`rounded-2xl p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Orders</h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage all orders here.</p>
      </div>
    </AdminLayout>
  );
} 