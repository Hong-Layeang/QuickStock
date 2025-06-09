import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginSupplier = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user
        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({ sucess: false, message: "User not found" });

        // 2. Check role
        if (user.role !== 'supplier') {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // 3. Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        // 4. Create token
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};