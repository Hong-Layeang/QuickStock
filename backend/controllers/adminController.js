import User from '../models/User.js';
import Product from '../models/Product.js';
import { Op } from 'sequelize';

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

    // Sample activities (in a real app, you'd have an Activity model)
    const activities = [
      {
        date: new Date().toISOString(),
        activity: `Total ${totalProducts} products in inventory`,
        by: 'System',
        type: 'info',
        status: 'completed'
      },
      {
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        activity: `${lowStockProducts} products are low in stock`,
        by: 'System',
        type: 'alert',
        status: 'pending'
      },
      {
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        activity: `${recentUsers} new users registered`,
        by: 'System',
        type: 'info',
        status: 'completed'
      },
      {
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        activity: 'System initialized successfully',
        by: 'System',
        type: 'info',
        status: 'completed'
      }
    ];

    // Sample metrics
    const metrics = [
      {
        label: 'Total Products',
        value: totalProducts.toString(),
        change: '+5%',
        icon: 'package',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
      },
      {
        label: 'Total Users',
        value: totalUsers.toString(),
        change: '+12%',
        icon: 'users',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20'
      },
      {
        label: 'Low Stock Items',
        value: lowStockProducts.toString(),
        change: 'Needs attention',
        icon: 'alert-triangle',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      },
      {
        label: 'Out of Stock',
        value: outOfStockProducts.toString(),
        change: 'Requires restocking',
        icon: 'package-x',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20'
      }
    ];

    // Dashboard cards data
    const cards = [
      {
        icon: 'boxes',
        title: 'Total Products',
        value: totalProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
        text: 'text-white',
        trend: '+5%',
        trendDirection: 'up',
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
        trend: '+2%',
        trendDirection: 'up',
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
        trend: '+8%',
        trendDirection: 'up',
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
        trend: '+12%',
        trendDirection: 'up',
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

// Get admin orders (placeholder for future implementation)
export const getAdminOrders = async (req, res) => {
  try {
    // This would typically fetch from an Order model
    // For now, return empty array
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
}; 