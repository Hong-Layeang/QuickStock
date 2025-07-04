import SideBar from "./SideBar";
import Header from "./Header";

const AdminLayout = ({ children }) => (
  <div className="min-h-screen">
    <SideBar />
    <div className="lg:pl-64">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  </div>
);

export default AdminLayout; 