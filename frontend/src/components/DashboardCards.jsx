import { Boxes, PackagePlus, CircleAlert, PackageMinus } from "lucide-react"

const DashboardCards = () => {
  const cards = [
    { icon: <Boxes />, title: "Total Products", value: "1,245", subtitle: "products", bg: "bg-blue-500", text: "text-white" },
    { icon: <CircleAlert />, title: "Low in Stock", value: "32", subtitle: "items", bg: "bg-red-500", text: "text-white" },
    { icon: <PackagePlus />, title: "Recent Stock-In", value: "5", subtitle: "products", bg: "bg-green-600", text: "text-white" },
    { icon: <PackageMinus />, title: "Recent Stock-Out", value: "3", subtitle: "products", bg: "bg-yellow-500", text: "text-white" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`${card.bg} ${card.text} rounded-xl shadow-md`}>
          <div className="p-4 md:p-6">
            <div className="space-y-2">
              <div className="flex justify-center gap-2">
                <div className="w-5 h-5">{card.icon}</div>
                <h3 className="text-sm md:text-base font-medium opacity-90">{card.title}</h3>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
                <p className="text-xs md:text-sm opacity-80">{card.subtitle}</p>
              </div>
              <button className="text-xs text-blue-700 md:text-sm underline opacity-75 hover:opacity-100 transition-opacity hover:cursor-pointer">
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
