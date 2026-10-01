import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .delete(deleteProduct);

export default router;
