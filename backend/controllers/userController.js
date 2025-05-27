import User from "../models/User.js"
import hashPassword from "../node.bcrypt.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}); // fetch all users
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log("Error in fetching users data:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getUsersById = async (req, res) => {

};

export const createUser = async (req, res) => {
    const { email, password } = req.body;

    // hash password before saving
    const hashedPassword = await hashPassword(password);
    const namePart = email.split("@")[0];

    const newUser = new User ({
        username: namePart,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser })
    } catch (error) {
        console.log("Error in create user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" })
    }
};

export const editUser = async (req, res) => {

};

export const deleteUser = async (req, res) => {

};