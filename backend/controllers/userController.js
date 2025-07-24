// controllers/UserController.js

import User from "../models/User.js";
import hashPassword from "../node.bcrypt.js";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        
        // Transform users to include name field for frontend compatibility
        const usersWithName = users.map(user => ({
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
        
        res.status(200).json(usersWithName);
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
    const { name, email, password, role } = req.body;

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
        });

        // Return user data with name field for frontend compatibility
        const userData = {
            id: newUser.id,
            name: newUser.username,
            email: newUser.email,
            role: newUser.role,
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
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
