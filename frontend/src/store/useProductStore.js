import { create } from 'zustand';

const mockProducts = [
  {
    id: 1,
    name: 'Wireless Mouse',
    category: 'Accessories',
    unitprice: 19.99,
    status: 'in stock',
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    unitprice: 59.99,
    status: 'in stock',
  },
  {
    id: 3,
    name: 'HD Monitor',
    category: 'Displays',
    unitprice: 129.99,
    status: 'low stock',
  },
  {
    id: 4,
    name: 'USB-C Cable',
    category: 'Cables',
    unitprice: 7.99,
    status: 'out of stock',
  },
  {
    id: 5,
    name: 'Laptop Stand',
    category: 'Accessories',
    unitprice: 24.99,
    status: 'in stock',
  },
];

const useProductStore = create((set) => ({
  products: mockProducts,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ products: mockProducts, loading: false });
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newProduct = {
      ...product,
      id: Date.now(), // Generate a simple ID
    };
    
    set((state) => ({ products: [...state.products, newProduct], loading: false }));
    return { success: true };
  },

  editProduct: async (id, updates) => {
    set({ loading: true, error: null });
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      loading: false
    }));
    return { success: true };
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      loading: false
    }));
    return { success: true };
  },
}));

export default useProductStore; 