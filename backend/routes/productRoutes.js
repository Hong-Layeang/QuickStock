import express from 'express';
const router = express.Router();
import { getProducts, getProductById, createProduct ,editProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { roleCheck } from '../middleware/roleCheck.js';

router.get("/", verifyToken, roleCheck ,getProducts);
router.get("/:id", verifyToken, roleCheck, getProductById);
router.post("/", verifyToken, roleCheck, createProduct);
router.put("/:id", verifyToken, roleCheck, editProduct);
router.delete("/:id", verifyToken, roleCheck, deleteProduct);

export default router;