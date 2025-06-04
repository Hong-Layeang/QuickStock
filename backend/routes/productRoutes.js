import express from 'express';
const router = express.Router();
import { getProducts, getProductById, createProduct ,editProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { supplierOnly } from '../middleware/roleCheck.js';

router.get("/", verifyToken, supplierOnly ,getProducts);
router.get("/:id", verifyToken, supplierOnly, getProductById);
router.post("/", verifyToken, supplierOnly, createProduct);
router.put("/:id", verifyToken, supplierOnly, editProduct);
router.delete("/:id", verifyToken, supplierOnly, deleteProduct);

export default router;