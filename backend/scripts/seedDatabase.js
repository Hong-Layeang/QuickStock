import sequelize from '../config/database.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import Order from '../models/Order.js';
import ActivityLog from '../models/ActivityLog.js';

// Number of suppliers and products to create
const NUM_SUPPLIERS = 5;
const PRODUCTS_PER_SUPPLIER = 20;

// Realistic Cambodian warehouse categories
const CATEGORIES = [
  'Construction Materials',
  'Beverages',
  'Food & Groceries',
  'Household Products',
  'Personal Care',
  'Electronics & Appliances',
  'Stationery & Office Supplies',
  'Plasticware & Containers',
  'Agricultural Supplies',
  'Clothing & Textiles',
  'Automotive Supplies',
  'Bags & Packaging',
  'Hardware & Tools',
  'Furniture',
  'Batteries & Lighting',
];

// Example product names for each category
const PRODUCT_NAMES = {
  'Construction Materials': ['CAMEL Cement', 'Red Brick', 'Steel Rebar', 'Ceramic Tile', 'Sand Bag', 'PVC Pipe'],
  'Beverages': ['Angkor Beer', 'Cambodia Water Bottle', 'Coca-Cola Can', 'Oishi Green Tea', 'Pepsi Bottle', 'Vital Water'],
  'Food & Groceries': ['Jasmine Rice 50kg', 'Mama Instant Noodles', 'Palm Sugar', 'Soy Sauce', 'Canned Fish', 'Cooking Oil'],
  'Household Products': ['Sunlight Dishwashing Liquid', 'Vim Cleaner', 'Tissue Roll', 'Laundry Detergent', 'Mop Set', 'Broom'],
  'Personal Care': ['Dove Shampoo', 'Colgate Toothpaste', 'Sanitary Pads', 'Lifebuoy Soap', 'Toothbrush', 'Shaving Razor'],
  'Electronics & Appliances': ['Panasonic Fan', 'Rice Cooker', 'LED Light Bulb', 'Extension Cord', 'Electric Kettle', 'Power Strip'],
  'Stationery & Office Supplies': ['A4 Paper Ream', 'Blue Ballpoint Pen', 'Stapler', 'File Folder', 'Whiteboard Marker', 'Calculator'],
  'Plasticware & Containers': ['Plastic Bucket', 'Storage Box', 'Laundry Basket', 'Plastic Basin', 'Food Container', 'Trash Bin'],
  'Agricultural Supplies': ['Urea Fertilizer', 'Hybrid Rice Seed', 'Pesticide Bottle', 'Animal Feed Bag', 'Watering Can', 'Hoe'],
  'Clothing & Textiles': ['Cotton T-shirt', 'Uniform Shirt', 'Bath Towel', 'Blanket', 'Raincoat', 'Work Gloves'],
  'Automotive Supplies': ['Motor Oil', 'Car Battery', 'Motorcycle Tire', 'Spark Plug', 'Brake Fluid', 'Wiper Blade'],
  'Bags & Packaging': ['Plastic Bag Pack', 'Woven Sack', 'Cardboard Box', 'Packing Tape', 'Bubble Wrap', 'String Roll'],
  'Hardware & Tools': ['Hammer', 'Screwdriver Set', 'Nails Box', 'Rope Coil', 'Measuring Tape', 'Pliers'],
  'Furniture': ['Plastic Chair', 'Folding Table', 'Metal Shelf', 'Office Desk', 'Storage Cabinet', 'Stool'],
  'Batteries & Lighting': ['AA Battery Pack', 'AAA Battery Pack', 'LED Torch', 'Rechargeable Lamp', 'Emergency Light', 'Button Cell'],
};

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models (do not force to avoid dropping tables)
    await sequelize.sync();

    // Disable foreign key checks, truncate all tables, then re-enable
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await ActivityLog.destroy({ where: {}, truncate: true, restartIdentity: true });
    await Order.destroy({ where: {}, truncate: true, restartIdentity: true });
    await Product.destroy({ where: {}, truncate: true, restartIdentity: true });
    await User.destroy({ where: {}, truncate: true, restartIdentity: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Create admin users first
    const admins = [];
    for (let i = 0; i < 3; i++) {
      const username = faker.internet.username();
      const email = `admin${i + 1}@admin.com`;
      const rawPassword = `${username}@123`;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      
      // Generate a realistic timestamp within the last 6 months
      const now = new Date();
      const daysAgo = faker.number.int({ min: 0, max: 180 });
      const hoursAgo = faker.number.int({ min: 0, max: 23 });
      const minutesAgo = faker.number.int({ min: 0, max: 59 });
      
      const userDate = new Date(now);
      userDate.setDate(userDate.getDate() - daysAgo);
      userDate.setHours(userDate.getHours() - hoursAgo);
      userDate.setMinutes(userDate.getMinutes() - minutesAgo);
      
      const [admin, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username,
          email,
          password: hashedPassword,
          role: 'admin',
          createdAt: userDate,
          updatedAt: userDate
        },
      });
      admins.push(admin);
    }
    console.log(`${admins.length} admins created.`);

    // Create suppliers (role: 'supplier') - they don't create products
    const suppliers = [];
    for (let i = 0; i < NUM_SUPPLIERS; i++) {
      const username = faker.internet.username();
      const email = `supplier${i + 1}@supplier.com`;
      const rawPassword = `${username}@123`;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      
      // Generate a realistic timestamp within the last 6 months
      const now = new Date();
      const daysAgo = faker.number.int({ min: 0, max: 180 });
      const hoursAgo = faker.number.int({ min: 0, max: 23 });
      const minutesAgo = faker.number.int({ min: 0, max: 59 });
      
      const userDate = new Date(now);
      userDate.setDate(userDate.getDate() - daysAgo);
      userDate.setHours(userDate.getHours() - hoursAgo);
      userDate.setMinutes(userDate.getMinutes() - minutesAgo);
      
      const [supplier, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username,
          email,
          password: hashedPassword,
          role: 'supplier',
          createdAt: userDate,
          updatedAt: userDate
        },
      });
      suppliers.push(supplier);
    }
    console.log(`${suppliers.length} suppliers created.`);

    // Create regular users (customers)
    const customers = [];
    for (let i = 0; i < 10; i++) {
      const username = faker.internet.username();
      const email = `user${i + 1}@user.com`;
      const rawPassword = `${username}@123`;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      
      // Generate a realistic timestamp within the last 6 months
      const now = new Date();
      const daysAgo = faker.number.int({ min: 0, max: 180 });
      const hoursAgo = faker.number.int({ min: 0, max: 23 });
      const minutesAgo = faker.number.int({ min: 0, max: 59 });
      
      const userDate = new Date(now);
      userDate.setDate(userDate.getDate() - daysAgo);
      userDate.setHours(userDate.getHours() - hoursAgo);
      userDate.setMinutes(userDate.getMinutes() - minutesAgo);
      
      const [customer, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username,
          email,
          password: hashedPassword,
          role: 'user',
          createdAt: userDate,
          updatedAt: userDate
        },
      });
      customers.push(customer);
    }
    console.log(`${customers.length} customers created.`);

    // Admins create products and assign them to suppliers
    let totalProducts = 0;
    for (let j = 0; j < PRODUCTS_PER_SUPPLIER * NUM_SUPPLIERS; j++) {
      const admin = faker.helpers.arrayElement(admins);
      const supplier = faker.helpers.arrayElement(suppliers);
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const names = PRODUCT_NAMES[category] || ['Generic Product'];
      const productName = names[Math.floor(Math.random() * names.length)];
      
      // Generate a realistic timestamp within the last 3 months
      const now = new Date();
      const daysAgo = faker.number.int({ min: 0, max: 90 });
      const hoursAgo = faker.number.int({ min: 0, max: 23 });
      const minutesAgo = faker.number.int({ min: 0, max: 59 });
      
      const productDate = new Date(now);
      productDate.setDate(productDate.getDate() - daysAgo);
      productDate.setHours(productDate.getHours() - hoursAgo);
      productDate.setMinutes(productDate.getMinutes() - minutesAgo);
      
      // Idempotency: avoid duplicate products for the same supplier
      const [product, created] = await Product.findOrCreate({
        where: { name: productName, supplierId: supplier.id },
        defaults: {
          name: productName,
          category,
          unitprice: parseFloat(faker.commerce.price()),
          stock: faker.number.int({ min: 0, max: 100 }),
          status: faker.helpers.arrayElement(['in stock', 'low stock', 'out of stock', 'discontinued']),
          supplierId: supplier.id,
          createdAt: productDate,
          updatedAt: productDate
        },
      });
      if (created) {
        totalProducts++;
        
        // Create activity log for admin creating the product
        await ActivityLog.create({
          userId: admin.id,
          activity: `Admin created product '${productName}' and assigned to supplier '${supplier.username}'`,
          type: 'product',
          status: 'completed',
          productId: product.id,
          createdAt: productDate,
          updatedAt: productDate
        });
      }
    }
    console.log(`${totalProducts} products created by admins.`);

    // Fetch all products and customers for orders
    const allProducts = await Product.findAll();
    const allCustomers = customers; // Only customers place orders

    // Seed sample orders (only customers place orders)
    const NUM_ORDERS = 50;
    for (let i = 0; i < NUM_ORDERS; i++) {
      const customer = faker.helpers.arrayElement(allCustomers);
      const product = faker.helpers.arrayElement(allProducts);
      const quantity = faker.number.int({ min: 1, max: 5 });
      const totalPrice = product.unitprice * quantity;
      
      // Generate a realistic timestamp within the last 90 days
      const now = new Date();
      const daysAgo = faker.number.int({ min: 0, max: 89 });
      const hoursAgo = faker.number.int({ min: 0, max: 23 });
      const minutesAgo = faker.number.int({ min: 0, max: 59 });
      
      const orderDate = new Date(now);
      orderDate.setDate(orderDate.getDate() - daysAgo);
      orderDate.setHours(orderDate.getHours() - hoursAgo);
      orderDate.setMinutes(orderDate.getMinutes() - minutesAgo);
      
      const order = await Order.create({
        productId: product.id,
        userId: customer.id,
        quantity,
        totalPrice,
        status: faker.helpers.arrayElement(['completed', 'pending', 'cancelled']),
        createdAt: orderDate,
        updatedAt: orderDate
      });

      // Create activity log for the order
      await ActivityLog.create({
        userId: customer.id,
        activity: `Customer placed order for '${product.name}' (${quantity} units)`,
        type: 'order',
        status: order.status,
        productId: product.id,
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }
    console.log(`${NUM_ORDERS} orders created by customers.`);

    // Seed additional admin activity logs
    const NUM_ADMIN_ACTIVITIES = 20;
    for (let i = 0; i < NUM_ADMIN_ACTIVITIES; i++) {
      const admin = faker.helpers.arrayElement(admins);
      const product = faker.helpers.arrayElement(allProducts);
      
      // Generate a realistic timestamp within the last 30 days
      const now = new Date();
      const daysAgo = faker.number.int({ min: 0, max: 30 });
      const hoursAgo = faker.number.int({ min: 0, max: 23 });
      const minutesAgo = faker.number.int({ min: 0, max: 59 });
      
      const activityDate = new Date(now);
      activityDate.setDate(activityDate.getDate() - daysAgo);
      activityDate.setHours(activityDate.getHours() - hoursAgo);
      activityDate.setMinutes(activityDate.getMinutes() - minutesAgo);
      
      await ActivityLog.create({
        userId: admin.id,
        activity: faker.helpers.arrayElement([
          `Updated stock for '${product.name}'`,
          `Updated price for '${product.name}'`,
          `Changed status of '${product.name}' to '${faker.helpers.arrayElement(['in stock', 'low stock', 'out of stock', 'discontinued'])}'`,
          `Admin logged in`,
          `Admin updated system settings`,
          `Admin reviewed supplier performance`
        ]),
        type: faker.helpers.arrayElement(['product', 'system', 'supplier']),
        status: 'completed',
        productId: product.id,
        createdAt: activityDate,
        updatedAt: activityDate
      });
    }
    console.log(`${NUM_ADMIN_ACTIVITIES} admin activities created.`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
