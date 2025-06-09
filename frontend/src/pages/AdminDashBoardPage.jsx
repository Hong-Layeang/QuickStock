import Header from '../components/Header.jsx';
import AdminSideBar from '../components/AdminSideBar.jsx';
import DashboardCards from '../components/DashboardCards.jsx';
import ActivityTable from '../components/ActivityTable.jsx';
import TransactionSummary from '../components/TransactionSummary.jsx';

const AdminDashBoardPage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[220px] h-screen">
        <AdminSideBar />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        <div className="p-6">
          <Header />
          <div className="mt-10">
            <DashboardCards />
          </div>
          <div className="mt-10">
            <ActivityTable />
          </div>
          <div className="mt-10">
            <TransactionSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoardPage;
