import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const sampleData = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 700 },
  { name: 'Wed', sales: 600 },
  { name: 'Thu', sales: 900 },
  { name: 'Fri', sales: 800 },
  { name: 'Sat', sales: 1100 },
  { name: 'Sun', sales: 950 },
];

const SalesAnalyticsChart = ({ loading, error, data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sales Analytics</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Sales performance over the last 7 days</p>
      {loading ? (
        <div className="w-full h-[260px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      ) : error ? (
        <div className="w-full h-[260px] flex items-center justify-center text-red-600 dark:text-red-400 font-semibold rounded-xl bg-red-50 dark:bg-red-900/20">{error}</div>
      ) : (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={data && data.length > 0 ? data : sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesAnalyticsChart; 