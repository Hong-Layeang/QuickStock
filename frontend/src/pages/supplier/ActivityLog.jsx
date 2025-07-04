import SupplierLayout from "../../components/supplier/SupplierLayout.jsx";
import Header from "../../components/supplier/Header.jsx";
import SideBar from "../../components/supplier/Sidebar.jsx";

export default function ActivityLog() {
  return (
    <SupplierLayout>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Activity Log</h2>
        <p className="text-gray-600 dark:text-gray-400">View your inventory activity here.</p>
      </div>
    </SupplierLayout>
  );
} 