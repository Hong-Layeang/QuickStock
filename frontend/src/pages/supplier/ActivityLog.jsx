import SupplierLayout from "../../components/supplier/SupplierLayout.jsx";
import ActivityTable from "../../components/ActivityTable.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../configs/config";

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityLog = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/supplier/activity-log`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setActivities(response.data.data);
        } else {
          setError('Failed to load activity log.');
        }
      } catch (err) {
        console.error('Activity log fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load activity log.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLog();
  }, []);

  return (
    <SupplierLayout>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Activity Log</h2>
            <p className="text-gray-600 dark:text-gray-400">View your inventory activity here.</p>
          </div>
        </div>
        
        {loading ? (
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        ) : error ? (
          <div className="text-red-600 dark:text-red-400 font-semibold p-4">{error}</div>
        ) : (
          <ActivityTable activities={activities} />
        )}
      </div>
    </SupplierLayout>
  );
} 