import {create} from 'zustand';

const mockUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'supplier',
    status: 'active',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'supplier',
    status: 'inactive',
  },
  {
    id: 4,
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'admin',
    status: 'active',
  },
];

const useUserStore = create((set) => ({
    users: mockUsers,
    loading: false,
    error: null,
    setUser: (users) => set({ users }),

    // Fetch all users
    fetchUsers: async () => {
        set({ loading: true, error: null });
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ users: mockUsers, loading: false });
    },

    // create a new supplier or admin by admin
    createUser: async (newUser) => {
        if (!newUser.email || !newUser.password) {
            return { success: false, message: "Please fill in all fields." };
        }
        
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const createdUser = {
            ...newUser,
            id: Date.now(), // Generate a simple ID
            status: 'active',
        };
        
        set((state) => ({ users: [...state.users, createdUser] }));
        return { success: true, message: "User created successfully" };
    },

    // Edit user
    editUser: async (id, updates) => {
        set({ loading: true, error: null });
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => ({
            users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
            loading: false
        }));
        return { success: true };
    },

    // Delete user
    deleteUser: async (id) => {
        set({ loading: true, error: null });
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => ({
            users: state.users.filter((u) => u.id !== id),
            loading: false
        }));
        return { success: true };
    },
}));

export default useUserStore;