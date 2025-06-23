const ActivityTable = () => {
  const activities = [
    {
      date: "2025-05-17 10:45AM",
      activity: "Stocked In Keyboard (20 pcs)",
      by: "Admin (Alice)",
    },
    {
      date: "2025-05-17 10:45AM",
      activity: "Deleted Old Printer",
      by: "Admin (Bob)",
    },
  ]

  return (
    <div className="shadow-md rounded-lg">
      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Activities</h2>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-sm font-medium">Date/Time</th>
                <th className="py-2 text-sm font-medium">Activity</th>
                <th className="py-2 text-sm font-medium">Performed By</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3 text-sm">{item.date}</td>
                  <td className="py-3 text-sm">{item.activity}</td>
                  <td className="py-3 text-sm">{item.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {activities.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500">Date/Time</span>
                <span className="text-sm font-medium">{item.date}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500">Activity</span>
                <span className="text-sm">{item.activity}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500">Performed By</span>
                <span className="text-sm">{item.by}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActivityTable
