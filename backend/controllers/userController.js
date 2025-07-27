// controllers/UserController.js

import User from "../models/User.js";
import hashPassword from "../node.bcrypt.js";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        // Return all relevant fields for frontend compatibility
        const usersWithAllFields = users.map(user => ({
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            birthdate: user.birthdate,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
        res.status(200).json(usersWithAllFields);
    } catch (error) {
        console.error("Error in fetching users data:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get user by ID
export const getUsersById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user by ID:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { name, email, password, role, phone, address, gender, birthdate } = req.body;

    // Ensure only supplier role can be created through registration
    const userRole = role === "admin" ? "supplier" : (role || "supplier");

    try {
        const hashedPassword = await hashPassword(password);
        const username = name || email.split("@")[0];

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: userRole,
            phone,
            address,
            gender,
            birthdate
        });

        // Log user creation
        const ActivityLog = (await import('../models/ActivityLog.js')).default;
        await ActivityLog.create({
            userId: newUser.id,
            activity: `User registered (${userRole})`,
            type: 'user',
            status: 'completed',
        });

        // Return user data with all fields for frontend compatibility
        const userData = {
            id: newUser.id,
            name: newUser.username,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            address: newUser.address,
            gender: newUser.gender,
            birthdate: newUser.birthdate,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.status(201).json(userData);
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Edit user
export const editUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.username = name || user.username;
        user.email = email || user.email;
        if (password) {
            user.password = await hashPassword(password);
        }

        await user.save();
        
        // Return user data with name field for frontend compatibility
        const userData = {
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error editing user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.destroy();
        // Log user deletion
        const ActivityLog = (await import('../models/ActivityLog.js')).default;
        await ActivityLog.create({
            userId: req.user?.id || user.id,
            activity: `User deleted (${user.username})`,
            type: 'user',
            status: 'completed',
        });
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
    try {
        console.log('getCurrentUser - req.user:', req.user); // Debug log
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Return complete user profile
        const userProfile = {
            id: user.id,
            name: user.username,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            birthdate: user.birthdate,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        res.status(200).json(userProfile);
    } catch (error) {
        console.error("Error fetching current user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
