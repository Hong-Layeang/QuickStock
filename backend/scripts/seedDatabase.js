import sequelize from '../config/database.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import Report from '../models/Report.js';
import ActivityLog from '../models/ActivityLog.js';

// Number of suppliers and products to create
const ADMINS_COUNT = 3;
const NUM_SUPPLIERS = 5;
const PRODUCTS_PER_ADMIN = 150;
const PRODUCTS_PER_SUPPLIER = 150;

// Reduced to 6 categories for clarity
const CATEGORIES = [
  'Construction Materials',
  'Beverages',
  'Food & Groceries',
  'Household Products',
  'Personal Care',
  'Electronics & Appliances',
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
    await Report.destroy({ where: {}, truncate: true, restartIdentity: true });
    await Product.destroy({ where: {}, truncate: true, restartIdentity: true });
    await User.destroy({ where: {}, truncate: true, restartIdentity: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Create admin users first
    const admins = [];
    for (let i = 0; i < ADMINS_COUNT; i++) {
      const username = faker.internet.userName();
      const email = `admin${i + 1}@admin.com`;
      const rawPassword = `${username}@123`;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const now = new Date();
      const daysAgo = faker.number.int({ min: 0, max: 180 });
      const userDate = new Date(now);
      userDate.setDate(userDate.getDate() - daysAgo);
      // New user info
      const birthdate = faker.date.birthdate({ min: 25, max: 50, mode: 'age' });
      const phone = faker.phone.number('+855 1# ### ###');
      const address = faker.location.streetAddress();
      const gender = faker.helpers.arrayElement(['male', 'female', 'other']);
      const avatar = faker.image.avatar();
      const position = faker.person.jobTitle();
      const note = faker.lorem.sentence();
      const [admin, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username,
          email,
          password: hashedPassword,
          role: 'admin',
          birthdate,
          phone,
          address,
          gender,
          avatar,
          position,
          note,
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
      const username = faker.internet.userName();
      const email = `supplier${i + 1}@supplier.com`;
      const rawPassword = `${username}@123`;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const now = new Date();
      const daysAgo = faker.number.int({ min: 0, max: 180 });
      const userDate = new Date(now);
      userDate.setDate(userDate.getDate() - daysAgo);
      // New user info
      const birthdate = faker.date.birthdate({ min: 20, max: 40, mode: 'age' });
      const phone = faker.phone.number('+855 9# ### ###');
      const address = faker.location.streetAddress();
      const gender = faker.helpers.arrayElement(['male', 'female', 'other']);
      const avatar = faker.image.avatar();
      const position = faker.person.jobTitle();
      const note = faker.lorem.sentence();
      const [supplier, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username,
          email,
          password: hashedPassword,
          role: 'supplier',
          birthdate,
          phone,
          address,
          gender,
          avatar,
          position,
          note,
          createdAt: userDate,
          updatedAt: userDate
        },
      });
      suppliers.push(supplier);
    }
    console.log(`${suppliers.length} suppliers created.`);

    // Admins create products and assign them to suppliers
    let totalProducts = 0;
    // Each admin gets their own products
    for (const admin of admins) {
      for (let j = 0; j < PRODUCTS_PER_ADMIN; j++) {
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const names = PRODUCT_NAMES[category] || ['Generic Product'];
        const productName = names[Math.floor(Math.random() * names.length)] + ' ' + faker.string.alpha(4).toUpperCase();
        const now = new Date();
        const daysAgo = faker.number.int({ min: 0, max: 90 });
        const productDate = new Date(now);
        productDate.setDate(productDate.getDate() - daysAgo);
        // Assign about half of products to random suppliers, rest to admin
        let assignedSupplierId, activityText;
        if (j % 2 === 0 && suppliers.length > 0) {
          const supplier = faker.helpers.arrayElement(suppliers);
          assignedSupplierId = supplier.id;
          activityText = `Admin assigned product '${productName}' to supplier '${supplier.username}'`;
        } else {
          assignedSupplierId = admin.id;
          activityText = `Admin created product '${productName}' (self-owned)`;
        }
        // Set realistic price ranges by category
        let minPrice = 1, maxPrice = 100;
        switch (category) {
          case 'Construction Materials': minPrice = 10; maxPrice = 50; break;
          case 'Beverages': minPrice = 0.25; maxPrice = 2; break;
          case 'Food & Groceries': minPrice = 0.5; maxPrice = 30; break;
          case 'Household Products': minPrice = 1; maxPrice = 15; break;
          case 'Personal Care': minPrice = 1; maxPrice = 20; break;
          case 'Electronics & Appliances': minPrice = 10; maxPrice = 100; break;
          default: minPrice = 1; maxPrice = 50; break;
        }
        const unitprice = parseFloat(faker.commerce.price({ min: minPrice, max: maxPrice, dec: 2 }));
        // Assign stock and status more realistically
        let stock, status;
        const stockRand = faker.number.int({ min: 0, max: 100 });
        if (stockRand === 0) {
          status = 'out of stock';
          stock = 0;
        } else if (stockRand < 10) {
          status = 'low stock';
          stock = stockRand;
        } else if (stockRand < 90) {
          status = 'in stock';
          stock = stockRand;
        } else {
          status = 'discontinued';
          stock = stockRand;
        }
        const [product, created] = await Product.findOrCreate({
          where: { name: productName, supplierId: assignedSupplierId },
          defaults: {
            name: productName,
            category,
            unitprice,
            stock,
            status,
            supplierId: assignedSupplierId,
            createdAt: productDate,
            updatedAt: productDate
          },
        });
        if (created) {
          totalProducts++;
          await ActivityLog.create({
            userId: admin.id,
            activity: activityText,
            type: 'product',
            status: 'completed',
            productId: product.id,
            createdAt: productDate,
            updatedAt: productDate
          });
        }
      }
    }
    console.log(`${totalProducts} products created by admins and suppliers.`);

    // Fetch all products for reports
    const allProducts = await Product.findAll();

    // Seed sample reports (suppliers submit sales reports for their products)
    const NUM_REPORTS_PER_SUPPLIER = 10;
    for (const supplier of suppliers) {
      // Get products for this supplier
      const supplierProducts = await Product.findAll({ where: { supplierId: supplier.id } });
      for (let i = 0; i < NUM_REPORTS_PER_SUPPLIER; i++) {
        const product = faker.helpers.arrayElement(supplierProducts);
        // Make sales quantity not exceed product stock, and more realistic
        let maxQty = Math.max(1, Math.min(product.stock, 20));
        const quantity = faker.number.int({ min: 1, max: maxQty });
        const totalPrice = product.unitprice * quantity;
        // Generate a timestamp within the last 7 days for analytics
        const now = new Date();
        const daysAgo = faker.number.int({ min: 0, max: 6 });
        const hoursAgo = faker.number.int({ min: 0, max: 23 });
        const minutesAgo = faker.number.int({ min: 0, max: 59 });
        const reportDate = new Date(now);
        reportDate.setDate(reportDate.getDate() - daysAgo);
        reportDate.setHours(reportDate.getHours() - hoursAgo);
        reportDate.setMinutes(reportDate.getMinutes() - minutesAgo);
        const report = await Report.create({
          productId: product.id,
          userId: supplier.id,
          quantity,
          totalPrice,
          status: 'completed',
          createdAt: reportDate,
          updatedAt: reportDate
        });
        // Create activity log for the report
        await ActivityLog.create({
          userId: supplier.id,
          activity: `Supplier submitted sales report for '${product.name}' (${quantity} units)`,
          type: 'report',
          status: report.status,
          productId: product.id,
          createdAt: reportDate,
          updatedAt: reportDate
        });
      }
    }
    console.log(`${NUM_REPORTS_PER_SUPPLIER * suppliers.length} sales reports created by suppliers.`);

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
