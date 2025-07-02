import Header from "../../components/supplier/Header.jsx"
import SideBar from "../../components/supplier/Sidebar.jsx"
import DashboardCards from "../../components/DashboardCards.jsx"
import ActivityTable from "../../components/ActivityTable.jsx"
import TransactionSummary from "../../components/TransactionSummary.jsx"

export default function DashBoard() {
  return (
    <div className="min-h-screen">
      <SideBar />

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="p-4 lg:p-6">
          <Header />

          <div className="space-y-6 mt-6">
            <DashboardCards />
            <ActivityTable />
            <TransactionSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
