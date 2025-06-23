const DashboardCards = () => {
  const cards = [
    { title: "Total Products", value: "1,245", subtitle: "products", bg: "bg-blue-500", text: "text-white" },
    { title: "Low in Stock", value: "32", subtitle: "items", bg: "bg-red-500", text: "text-white" },
    { title: "Recent Stock-In", value: "5", subtitle: "products", bg: "bg-green-600", text: "text-white" },
    { title: "Recent Stock-Out", value: "3", subtitle: "products", bg: "bg-yellow-500", text: "text-white" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`${card.bg} ${card.text} rounded-xl shadow-md`}>
          <div className="p-4 md:p-6">
            <div className="space-y-2">
              <h3 className="text-sm md:text-base font-medium opacity-90">{card.title}</h3>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
                <p className="text-xs md:text-sm opacity-80">{card.subtitle}</p>
              </div>
              <button className="text-xs md:text-sm underline opacity-90 hover:opacity-100 transition-opacity">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards
