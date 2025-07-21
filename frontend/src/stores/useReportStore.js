import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../configs/config';

const useReportStore = create((set) => ({
  reports: [],
  loading: false,
  error: null,

  // Admin: fetch all reports
  fetchAdminReports: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/reports`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ reports: res.data.data, loading: false });
    } catch (error) {
      set({
        reports: [],
        error: error.response?.data?.message || 'Failed to fetch reports',
        loading: false
      });
    }
  },

  // Supplier: fetch own reports
  fetchSupplierReports: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/supplier/reports`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ reports: res.data.data, loading: false });
    } catch (error) {
      set({
        reports: [],
        error: error.response?.data?.message || 'Failed to fetch reports',
        loading: false
      });
    }
  },

  // Supplier: submit a new report
  submitReport: async (reportData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/supplier/reports`, reportData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set((state) => ({ reports: [res.data.data, ...state.reports], loading: false }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to submit report', loading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to submit report' };
    }
  },
}));

export default useReportStore; 