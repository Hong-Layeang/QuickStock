import {create} from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../configs/config';

const useUserStore = create((set) => ({
    users: [],
    setUser: (users) => set({ users }),

    // create a new supplier by admin
    createUser: async (newUser) => {
        if (!newUser.email || !newUser.password) {
            return { success: false, message: "Please fill in all fields." };
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/api/users`, newUser);

            const createdUser = res.data;
            // automatically updates component without refresh page
            set((state) => ({ users: [...state.users, createdUser] }));
            return { success: true, message: "User created successfully" };
        } catch (error) {
            console.log('Error creating user:', error.res?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong."
            };
        }
    }
}));

export default useUserStore;