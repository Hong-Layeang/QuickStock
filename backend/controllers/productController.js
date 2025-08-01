import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        
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
    const { name, category, unitprice, stock = 0, status = 'in stock', supplierId } = req.body;
    
    try {
        // For admin users, use the supplierId from request body if provided, otherwise use admin's ID
        // For supplier users, always use their own ID
        let finalSupplierId;
        if (req.user.role === 'admin') {
            finalSupplierId = supplierId && supplierId !== '' ? parseInt(supplierId) : req.user.id;
        } else {
            finalSupplierId = req.user.id;
        }

        const newProduct = await Product.create({
            name,
            category,
            unitprice,
            stock,
            status,
            supplierId: finalSupplierId
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
        
        // Handle supplierId assignment for admin users
        if (req.user.role === 'admin') {
            if (supplierId !== undefined) {
                updateFields.supplierId = supplierId === '' ? req.user.id : parseInt(supplierId);
            }
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