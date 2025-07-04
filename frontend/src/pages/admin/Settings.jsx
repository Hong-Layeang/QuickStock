import AdminLayout from "../../components/admin/AdminLayout.jsx";
import Header from "../../components/admin/Header.jsx";
import SideBar from "../../components/admin/SideBar.jsx";

export default function Settings() {
  return (
    <AdminLayout>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your settings here.</p>
      </div>
    </AdminLayout>
  );
} 