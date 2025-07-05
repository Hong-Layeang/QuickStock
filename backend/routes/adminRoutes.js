import express from 'express';
import { getAdminDashboard, getAdminOrders } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Admin dashboard data
router.get('/dashboard', verifyToken, roleCheck, getAdminDashboard);

// Admin orders (placeholder)
router.get('/orders', verifyToken, roleCheck, getAdminOrders);

export default router; 