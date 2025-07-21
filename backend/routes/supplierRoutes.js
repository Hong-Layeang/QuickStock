import express from 'express';
import { getSupplierDashboard, getSupplierProducts, getSupplierActivityLog, submitReport, getSupplierReports } from '../controllers/supplierController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Supplier dashboard data
router.get('/dashboard', verifyToken, roleCheck('supplier'), getSupplierDashboard);

// Supplier's products
router.get('/products', verifyToken, roleCheck('supplier'), getSupplierProducts);

// Supplier activity log
router.get('/activity-log', verifyToken, roleCheck('supplier'), getSupplierActivityLog);

// Supplier submits a sales report
router.post('/reports', verifyToken, roleCheck('supplier'), submitReport);
// Supplier views their submitted reports
router.get('/reports', verifyToken, roleCheck('supplier'), getSupplierReports);

export default router;