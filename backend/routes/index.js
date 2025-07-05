import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import adminRoutes from './adminRoutes.js';
import supplierRoutes from './supplierRoutes.js';

const router = express.Router();

// API Routes
router.use('/users', userRoutes);
router.use('/login', authRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminRoutes);
router.use('/supplier', supplierRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'QuickStock API is running'
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'QuickStock API',
    version: '1.0.0',
    description: 'Inventory management system API',
    endpoints: {
      auth: '/api/login',
      users: '/api/users',
      products: '/api/products',
      admin: '/api/admin',
      supplier: '/api/supplier',
      health: '/api/health'
    }
  });
});

export default router; 