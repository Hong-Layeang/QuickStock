import express from 'express';
import { getAdminDashboard, getAdminReports, getAnalyticsData } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Admin dashboard data
router.get('/dashboard', verifyToken, roleCheck, getAdminDashboard);

// Admin reports (placeholder)
router.get('/reports', verifyToken, roleCheck, getAdminReports);

// Analytics data for different time periods
router.get('/analytics', verifyToken, roleCheck, getAnalyticsData);

export default router; 