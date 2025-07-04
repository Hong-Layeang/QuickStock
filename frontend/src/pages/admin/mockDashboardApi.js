// Simulate a mock API for admin dashboard data
export async function getAdminDashboardData() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Simulate random error (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch dashboard data.');
  }

  return {
    cards: [
      {
        icon: 'boxes',
        title: 'Total Products',
        value: '1,245',
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        text: 'text-white',
        trend: '+12%',
        trendDirection: 'up',
        change: 'from last month',
        link: '/admin/products',
      },
      {
        icon: 'circle-alert',
        title: 'Low in Stock',
        value: '32',
        subtitle: 'items',
        bg: 'bg-gradient-to-br from-red-500 to-red-600',
        text: 'text-white',
        trend: '+5%',
        trendDirection: 'up',
        change: 'from last week',
        link: '/admin/products?filter=low-stock',
      },
      {
        icon: 'package-plus',
        title: 'Recent Stock-In',
        value: '5',
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-green-500 to-green-600',
        text: 'text-white',
        trend: '+8%',
        trendDirection: 'up',
        change: 'from yesterday',
        link: '/admin/products?filter=stock-in',
      },
      {
        icon: 'package-minus',
        title: 'Recent Stock-Out',
        value: '3',
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        text: 'text-white',
        trend: '-2%',
        trendDirection: 'down',
        change: 'from yesterday',
        link: '/admin/products?filter=stock-out',
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