import { getUsers, createUser, editUser, deleteUser} from "../controllers/userController.js";

import express from 'express';

const router = express.Router();

router.get('/', getUsers);        // GET all users
router.post('/', createUser);     // Create user
router.put('/:id', editUser);     // Edit user
router.delete('/:id', deleteUser); // Delete user

export default router;
