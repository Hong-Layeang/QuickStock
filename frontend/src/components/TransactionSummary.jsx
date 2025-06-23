const TransactionSummary = () => {
  const metrics = [
    { label: "Total Sales (Today)", value: "$1,240" },
    { label: "Total Sales (This Week)", value: "$9,880" },
    { label: "Best-Selling Product", value: "Mouse" },
    { label: "Total Items Sold (This Week)", value: "340 units" },
  ]

  return (
    <div className="shadow-md rounded-lg">
      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Transaction Summary</h2>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-sm font-medium">Metric</th>
                <th className="py-2 text-sm font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3 text-sm">{item.label}</td>
                  <td className="py-3 text-sm font-medium">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {metrics.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TransactionSummary
