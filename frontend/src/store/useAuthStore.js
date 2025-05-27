import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: null,
    token: null,

    login: async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const { token, user } = res.data;

            set({ token, user });

            
            // Optional: Save token in localStorage for persistence
            localStorage.setItem('token', token);

            return { success: true };
        } catch (error) {
            return { success: false, message: error.res?.data?.message || error.message };
        }
    },

    logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem('token');
    },

    loadUserFromStorage: () => {
        const token = localStorage.getItem('token');
        if (token) {
            // You might decode token to get user info (e.g. with jwt-decode lib)
            // For simplicity, let's just store token and rely on backend to verify
        set({ token });
            // Optionally fetch user info from backend here
        }
    }
}));

export default useAuthStore;