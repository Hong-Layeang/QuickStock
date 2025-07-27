import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../configs/config';
import useThemeStore from '../stores/useThemeStore';

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hover:cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.31-2.252A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L6 18m12-12l-1.414 1.414" /></svg>
);

const SalesAnalyticsChart = ({ loading, data }) => {
  const { isDark } = useThemeStore();
  const [isValueBlurred, setIsValueBlurred] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  // Process data for 7 days only
  useEffect(() => {
    if (data && data.length > 0) {
      const processedData = data.map(item => ({
        name: item.name,
        sales: item.sales || 0, // use total quantity sold from backend
        value: item.value || 0
      }));
      setChartData(processedData);
      const total = processedData.reduce((sum, item) => sum + (item.value || 0), 0);
      setTotalValue(total);
    } else {
      setChartData([]);
      setTotalValue(0);
    }
  }, [data]);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Sales: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-2xl p-6 shadow-sm border mb-6 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header with controls and total value */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className={`text-xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Total Sales</h2>
          <p className={`${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Track your sales performance over time</p>
        </div>
        {/* Total Value Display with Blur Toggle */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Total Value</span>
            <button
              aria-label={isValueBlurred ? 'Show value' : 'Hide value'}
              onClick={() => setIsValueBlurred(v => !v)}
              className={`rounded-full p-1.5 hover:bg-gray-200 hover:cursor-pointer dark:hover:bg-gray-700 transition-colors`}
            >
              <EyeIcon open={!isValueBlurred} />
            </button>
          </div>
          <span className={`text-2xl font-bold text-green-600 transition-all duration-200 ${isValueBlurred ? 'blur-sm select-none' : ''}`}>${totalValue.toFixed(2)}</span>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className={`w-full h-[260px] rounded-xl animate-pulse ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
      ) : (
        <div className="w-full h-[260px] transition-all duration-300">
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="name" 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
              />
              <YAxis 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#2563eb' }} 
                activeDot={{ r: 8, fill: '#1d4ed8' }}
                name="Total Sales"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesAnalyticsChart; 