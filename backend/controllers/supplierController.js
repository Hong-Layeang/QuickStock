import User from '../models/User.js';
import Product from '../models/Product.js';
import ActivityLog from '../models/ActivityLog.js';
import Report from '../models/Report.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

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

    // Calculate previous period values for change/trend (like admin)
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Calculate trends for supplier's products
    const totalProductsLastMonth = await Product.count({
      where: {
        supplierId,
        createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] }
      }
    });

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const sevenDaysAgoForLowStock = new Date();
    sevenDaysAgoForLowStock.setDate(sevenDaysAgoForLowStock.getDate() - 7);
    
    const lowStockLastWeek = await Product.count({
      where: {
        supplierId,
        stock: { [Op.lt]: 10 },
        createdAt: { [Op.between]: [fourteenDaysAgo, sevenDaysAgoForLowStock] }
      }
    });

    const outOfStockLastWeek = await Product.count({
      where: {
        supplierId,
        stock: { [Op.eq]: 0 },
        createdAt: { [Op.between]: [fourteenDaysAgo, sevenDaysAgoForLowStock] }
      }
    });

    const recentProductsPrev = await Product.count({
      where: {
        supplierId,
        createdAt: { [Op.between]: [fourteenDaysAgo, sevenDaysAgo] }
      }
    });

    // Helper for percent change (same as admin)
    function getChange(current, prev) {
      const diff = current - prev;
      const percent = prev === 0 ? (current > 0 ? 100 : 0) : (diff / Math.abs(prev)) * 100;
      return {
        percent: percent.toFixed(1),
        direction: percent > 0 ? 'up' : percent < 0 ? 'down' : 'flat',
        sign: percent > 0 ? '+' : ''
      };
    }

    // Calculate changes
    const prodChange = getChange(totalProducts, totalProductsLastMonth);
    const lowStockChange = getChange(lowStockProducts, lowStockLastWeek);
    const outOfStockChange = getChange(outOfStockProducts, outOfStockLastWeek);
    const recentProdChange = getChange(recentProducts, recentProductsPrev);

    // Generate sales analytics data for the last 7 days using supplier's reports
    const salesData = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      const dayName = days[startOfDay.getDay() === 0 ? 6 : startOfDay.getDay() - 1];
      
      const reports = await Report.findAll({
        where: {
          userId: supplierId,
          createdAt: { [Op.between]: [startOfDay, endOfDay] },
          status: 'completed',
        },
      });
      
      const totalReports = reports.length;
      const totalValue = reports.reduce((sum, report) => sum + report.totalPrice, 0);
      const totalQuantity = reports.reduce((sum, report) => sum + (report.quantity || 0), 0);
      
      salesData.push({
        name: dayName,
        sales: totalQuantity,
        value: totalValue,
        reports: totalReports,
      });
    }

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

    // Calculate supplier-specific metrics for today and this month
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    
    const salesTodayReports = await Report.findAll({
      where: {
        userId: supplierId,
        createdAt: { [Op.between]: [startOfToday, endOfToday] },
        status: 'completed',
      },
    });
    const totalSalesToday = salesTodayReports.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const salesMonthReports = await Report.findAll({
      where: {
        userId: supplierId,
        createdAt: { [Op.between]: [startOfMonth, endOfToday] },
        status: 'completed',
      },
    });
    const totalSalesMonth = salesMonthReports.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
    const totalSalesQuantityMonth = salesMonthReports.reduce((sum, r) => sum + (r.quantity || 0), 0);

    // Pending Orders for this supplier
    const pendingOrders = await Report.count({ 
      where: { 
        userId: supplierId,
        status: { [Op.ne]: 'completed' } 
      } 
    });

    // Top Selling Product for this supplier
    const topProductAgg = await Report.findAll({
      where: { 
        userId: supplierId,
        status: 'completed' 
      },
      include: [{ model: Product, as: 'Product', where: { supplierId } }],
      attributes: ['productId', [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold']],
      group: ['productId'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 1,
      raw: true
    });
    let topSellingProduct = 'N/A';
    if (topProductAgg[0]) {
      const prod = await Product.findByPk(topProductAgg[0].productId);
      topSellingProduct = prod ? prod.name : 'N/A';
    }

    // Total Categories for this supplier
    const categories = await Product.findAll({ 
      where: { supplierId },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']], 
      raw: true 
    });
    const totalCategories = categories.length;

    // Dashboard metrics for Transaction Summary (supplier-specific, matching admin structure)
    const metrics = [
      {
        label: 'Total Sales Today',
        value: `$${totalSalesToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'trending-up',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
      },
      {
        label: 'Total Sales This Month',
        value: `$${totalSalesMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bar-chart-3',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      },
      {
        label: 'Pending Orders',
        value: pendingOrders.toString(),
        icon: 'clipboard-list',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      },
      {
        label: 'Top Selling Product',
        value: topSellingProduct,
        icon: 'star',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      },
      {
        label: 'Average Sale Price',
        value: totalSalesQuantityMonth > 0 ? `$${(totalSalesMonth / totalSalesQuantityMonth).toFixed(2)}` : '$0.00',
        icon: 'user-check',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      },
      {
        label: 'Total Categories',
        value: totalCategories.toString(),
        icon: 'layers',
        color: 'text-pink-600',
        bgColor: 'bg-pink-100 dark:bg-pink-900/20',
      },
      {
        label: 'Total Products',
        value: totalProducts.toString(),
        icon: 'users',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      },
      {
        label: 'Total Inventory Value',
        value: `$${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'package',
        color: 'text-teal-600',
        bgColor: 'bg-teal-100 dark:bg-teal-900/20',
      },
    ];

    // Dashboard cards data (matching admin structure exactly)
    const cards = [
      {
        icon: 'boxes',
        title: 'My Products',
        value: totalProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
        text: 'text-white',
        trend: `${prodChange.sign}${prodChange.percent}%`,
        trendDirection: prodChange.direction,
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
        trend: `${lowStockChange.sign}${lowStockChange.percent}%`,
        trendDirection: lowStockChange.direction,
        change: 'from last week',
        link: '/supplier/my-products?filter=low-stock',
        description: 'Your products that need restocking'
      },
      {
        icon: 'package-minus',
        title: 'Out of Stock',
        value: outOfStockProducts.toString(),
        subtitle: 'items',
        bg: 'bg-gradient-to-br from-red-400 via-red-500 to-red-600',
        text: 'text-white',
        trend: `${outOfStockChange.sign}${outOfStockChange.percent}%`,
        trendDirection: outOfStockChange.direction,
        change: 'from last week',
        link: '/supplier/my-products?filter=out-of-stock',
        description: 'Your products that are out of stock'
      },
      {
        icon: 'package-plus',
        title: 'Recent Products',
        value: recentProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
        text: 'text-white',
        trend: `${recentProdChange.sign}${recentProdChange.percent}%`,
        trendDirection: recentProdChange.direction,
        change: 'from last week',
        link: '/supplier/my-products?filter=recent',
        description: 'Products you added recently'
      }
    ];

    res.json({
      success: true,
      data: {
        cards,
        activities,
        metrics,
        salesData,
        summary: {
          totalProducts,
          lowStockProducts,
          outOfStockProducts,
          recentProducts,
          inStockProducts,
          totalInventoryValue,
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
      include: [
        {
          model: Product,
          as: 'Product',
          attributes: ['name', 'supplierId'],
        },
        {
          model: User,
          as: 'User',
          attributes: ['username'],
        },
      ],
    });
    
    // Map reports to include productName at top level
    const mappedReports = reports.map((report) => ({
      ...report.toJSON(),
      productName: report.Product?.name || '',
      userName: report.User?.username || '',
    }));
    
    res.json({ success: true, data: mappedReports });
  } catch (error) {
    console.error('Error fetching supplier reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

// Submit sale report - record sales to customers
export const submitSaleReport = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { productId, quantity, totalPrice, paymentMethod = 'cash' } = req.body;

    // Verify the product belongs to this supplier
    const product = await Product.findOne({
      where: { 
        id: productId, 
        supplierId: supplierId 
      }
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or does not belong to this supplier' 
      });
    }

    // Check if enough stock is available
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}` 
      });
    }

    // Create sales report  
    const report = await Report.create({
      userId: supplierId,
      productId: productId,
      quantity: quantity,
      totalPrice: totalPrice,
      status: 'completed',
      paymentMethod: paymentMethod
    });

    // Update product stock
    await product.update({
      stock: product.stock - quantity,
      status: (product.stock - quantity) === 0 ? 'out of stock' : 
              (product.stock - quantity) < 10 ? 'low stock' : 'in stock'
    });

    // Log the activity
    await ActivityLog.create({
      userId: supplierId,
      activity: `Completed sale of ${quantity} ${product.name}(s)`,
      type: 'sale',
      status: 'completed',
      productId: product.id,
      createdAt: new Date()
    });

    res.json({ 
      success: true, 
      message: 'Sale recorded successfully',
      data: {
        report: report,
        updatedStock: product.stock - quantity
      }
    });

  } catch (error) {
    console.error('Error submitting sale report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process sale' 
    });
  }
};