// Simulate a mock API for admin dashboard data
export async function getAdminDashboardData() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Simulate random error (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch dashboard data.');
  }

  // Generate dynamic values for more realistic data
  const totalProducts = Math.floor(Math.random() * 500) + 1000; // 1000-1500
  const lowStockItems = Math.floor(Math.random() * 20) + 20; // 20-40
  const recentStockIn = Math.floor(Math.random() * 10) + 1; // 1-10
  const recentStockOut = Math.floor(Math.random() * 8) + 1; // 1-8

  return {
    cards: [
      {
        icon: 'boxes',
        title: 'Total Products',
        value: totalProducts.toLocaleString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
        text: 'text-white',
        trend: `+${Math.floor(Math.random() * 15) + 5}%`,
        trendDirection: 'up',
        change: 'from last month',
        link: '/admin/products',
        description: 'Total number of products in inventory'
      },
      {
        icon: 'circle-alert',
        title: 'Low in Stock',
        value: lowStockItems.toString(),
        subtitle: 'items',
        bg: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
        text: 'text-white',
        trend: `+${Math.floor(Math.random() * 10) + 1}%`,
        trendDirection: 'up',
        change: 'from last week',
        link: '/admin/products?filter=low-stock',
        description: 'Products that need restocking'
      },
      {
        icon: 'package-plus',
        title: 'Recent Stock-In',
        value: recentStockIn.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
        text: 'text-white',
        trend: `+${Math.floor(Math.random() * 12) + 3}%`,
        trendDirection: 'up',
        change: 'from yesterday',
        link: '/admin/products?filter=stock-in',
        description: 'Products added to inventory recently'
      },
      {
        icon: 'package-minus',
        title: 'Recent Stock-Out',
        value: recentStockOut.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600',
        text: 'text-white',
        trend: `-${Math.floor(Math.random() * 5) + 1}%`,
        trendDirection: 'down',
        change: 'from yesterday',
        link: '/admin/products?filter=stock-out',
        description: 'Products that went out of stock'
      },
    ],
    activities: [
      {
        date: '2025-05-17 10:45AM',
        activity: 'Stocked In Keyboard (20 pcs)',
        by: 'Admin (Alice)',
        type: 'stock-in',
        status: 'completed',
      },
      {
        date: '2025-05-17 09:30AM',
        activity: 'Deleted Old Printer',
        by: 'Admin (Bob)',
        type: 'delete',
        status: 'completed',
      },
      {
        date: '2025-05-17 08:15AM',
        activity: 'Updated Product Price',
        by: 'Supplier (John)',
        type: 'update',
        status: 'completed',
      },
      {
        date: '2025-05-16 16:20PM',
        activity: 'Low Stock Alert - Mouse',
        by: 'System',
        type: 'alert',
        status: 'pending',
      },
      {
        date: '2025-05-16 14:10PM',
        activity: 'New Order Received',
        by: 'Customer Portal',
        type: 'order',
        status: 'completed',
      },
    ],
    metrics: [
      {
        label: 'Total Sales (Today)',
        value: '$1,240',
        change: '+12%',
        icon: 'dollar-sign',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
      },
      {
        label: 'Total Sales (This Week)',
        value: '$9,880',
        change: '+8%',
        icon: 'trending-up',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      },
      {
        label: 'Best-Selling Product',
        value: 'Mouse',
        change: 'Wireless Pro',
        icon: 'package',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      },
      {
        label: 'Total Items Sold (This Week)',
        value: '340 units',
        change: '+15%',
        icon: 'bar-chart-3',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      },
    ],
  };
} 