import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../configs/config';

let logoutTimer;

function setAutoLogout(token, set) {
    // Clear any existing timer to prevent duplicate toasts
    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }
    const { exp } = jwtDecode(token);
    const expiryTime = exp * 1000;
    const timeout = expiryTime - Date.now();

    if (timeout > 0) {
        logoutTimer = setTimeout(() => {
            toast.error("Session expired. Please log in again.");
            set((state) => ({
                ...state,
                token: null,
                user: null,
                sessionExpired: true,
            }));
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }, timeout);
    }
}

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    loading: true,
    sessionExpired: false,

    login: async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/login`, { email, password });
            const { token, user } = res.data;

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            set({ token, user, sessionExpired: false });

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setAutoLogout(token, set);

            return { success: true, role: user.role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },

    logout: () => {
        clearTimeout(logoutTimer);
        set({ token: null, user: null, sessionExpired: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    loadUserFromStorage: () => {
        set({ loading: true });

        const token = localStorage.getItem('token');
        let user = null;

        try {
            const userData = localStorage.getItem('user');
            if (userData && userData !== "undefined") {
                user = JSON.parse(userData);
            }
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            localStorage.removeItem('user'); // clear corrupted data
        }

        if (token) {
            const { exp } = jwtDecode(token);
            const expiryTime = exp * 1000;
            const currentTime = Date.now();

            if (currentTime >= expiryTime) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ token: null, user: null, loading: false, sessionExpired: true });
                return;
            }

            setAutoLogout(token, set);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        if (token && user) {
        const decoded = jwtDecode(token);

        if (decoded.role) {
            user.role = decoded.role;
        }
        set({ token, user, loading: false });
        } else {
            set({ loading: false });
        }
    },

    resetSessionExpired: () => set({ sessionExpired: false })
}));

export default useAuthStore;