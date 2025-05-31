import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: null,
    token: null,

    login: async (email, password) => {
        try {
            const res = await axios.post('/api/login', { email, password });
            const { token, user } = res.data;

            set({ token, user });
            
            // Save token & user in localStorage for persistence
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },

    logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    loadUserFromStorage: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && user ) {
            set({ token, user }); // restore both token and user
        }
    },
}));

export default useAuthStore;