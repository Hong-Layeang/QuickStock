import User from '../models/User.js';
import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';
import Report from '../models/Report.js';
import { Op } from 'sequelize';

// Get supplier dashboard data
export const getSupplierDashboard = async (req, res) => {
  try {
    const supplierId = req.user.id;
    
    // Get supplier's products
    const totalProducts = await Product.count({ where: { supplierId } });
    const lowStockProducts = await Product.count({ 
      where: { 
        supplierId,
        stock: { [Op.lt]: 10 } 
      } 
    });
    const outOfStockProducts = await Product.count({ 
      where: { 
        supplierId,
        stock: { [Op.eq]: 0 } 
      } 
    });

    // Get recent products (created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProducts = await Product.count({
      where: {
        supplierId,
        createdAt: { [Op.gte]: sevenDaysAgo }
      }
    });

    // Get products by status
    const inStockProducts = await Product.count({
      where: {
        supplierId,
        status: 'in stock'
      }
    });

    // Fetch recent activities for this supplier (last 7 days, limit 10)
    const recentActivities = await ActivityLog.findAll({
      where: {
        userId: supplierId,
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    const activities = recentActivities.map(act => ({
      date: act.createdAt,
      activity: act.activity,
      by: act.userId,
      type: act.type,
      status: act.status,
    }));

    // Calculate total value of supplier's inventory
    const supplierProducts = await Product.findAll({ 
      where: { supplierId },
      attributes: ['unitprice', 'stock']
    });
    const totalInventoryValue = supplierProducts.reduce((sum, p) => sum + (p.unitprice || 0) * (p.stock || 0), 0);

    // Get supplier's reports for revenue calculation
    const supplierReports = await Report.findAll({ 
      where: { userId: supplierId, status: 'completed' },
      attributes: ['totalPrice', 'quantity']
    });
    const totalRevenue = supplierReports.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    const totalSales = supplierReports.reduce((sum, r) => sum + (r.quantity || 0), 0);

    // Dashboard metrics for Transaction Summary (different from cards)
    const metrics = [
      {
        label: 'Total Sales Revenue',
        value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: 'All time earnings',
        icon: 'dollar-sign',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      },
      {
        label: 'Items Sold',
        value: totalSales.toString(),
        change: 'Total quantity sold',
        icon: 'trending-up',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
      },
      {
        label: 'Inventory Value',
        value: `$${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: 'Current stock value',
        icon: 'package',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20'
      },
      {
        label: 'Avg. Product Price',
        value: totalProducts > 0 ? `$${(totalInventoryValue / totalProducts).toFixed(2)}` : '$0.00',
        change: 'Average value per product',
        icon: 'bar-chart-3',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
      }
    ];

    // Dashboard cards data (exactly 4 cards)
    const cards = [
      {
        icon: 'boxes',
        title: 'My Products',
        value: totalProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
        text: 'text-white',
        trend: '+5%',
        trendDirection: 'up',
        change: 'from last month',
        link: '/supplier/my-products',
        description: 'Total number of your products'
      },
      {
        icon: 'circle-alert',
        title: 'Low in Stock',
        value: lowStockProducts.toString(),
        subtitle: 'items',
        bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500',
        text: 'text-white',
        trend: '+2%',
        trendDirection: 'up',
        change: 'from last week',
        link: '/supplier/my-products?filter=low-stock',
        description: 'Your products that need restocking'
      },
      {
        icon: 'package-plus',
        title: 'Recent Products',
        value: recentProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
        text: 'text-white',
        trend: '+8%',
        trendDirection: 'up',
        change: 'from last week',
        link: '/supplier/my-products?filter=recent',
        description: 'Products you added recently'
      },
      {
        icon: 'check-circle',
        title: 'In Stock',
        value: inStockProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
        text: 'text-white',
        trend: '+12%',
        trendDirection: 'up',
        change: 'from last month',
        link: '/supplier/my-products?filter=in-stock',
        description: 'Your products currently in stock'
      }
    ];

    res.json({
      success: true,
      data: {
        cards,
        activities,
        metrics,
        summary: {
          totalProducts,
          lowStockProducts,
          outOfStockProducts,
          recentProducts,
          inStockProducts
        }
      }
    });
  } catch (error) {
    console.error('Error fetching supplier dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

// Get supplier's products
export const getSupplierProducts = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const products = await Product.findAll({ 
      where: { supplierId },
      order: [['createdAt', 'DESC']]
    });
    
    // Transform products to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      unitprice: product.unitprice,
      stock: product.stock,
      status: product.status,
      supplierId: product.supplierId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
    
    res.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get supplier activity log (placeholder for future implementation)
export const getSupplierActivityLog = async (req, res) => {
  try {
    const supplierId = req.user.id;
    // Fetch all activities for this supplier (limit 30, most recent first)
    const activities = await ActivityLog.findAll({
      where: { userId: supplierId },
      order: [['createdAt', 'DESC']],
      limit: 30,
    });
    res.json({
      success: true,
      data: activities.map(act => ({
        id: act.id,
        date: act.createdAt,
        activity: act.activity,
        type: act.type,
        status: act.status,
        productId: act.productId,
      }))
    });
  } catch (error) {
    console.error('Error fetching supplier activity log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity log'
    });
  }
}; 

// Supplier submits a sales report
export const submitReport = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { productId, quantity, totalPrice } = req.body;
    if (!productId || !quantity || !totalPrice) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const report = await Report.create({
      productId,
      userId: supplierId,
      quantity,
      totalPrice,
      status: 'completed',
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
};

// Supplier views their submitted reports
export const getSupplierReports = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const reports = await Report.findAll({
      where: { userId: supplierId },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching supplier reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
}; 