import {create} from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../configs/config.js';

const useUserStore = create((set) => ({
    users: [],
    loading: false,
    error: null,
    setUser: (users) => set({ users }),

    // Fetch all users
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ users: res.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch users', loading: false });
        }
    },

    // Fetch current user profile
    fetchCurrentUser: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch current user', loading: false });
            return null;
        }
    },

    // create a new supplier or admin by admin
    createUser: async (newUser) => {
        if (!newUser.email || !newUser.password) {
            return { success: false, message: "Please fill in all fields." };
        }
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/users`, newUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const createdUser = res.data;
            set((state) => ({ users: [...state.users, createdUser] }));
            return { success: true, message: "User created successfully" };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong."
            };
        }
    },

    // Edit user
    editUser: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_BASE_URL}/api/users/${id}`, updates, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set((state) => ({
                users: state.users.map((u) => (u.id === id ? res.data : u)),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update user', loading: false });
            return { success: false, message: error.response?.data?.message || 'Failed to update user' };
        }
    },

    // Delete user
    deleteUser: async (id) => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
                loading: false
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete user', loading: false });
            return { success: false, message: error.response?.data?.message || 'Failed to delete user' };
        }
    },
}));

export default useUserStore;