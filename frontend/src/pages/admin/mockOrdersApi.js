// Simulate a mock API for admin orders
export async function getAdminOrders() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch orders.');
  }
  return [
    {
      id: 1001,
      customer: 'Alice Smith',
      products: ['Wireless Mouse', 'USB-C Cable'],
      total: 27.98,
      status: 'pending',
      date: '2025-05-17',
    },
    {
      id: 1002,
      customer: 'Bob Johnson',
      products: ['Mechanical Keyboard'],
      total: 59.99,
      status: 'completed',
      date: '2025-05-16',
    },
    {
      id: 1003,
      customer: 'Carol Lee',
      products: ['HD Monitor', 'Laptop Stand'],
      total: 154.98,
      status: 'cancelled',
      date: '2025-05-15',
    },
    {
      id: 1004,
      customer: 'David Kim',
      products: ['Wireless Mouse'],
      total: 19.99,
      status: 'pending',
      date: '2025-05-15',
    },
    {
      id: 1005,
      customer: 'Eva Green',
      products: ['USB-C Cable', 'Laptop Stand'],
      total: 32.98,
      status: 'completed',
      date: '2025-05-14',
    },
  ];
} 