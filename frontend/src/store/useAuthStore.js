import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

let logoutTimer;

const useAuthStore = create((set) => ({
    user: null,
    token: null,

    login: async (email, password) => {
        try {
            const res = await axios.post('/api/login', { email, password });
            const { token, user } = res.data;

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
        clearTimeout(logoutTimer); // cancel the scheduled logout
        set({ token: null, user: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },


    loading: true, // wait for token and user retrieved before continue

    loadUserFromStorage: () => {
        set({ loading: true });

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token) {
            const { exp } = jwtDecode(token); // get expiration time
            const expiryTime = exp * 1000;
            const currentTime = Date.now();

            if (currentTime >= expiryTime) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ loading: false });
                return;
            }

            // Auto-logout when token expires
            const timeout = expiryTime - currentTime;
            logoutTimer = setTimeout(() => {
                toast.error("Session expired. Please log in again.");
                set({ token: null, user: null });
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = "/unauthorized?msg=expired"; // redirect to login
            }, timeout);
        }

        if (token && user ) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            set({ token, user, loading: false }); // restore both token and user
        } else {
            set({ loading: false });
        }
    },
}));

export default useAuthStore;