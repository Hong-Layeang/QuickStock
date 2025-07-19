import { Op } from 'sequelize';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Report from '../models/Report.js';
import ActivityLog from '../models/ActivityLog.js';

// Get admin dashboard data
export const getAdminDashboard = async (req, res) => {
  try {
    // Get counts
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalSuppliers = await User.count({ where: { role: 'supplier' } });
    const totalAdmins = await User.count({ where: { role: 'admin' } });

    // Get low stock and out of stock products
    const lowStockProducts = await Product.count({
      where: {
        stock: { [Op.lt]: 10 }
      }
    });
    const outOfStockProducts = await Product.count({
      where: {
        stock: { [Op.eq]: 0 }
      }
    });

    // Get recent products (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProducts = await Product.count({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo }
      }
    });

    // Get recent users (last 7 days)
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
        orders: totalReports,
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
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);

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
    // Metrics with real data
    const metrics = [
      {
        label: 'Total Products',
        value: totalProducts.toString(),
        change: `${prodChange.sign}${prodChange.percent}%`,
        trendDirection: prodChange.direction,
        icon: 'package',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
      },
      {
        label: 'Total Users',
        value: totalUsers.toString(),
        change: `${userChange.sign}${userChange.percent}%`,
        trendDirection: userChange.direction,
        icon: 'users',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      },
      {
        label: 'Low Stock Items',
        value: lowStockProducts.toString(),
        change: `${lowStockChange.sign}${lowStockChange.percent}%`,
        trendDirection: lowStockChange.direction,
        icon: 'alert-triangle',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      },
      {
        label: 'Out of Stock',
        value: outOfStockProducts.toString(),
        change: `${outOfStockChange.sign}${outOfStockChange.percent}%`,
        trendDirection: outOfStockChange.direction,
        icon: 'package-x',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20'
      }
    ];
    // Dashboard cards with real trend
    const cards = [
      {
        icon: 'boxes',
        title: 'Total Products',
        value: totalProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
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
        bg: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
        text: 'text-white',
        trend: `${lowStockChange.sign}${lowStockChange.percent}%`,
        trendDirection: lowStockChange.direction,
        change: 'from last week',
        link: '/admin/products?filter=low-stock',
        description: 'Products that need restocking'
      },
      {
        icon: 'package-plus',
        title: 'Recent Products',
        value: recentProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
        text: 'text-white',
        trend: `${recentProdChange.sign}${recentProdChange.percent}%`,
        trendDirection: recentProdChange.direction,
        change: 'from last week',
        link: '/admin/products?filter=recent',
        description: 'Products added recently'
      },
      {
        icon: 'users',
        title: 'Total Users',
        value: totalUsers.toString(),
        subtitle: 'users',
        bg: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
        text: 'text-white',
        trend: `${userChange.sign}${userChange.percent}%`,
        trendDirection: userChange.direction,
        change: 'from last month',
        link: '/admin/users',
        description: 'Total registered users'
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
          recentUsers
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
    // This would typically fetch from a Report model
    // For now, return empty array
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
};

// Get analytics data for different time periods
export const getAnalyticsData = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let days;
    let dataPoints;
    
    switch (period) {
      case '7d':
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dataPoints = 7;
        break;
      case '14d':
        days = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
        dataPoints = 14;
        break;
      case '30d':
        days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        dataPoints = 30;
        break;
      case '90d':
        days = Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`);
        dataPoints = 90;
        break;
      default:
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dataPoints = 7;
    }

    const analyticsData = [];
    let totalValue = 0;
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      let dayName;
      if (period === '7d') {
        dayName = days[startOfDay.getDay() === 0 ? 6 : startOfDay.getDay() - 1];
      } else {
        dayName = days[dataPoints - 1 - i];
      }
      
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