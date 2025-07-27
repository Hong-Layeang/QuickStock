// User routes for QuickStock API
import express from 'express';
import { getUsers, createUser, editUser, deleteUser, getUsersById, getCurrentUser} from "../controllers/userController.js";
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getUsers);        // GET all users
router.get('/me', verifyToken, getCurrentUser); // GET current user profile
router.get('/:id', verifyToken, getUsersById);
router.post('/', verifyToken, createUser);     // Create user
router.put('/:id', verifyToken, editUser);     // Edit user
router.delete('/:id', verifyToken, deleteUser); // Delete user

export default router;
