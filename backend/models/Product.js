import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        min: 0,
    },
    unitprice: {
        type: Number,
        required: true,
        min: 0,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
    },
    status: {
        type: String,
        enum: ["in stock", "out of stock", "discontinued"],
        default: "in stock",
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update `updatedAt` on save
productSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;