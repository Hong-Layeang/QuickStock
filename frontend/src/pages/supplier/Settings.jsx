import SupplierLayout from "../../components/supplier/SupplierLayout.jsx"
import useThemeStore from "../../store/useThemeStore";
import Header from "../../components/supplier/Header.jsx";
import SideBar from "../../components/supplier/Sidebar.jsx";

export default function Settings() {
  const { isDark } = useThemeStore();
  return (
    <SupplierLayout>
      <SideBar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
                <div className={`rounded-2xl p-6 shadow-md border ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Settings</h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage your settings here.</p>
          </div>
        </main>
      </div>
    </SupplierLayout>
  );
} 