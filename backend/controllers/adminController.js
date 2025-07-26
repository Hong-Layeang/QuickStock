import User from '../models/User.js';
import Product from '../models/Product.js';
import { Op } from 'sequelize';
import Report from '../models/Report.js';
import ActivityLog from '../models/ActivityLog.js';
import sequelize from '../config/database.js';

// Get admin dashboard data
export const getAdminDashboard = async (req, res) => {
  try {
    // Get counts and data for dashboard
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalSuppliers = await User.count({ where: { role: 'supplier' } });
    const totalAdmins = await User.count({ where: { role: 'admin' } });
    
    // Get low stock products (less than 10 items)
    const lowStockProducts = await Product.count({ 
      where: { 
        stock: { [Op.lt]: 10 } 
      } 
    });

    // Get out of stock products
    const outOfStockProducts = await Product.count({ 
      where: {
        stock: { [Op.eq]: 0 } 
      } 
    });

    // Get recent products (created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProducts = await Product.count({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo }
      }
    });

    // Get recent users (created in last 7 days)
    const recentUsers = await User.count({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo }
      }
    });

    // Generate sales analytics data for the last 7 days using real reports
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
          createdAt: { [Op.between]: [startOfDay, endOfDay] },
          status: 'completed',
        },
      });
      const totalReports = reports.length;
      const totalValue = reports.reduce((sum, report) => sum + report.totalPrice, 0);
      salesData.push({
        name: dayName,
        reports: totalReports,
        value: totalValue,
      });
    }

    // Fetch recent activities from ActivityLog (last 7 days, limit 10)
    const recentActivities = await ActivityLog.findAll({
      where: {
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

    // Calculate previous period values for change/trend
    // For total products/users: compare this month to last month
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Total Products
    const totalProductsLastMonth = await Product.count({
      where: {
        createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] }
      }
    });
    // Total Users
    const totalUsersLastMonth = await User.count({
      where: {
        createdAt: { [Op.between]: [startOfLastMonth, endOfLastMonth] }
      }
    });
    // Low Stock Items (compare to last week)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const sevenDaysAgoForLowStock = new Date();
    sevenDaysAgoForLowStock.setDate(sevenDaysAgoForLowStock.getDate() - 7);
    const lowStockLastWeek = await Product.count({
      where: {
        stock: { [Op.lt]: 10 },
        createdAt: { [Op.between]: [fourteenDaysAgo, sevenDaysAgoForLowStock] }
      }
    });
    // Out of Stock (compare to last week)
    const outOfStockLastWeek = await Product.count({
      where: {
        stock: { [Op.eq]: 0 },
        createdAt: { [Op.between]: [fourteenDaysAgo, sevenDaysAgoForLowStock] }
      }
    });
    // Recent Products (compare to previous 7 days)
    const fourteenDaysAgoForRecent = new Date();
    fourteenDaysAgoForRecent.setDate(fourteenDaysAgoForRecent.getDate() - 7);
    const recentProductsPrev = await Product.count({
      where: {
        createdAt: { [Op.between]: [fourteenDaysAgoForRecent, sevenDaysAgo] }
      }
    });
    // Helper for percent change
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
    const userChange = getChange(totalUsers, totalUsersLastMonth);
    const lowStockChange = getChange(lowStockProducts, lowStockLastWeek);
    const outOfStockChange = getChange(outOfStockProducts, outOfStockLastWeek);
    const recentProdChange = getChange(recentProducts, recentProductsPrev);
    // --- New Metrics ---
    // Total Sales Today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const salesTodayReports = await Report.findAll({
      where: {
        createdAt: { [Op.between]: [startOfToday, endOfToday] },
        status: 'completed',
      },
    });
    const totalSalesToday = salesTodayReports.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

    // Total Sales This Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const salesMonthReports = await Report.findAll({
      where: {
        createdAt: { [Op.between]: [startOfMonth, endOfToday] },
        status: 'completed',
      },
    });
    const totalSalesMonth = salesMonthReports.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

    // Pending Orders (pending reports)
    const pendingOrders = await Report.count({ where: { status: { [Op.ne]: 'completed' } } });

    // Top Selling Product (by quantity in completed reports)
    const topProductAgg = await Report.findAll({
      where: { status: 'completed' },
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

    // Most Active Supplier (by number of completed reports)
    // 1. Get all completed reports with their products (to get supplierId)
    const completedReports = await Report.findAll({
      where: { status: 'completed' },
      include: [{ model: Product, as: 'Product', attributes: ['supplierId'] }],
      raw: true,
    });
    // 2. Count reports per supplierId
    const supplierReportCounts = {};
    for (const rep of completedReports) {
      const supplierId = rep['Product.supplierId'];
      if (supplierId) {
        supplierReportCounts[supplierId] = (supplierReportCounts[supplierId] || 0) + 1;
      }
    }
    // 3. Find supplierId with most reports
    let mostActiveSupplier = 'N/A';
    let maxReports = 0;
    let topSupplierId = null;
    for (const [sid, count] of Object.entries(supplierReportCounts)) {
      if (count > maxReports) {
        maxReports = count;
        topSupplierId = sid;
      }
    }
    if (topSupplierId) {
      const supplier = await User.findByPk(topSupplierId);
      mostActiveSupplier = supplier ? supplier.username : 'N/A';
    }

    // Total Categories
    const categories = await Product.findAll({ attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']], raw: true });
    const totalCategories = categories.length;

    // Total Inventory Value (sum of all product prices × quantities)
    const allProducts = await Product.findAll({ attributes: ['unitprice', 'stock'], raw: true });
    const totalInventoryValue = allProducts.reduce((sum, p) => sum + (p.unitprice || 0) * (p.stock || 0), 0);

    // --- Updated Metrics Array ---
    const metrics = [
      {
        label: 'Total Sales Today',
        value: `$${totalSalesToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'trending-up', // improved icon
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
      },
      {
        label: 'Total Sales This Month',
        value: `$${totalSalesMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bar-chart-3', // improved icon
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      },
      {
        label: 'Pending Orders',
        value: pendingOrders.toString(),
        icon: 'clipboard-list', // improved icon
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      },
      {
        label: 'Top Selling Product',
        value: topSellingProduct,
        icon: 'star', // improved icon
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      },
      {
        label: 'Most Active Supplier',
        value: mostActiveSupplier,
        icon: 'user-check', // improved icon
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      },
      {
        label: 'Total Categories',
        value: totalCategories.toString(),
        icon: 'layers', // improved icon
        color: 'text-pink-600',
        bgColor: 'bg-pink-100 dark:bg-pink-900/20',
      },
      {
        label: 'Total Suppliers',
        value: totalSuppliers.toString(),
        icon: 'users', // improved icon
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
    // Dashboard cards with real trend
    const cards = [
      {
        icon: 'boxes',
        title: 'Total Products',
        value: totalProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
        text: 'text-white',
        trend: `${prodChange.sign}${prodChange.percent}%`,
        trendDirection: prodChange.direction,
        change: 'from last month',
        link: '/admin/products',
        description: 'Total number of products in inventory'
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
        link: '/admin/products?filter=low-stock',
        description: 'Products that need restocking'
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
        link: '/admin/products?filter=out-of-stock',
        description: 'Products that are out of stock'
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
        link: '/admin/products?filter=recent',
        description: 'Products added recently'
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
          totalUsers,
          totalSuppliers,
          totalAdmins,
          lowStockProducts,
          outOfStockProducts,
          recentProducts,
          recentUsers,
          totalInventoryValue,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

// Get admin reports (placeholder for future implementation)
export const getAdminReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Product,
          as: 'Product',
          attributes: ['name', 'supplierId'],
          include: [
            {
              model: User,
              as: 'supplier',
              attributes: ['username'],
            },
          ],
        },
        {
          model: User,
          as: 'User',
          attributes: ['username'],
        },
      ],
    });
    // Map reports to include productName and supplierName at top level
    const mappedReports = reports.map((report) => ({
      ...report.toJSON(),
      productName: report.Product?.name || '',
      supplierName: report.Product?.supplier?.username || '',
      userName: report.User?.username || '',
    }));
    res.json({
      success: true,
      data: mappedReports,
    });
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
    });
  }
};

// Get analytics data for admin (7 days sales analytics)
export const getAdminAnalytics = async (req, res) => {
  try {
    // Always use 7 days, starting from today
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const analyticsData = [];
    let totalValue = 0;
    const today = new Date();
    // Build 7 days starting from today (chronological)
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      const dayName = daysOfWeek[date.getDay()];
      const reports = await Report.findAll({
        where: {
          createdAt: { [Op.between]: [startOfDay, endOfDay] },
          status: 'completed',
        },
      });
      const totalReports = reports.length;
      const dayValue = reports.reduce((sum, report) => sum + report.totalPrice, 0);
      totalValue += dayValue;
      analyticsData.push({
        name: dayName,
        orders: totalReports,
        value: dayValue,
      });
    }
    res.json({
      success: true,
      data: analyticsData,
      totalValue
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
}; 