import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        
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
        
        res.status(200).json(transformedProducts);
    } catch (error) {
        console.log("Error in fetching products:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        res.status(200).json(product);
    } catch (error) {
        console.log("Error in fetching product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const createProduct = async (req, res) => {
    const { name, category, unitprice, stock = 0, status = 'in stock' } = req.body;
    const supplierId = req.user.id; // this is set by verifyToken

    try {
        const newProduct = await Product.create({
            name,
            category,
            unitprice,
            stock,
            status,
            supplierId
        });
        // Log product creation
        const ActivityLog = (await import('../models/ActivityLog.js')).default;
        await ActivityLog.create({
            userId: req.user.id,
            activity: `Created product '${name}'`,
            type: 'product',
            status: 'completed',
            productId: newProduct.id
        });
        
        // Transform product to match frontend expectations
        const transformedProduct = {
            id: newProduct.id,
            name: newProduct.name,
            category: newProduct.category,
            unitprice: newProduct.unitprice,
            stock: newProduct.stock,
            status: newProduct.status,
            supplierId: newProduct.supplierId,
            createdAt: newProduct.createdAt,
            updatedAt: newProduct.updatedAt
        };
        
        res.status(201).json(transformedProduct);
    } catch (error) {
        console.log("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, unitprice, stock, status, supplierId } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const updateFields = { name, category, unitprice, stock, status };
        if (supplierId !== undefined) {
            updateFields.supplierId = supplierId;
        }
        const updatedProduct = await product.update(updateFields);
        // Log product update
        const ActivityLog = (await import('../models/ActivityLog.js')).default;
        await ActivityLog.create({
            userId: req.user.id,
            activity: `Updated product '${updatedProduct.name}'`,
            type: 'product',
            status: 'completed',
            productId: updatedProduct.id
        });
        
        // Transform product to match frontend expectations
        const transformedProduct = {
            id: updatedProduct.id,
            name: updatedProduct.name,
            category: updatedProduct.category,
            unitprice: updatedProduct.unitprice,
            stock: updatedProduct.stock,
            status: updatedProduct.status,
            supplierId: updatedProduct.supplierId,
            createdAt: updatedProduct.createdAt,
            updatedAt: updatedProduct.updatedAt
        };
        
        res.status(200).json(transformedProduct);
    } catch (error) {
        console.log("Error editing product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        await product.destroy();
        // Log product deletion
        const ActivityLog = (await import('../models/ActivityLog.js')).default;
        await ActivityLog.create({
            userId: req.user?.id || product.supplierId,
            activity: `Deleted product '${product.name}'`,
            type: 'product',
            status: 'completed',
            productId: product.id
        });
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.log("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};