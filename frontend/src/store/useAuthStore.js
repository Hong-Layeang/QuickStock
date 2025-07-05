import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

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

// Mock users for authentication
const mockUsers = [
    {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
    },
    {
        email: 'supplier@example.com',
        password: 'supplier123',
        name: 'Supplier User',
        role: 'supplier',
    },
];

// Generate a mock JWT token
function generateMockToken(user) {
    const payload = {
        userId: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
        iat: Math.floor(Date.now() / 1000),
    };
    
    // Create a simple mock token (not a real JWT, but good enough for demo)
    return btoa(JSON.stringify(payload));
}

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    loading: true,
    sessionExpired: false,

    login: async (email, password) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Find user in mock data
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            const token = generateMockToken(user);
            const userData = {
                id: user.email,
                name: user.name,
                email: user.email,
                role: user.role,
            };

            set({ token, user: userData });

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setAutoLogout(token, set);

            return { success: true, role: user.role };
        } else {
            return { success: false, message: 'Invalid email or password' };
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
            try {
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
            } catch {
                // If token is invalid, clear it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ token: null, user: null, loading: false });
                return;
            }
        }

        if (token && user) {
            try {
                const decoded = jwtDecode(token);

                if (decoded.role) {
                    user.role = decoded.role;
                }
                set({ token, user, loading: false });
            } catch {
                // If token is invalid, clear it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ token: null, user: null, loading: false });
            }
        } else {
            set({ loading: false });
        }
    },

    resetSessionExpired: () => set({ sessionExpired: false })
}));

export default useAuthStore;