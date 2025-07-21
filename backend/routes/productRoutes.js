import express from 'express';
const router = express.Router();
import { getProducts, getProductById, createProduct ,editProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { roleCheck } from '../middleware/roleCheck.js';

router.get("/", verifyToken, roleCheck('admin'), getProducts);
router.get("/:id", verifyToken, roleCheck('admin'), getProductById);
router.post("/", verifyToken, roleCheck('admin'), createProduct);
router.put("/:id", verifyToken, roleCheck('admin'), editProduct);
router.delete("/:id", verifyToken, roleCheck('admin'), deleteProduct);

export default router;