import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useThemeStore from '../store/useThemeStore';

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
  const { isDark } = useThemeStore();
  return (
    <div className={`rounded-2xl p-6 shadow-sm border mb-6 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-xl font-bold mb-2 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Sales Analytics</h2>
      <p className={`mb-4 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>Sales performance over the last 7 days</p>
      {loading ? (
        <div className={`w-full h-[260px] rounded-xl animate-pulse ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
      ) : error ? (
        <div className={`w-full h-[260px] flex items-center justify-center font-semibold rounded-xl ${
          isDark 
            ? 'text-red-400 bg-red-900/20' 
            : 'text-red-600 bg-red-50'
        }`}>{error}</div>
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