import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const product = await Product.find({});
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.log("Error in fetching product");
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if(!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.log("Error in fetching product");
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const createProduct = async (req, res) => {
    const { name, category, unitprice } = req.body;
    const supplierId = req.user.id; // this is set by verifyToken
    const newProduct = new Product({
        name,
        category,
        unitprice,
        supplier: supplierId
    });

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.log("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, unitprice, status } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, category, unitprice, status, updatedAt: Date.now() },
            { new: true } // get updated version for console log
        );
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.log("Error editing product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.log("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};