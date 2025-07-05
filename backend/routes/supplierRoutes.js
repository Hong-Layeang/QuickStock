import express from 'express';
import { getSupplierDashboard, getSupplierProducts, getSupplierActivityLog } from '../controllers/supplierController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Supplier dashboard data
router.get('/dashboard', verifyToken, roleCheck, getSupplierDashboard);

// Supplier's products
router.get('/products', verifyToken, roleCheck, getSupplierProducts);

// Supplier activity log
router.get('/activity-log', verifyToken, roleCheck, getSupplierActivityLog);

export default router; 