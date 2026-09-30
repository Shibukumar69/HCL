import express from 'express';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  deleteSupplier
} from '../controllers/supplierController.js';

const router = express.Router();

router.route('/')
  .get(getSuppliers)
  .post(createSupplier);

router.route('/:id')
  .get(getSupplier)
  .delete(deleteSupplier);

export default router;
