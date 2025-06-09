const DashboardCards = () => {
  const cards = [
    { title: "Total Products:", value: "1,245 products", bg: "bg-indigo-500", text: "text-white" },
    { title: "Low in Stock:", value: "32 items", bg: "bg-red-500", text: "text-white" },
    { title: "Recent Stock-In:", value: "5 products", bg: "bg-green-600", text: "text-white" },
    { title: "Recent Stock-Out:", value: "3 products", bg: "bg-yellow-500", text: "text-white" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`rounded-xl shadow-md p-5 ${card.bg} ${card.text}`}>
          <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
          <p className="text-3xl font-bold">{card.value}</p>
          <div className="text-sm underline mt-2 cursor-pointer">View</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
