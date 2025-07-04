// Simulate a mock API for admin products
export async function getAdminProducts() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch products.');
  }
  return [
    {
      id: 1,
      name: 'Wireless Mouse',
      sku: 'WM-1001',
      category: 'Accessories',
      stock: 32,
      price: 19.99,
      status: 'active',
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      sku: 'MK-2002',
      category: 'Accessories',
      stock: 20,
      price: 59.99,
      status: 'active',
    },
    {
      id: 3,
      name: 'HD Monitor',
      sku: 'HDM-3003',
      category: 'Displays',
      stock: 8,
      price: 129.99,
      status: 'low-stock',
    },
    {
      id: 4,
      name: 'USB-C Cable',
      sku: 'USBC-4004',
      category: 'Cables',
      stock: 0,
      price: 7.99,
      status: 'out-of-stock',
    },
    {
      id: 5,
      name: 'Laptop Stand',
      sku: 'LS-5005',
      category: 'Accessories',
      stock: 15,
      price: 24.99,
      status: 'active',
    },
  ];
} 