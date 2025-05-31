import express from 'express';
import { loginSupplier } from '../controllers/authController.js';

const router = express.Router();

router.post('/', loginSupplier);

export default router;