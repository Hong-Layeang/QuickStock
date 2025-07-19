import express from 'express';
import { getAdminDashboard, getAdminOrders, getAnalyticsData } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Admin dashboard data
router.get('/dashboard', verifyToken, roleCheck, getAdminDashboard);

// Admin orders (placeholder)
router.get('/orders', verifyToken, roleCheck, getAdminOrders);

// Analytics data for different time periods
router.get('/analytics', verifyToken, roleCheck, getAnalyticsData);

export default router; 