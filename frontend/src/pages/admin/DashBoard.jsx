import AdminLayout from "../../components/admin/AdminLayout.jsx"
import DashboardCards from "../../components/DashboardCards.jsx"
import ActivityTable from "../../components/ActivityTable.jsx"
import TransactionSummary from "../../components/TransactionSummary.jsx"
import SalesAnalyticsChart from "../../components/SalesAnalyticsChart.jsx"
import DashboardAlerts from "../../components/DashboardAlerts.jsx"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { API_BASE_URL } from "../../configs/config"
import useThemeStore from "../../store/useThemeStore"

export default function DashBoard() {
  const { isDark } = useThemeStore();
  const [cards, setCards] = useState(undefined)
  const [activities, setActivities] = useState(undefined)
  const [metrics, setMetrics] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        const data = response.data.data
        setCards(data.cards)
        setActivities(data.activities)
        setMetrics(data.metrics)
      } else {
        setError('Failed to load dashboard data.')
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err.response?.data?.message || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return (
    <AdminLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Alerts Section */}
        <DashboardAlerts loading={loading} error={error} />

        {/* Welcome Section */}
        <div className={`rounded-2xl p-6 shadow-md border ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back! 👋
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Here's what's happening with your inventory today.
          </p>
        </div>

        {/* Sales Analytics Chart */}
        <SalesAnalyticsChart loading={loading} error={error} />

        {/* Dashboard Cards */}
        {error ? (
          <div className={`font-semibold p-4 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>{error}</div>
        ) : (
          <DashboardCards 
            cards={cards} 
            loading={loading} 
            onRefresh={fetchDashboard}
          />
        )}

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Activity Table - Takes 2/3 on large screens */}
          <div className="xl:col-span-2">
            {loading ? (
              <div className={`h-64 rounded-2xl animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            ) : error ? (
              <div className={`font-semibold p-4 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>{error}</div>
            ) : (
              <ActivityTable activities={activities} />
            )}
          </div>
          
          {/* Transaction Summary - Takes 1/3 on large screens */}
          <div className="xl:col-span-1">
            {loading ? (
              <div className={`h-64 rounded-2xl animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            ) : error ? (
              <div className={`font-semibold p-4 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>{error}</div>
            ) : (
              <TransactionSummary metrics={metrics} />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
