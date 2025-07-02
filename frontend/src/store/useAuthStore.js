import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

let logoutTimer;

function setAutoLogout(token, set) {
    const { exp } = jwtDecode(token);
    const expiryTime = exp * 1000;
    const timeout = expiryTime - Date.now();

    console.log("Setting auto logout in", timeout, "ms");

    if (timeout <= 0) {
        axios.defaults.headers.common['Authorization'] = undefined;
        set((state) => ({
            ...state,
            token: null,
            user: null,
            sessionExpired: true,
        }));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
    }

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

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    loading: true,
    sessionExpired: false,

    login: async (email, password) => {
        try {
            const res = await axios.post('/api/login', { email, password });
            const { token, user } = res.data;

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            set({ token, user, loading: false });

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
        axios.defaults.headers.common['Authorization'] = undefined;
        set({ token: null, user: null, sessionExpired: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    loadUserFromStorage: () => {
        set({ loading: true });

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

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
            set({ token, user, loading: false });
        } else {
            set({ loading: false });
        }
    },

    resetSessionExpired: () => set({ sessionExpired: false })
}));

export default useAuthStore;
