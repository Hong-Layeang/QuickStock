import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../configs/config';

const useSupplierProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/supplier/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ products: res.data, loading: false });
    } catch (error) {
      console.error('Supplier products fetch error:', error);
      set({ error: error.response?.data?.message || 'Failed to fetch products', loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/products`, product, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set((state) => ({ products: [...state.products, res.data], loading: false }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add product', loading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to add product' };
    }
  },

  editProduct: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE_URL}/api/products/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? res.data : p)),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update product', loading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to update product' };
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete product', loading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to delete product' };
    }
  },
}));

export default useSupplierProductStore; 