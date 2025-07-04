import User from '../models/User.js';
import Product from '../models/Product.js';
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

    // Sample activities for supplier
    const activities = [
      {
        date: new Date().toISOString(),
        activity: `You have ${totalProducts} products in inventory`,
        by: 'System',
        type: 'info',
        status: 'completed'
      },
      {
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        activity: `${lowStockProducts} of your products are low in stock`,
        by: 'System',
        type: 'alert',
        status: 'pending'
      },
      {
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        activity: `${recentProducts} new products added recently`,
        by: 'System',
        type: 'info',
        status: 'completed'
      },
      {
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        activity: 'Supplier account activated successfully',
        by: 'System',
        type: 'info',
        status: 'completed'
      }
    ];

    // Dashboard metrics
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
        label: 'In Stock',
        value: inStockProducts.toString(),
        change: 'Active',
        icon: 'check-circle',
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
        title: 'My Products',
        value: totalProducts.toString(),
        subtitle: 'products',
        bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
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
        bg: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
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
        bg: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
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
        bg: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
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
    
    // This would typically fetch from an Activity model
    // For now, return sample activities
    const activities = [
      {
        id: 1,
        date: new Date().toISOString(),
        activity: 'Product "Wireless Mouse" stock updated',
        type: 'stock-update',
        status: 'completed',
        productId: 1,
        productName: 'Wireless Mouse'
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString(),
        activity: 'New product "Mechanical Keyboard" added',
        type: 'product-added',
        status: 'completed',
        productId: 2,
        productName: 'Mechanical Keyboard'
      },
      {
        id: 3,
        date: new Date(Date.now() - 172800000).toISOString(),
        activity: 'Product "HD Monitor" price updated',
        type: 'price-update',
        status: 'completed',
        productId: 3,
        productName: 'HD Monitor'
      }
    ];
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching supplier activity log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity log'
    });
  }
}; 