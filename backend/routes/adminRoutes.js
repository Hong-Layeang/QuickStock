import express from 'express';
import { getAdminDashboard, getAdminReports, getAdminAnalytics } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Admin dashboard data
router.get('/dashboard', verifyToken, roleCheck('admin'), getAdminDashboard);

// Admin reports
router.get('/reports', verifyToken, roleCheck('admin'), getAdminReports);

// Analytics data
router.get('/analytics', verifyToken, roleCheck('admin'), getAdminAnalytics);

export default router; 