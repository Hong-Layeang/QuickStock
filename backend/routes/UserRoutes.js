import express from 'express';
import { getUsers, createUser, editUser, deleteUser, getUsersById} from "../controllers/userController.js";

const router = express.Router();

router.get('/', getUsers);        // GET all users
router.get('/:id', getUsersById);
router.post('/', createUser);     // Create user
router.put('/:id', editUser);     // Edit user
router.delete('/:id', deleteUser); // Delete user

export default router;
