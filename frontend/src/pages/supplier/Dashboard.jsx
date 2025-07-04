import SupplierLayout from "../../components/supplier/SupplierLayout.jsx"
import DashboardCards from "../../components/DashboardCards.jsx"
import ActivityTable from "../../components/ActivityTable.jsx"
import TransactionSummary from "../../components/TransactionSummary.jsx"

export default function DashBoard() {
  return (
    <SupplierLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your inventory today.
          </p>
        </div>

        {/* Dashboard Cards */}
        <DashboardCards />

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Activity Table - Takes 2/3 on large screens */}
          <div className="xl:col-span-2">
            <ActivityTable />
          </div>
          
          {/* Transaction Summary - Takes 1/3 on large screens */}
          <div className="xl:col-span-1">
            <TransactionSummary />
          </div>
        </div>
      </div>
    </SupplierLayout>
  )
}
