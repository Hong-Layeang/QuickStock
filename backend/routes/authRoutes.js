import express from 'express';
import { loginSupplier } from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { supplierOnly } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', loginSupplier, verifyToken, supplierOnly);

export default router;