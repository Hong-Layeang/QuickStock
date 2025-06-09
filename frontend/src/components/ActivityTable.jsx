const ActivityTable = () => {
  const activities = [
    {
      date: "2025-05-17 10:45AM",
      activity: "Stocked In Keyboard (20 pcs)",
      by: "Admin (Alice)"
    },
    {
      date: "2025-05-17 10:45AM",
      activity: "Deleted Old Printer",
      by: "Admin (Bob)"
    }
  ];

  return (
    <div className="shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2">Date/Time</th>
            <th className="py-2">Activity</th>
            <th className="py-2">Performed By</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="py-2">{item.date}</td>
              <td className="py-2">{item.activity}</td>
              <td className="py-2">{item.by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
