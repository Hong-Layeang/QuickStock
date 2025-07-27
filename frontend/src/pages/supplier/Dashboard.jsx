import SupplierLayout from "../../components/supplier/SupplierLayout.jsx"
import DashboardCards from "../../components/DashboardCards.jsx"
import ActivityTable from "../../components/ActivityTable.jsx"
import TransactionSummary from "../../components/TransactionSummary.jsx"
import SalesAnalyticsChart from "../../components/SalesAnalyticsChart.jsx"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { API_BASE_URL } from "../../configs/config"
import useThemeStore from "../../stores/useThemeStore.js"
import useAuthStore from "../../stores/useAuthStore.js"

export default function DashBoard() {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const [cards, setCards] = useState(undefined)
  const [activities, setActivities] = useState(undefined)
  const [metrics, setMetrics] = useState(undefined)
  const [analyticsData, setAnalyticsData] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/supplier/dashboard`, {
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
      console.error('Supplier dashboard fetch error:', err)
      setError(err.response?.data?.message || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch supplier analytics (similar to admin but for supplier's data)
  const fetchSupplierAnalytics = useCallback(async () => {
    setAnalyticsLoading(true)
    try {
      const token = localStorage.getItem('token')
      // For now, we'll use the supplier reports as analytics data
      const response = await axios.get(`${API_BASE_URL}/api/supplier/reports`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.success) {
        // Transform supplier reports into analytics data
        const reports = response.data.data || []
        const last7Days = []
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]
          const startOfDay = new Date(date.setHours(0, 0, 0, 0))
          const endOfDay = new Date(date.setHours(23, 59, 59, 999))
          
          const dayReports = reports.filter(report => {
            const reportDate = new Date(report.createdAt)
            return reportDate >= startOfDay && reportDate <= endOfDay
          })
          
          const totalSales = dayReports.reduce((sum, report) => sum + (report.quantity || 0), 0)
          const totalValue = dayReports.reduce((sum, report) => sum + (report.totalPrice || 0), 0)
          
          last7Days.push({
            name: dayName,
            sales: totalSales,
            value: totalValue,
            reports: dayReports.length
          })
        }
        
        setAnalyticsData(last7Days)
      } else {
        setAnalyticsData([])
      }
    } catch (err) {
      console.error('Supplier analytics fetch error:', err)
      setAnalyticsData([])
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
    fetchSupplierAnalytics()
  }, [fetchDashboard, fetchSupplierAnalytics])

  return (
    <SupplierLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div className={`rounded-2xl p-6 shadow-md border ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, {user?.name || 'Supplier'}! 👋
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Here's an overview of your products and performance today.
          </p>
        </div>

        {/* Error message as warning, but always show dashboard */}
        {error && (
          <div className={`font-semibold p-4 rounded-xl border ${
            isDark ? 'bg-red-900/20 text-red-400 border-red-700' : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {error}
          </div>
        )}

        {/* Sales Analytics Chart */}
        <SalesAnalyticsChart 
          loading={loading || analyticsLoading} 
          data={analyticsData}
          title="Your Sales Performance"
          subtitle="Track your daily sales and revenue"
        />

        {/* Dashboard Cards */}
        <DashboardCards 
          cards={cards} 
          loading={loading} 
          onRefresh={() => { fetchDashboard(); fetchSupplierAnalytics(); }}
        />

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8">
          {/* Activity Table - Takes 3/5 on large screens */}
          <div className="xl:col-span-3">
            {loading ? (
              <div className={`h-64 rounded-2xl animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            ) : (
              <ActivityTable 
                activities={activities} 
                title="Your Recent Activity"
                subtitle="Track your product and sales activities"
              />
            )}
          </div>
          
          {/* Transaction Summary - Takes 2/5 on large screens */}
          <div className="xl:col-span-2">
            {loading ? (
              <div className={`h-64 rounded-2xl animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            ) : (
              <TransactionSummary 
                metrics={metrics}
                title="Revenue & Sales Summary"
                subtitle="Your business performance metrics"
              />
            )}
          </div>
        </div>
      </div>
    </SupplierLayout>
  )
}
