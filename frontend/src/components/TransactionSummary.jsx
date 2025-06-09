const TransactionSummary = () => {
  const metrics = [
    { label: "Total Sales (Today)", value: "$1,240" },
    { label: "Total Sales (This Week)", value: "$9,880" },
    { label: "Best-Selling Product", value: "Mouse" },
    { label: "Total Items Sold (This Week)", value: "340 units" }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Transactions Summary</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2">Metric</th>
            <th className="py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="py-2">{item.label}</td>
              <td className="py-2">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionSummary;
