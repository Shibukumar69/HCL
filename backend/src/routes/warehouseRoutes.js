import express from 'express';
import {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  getInventoryOverview,
  getLowStockAlerts,
  transferStock
} from '../controllers/warehouseController.js';

const router = express.Router();

// Inventory specific routes (Inhe /:id se pehle rakhna zaroori hota hai taaki 'overview' ko id na samajh le)
router.get('/inventory/overview', getInventoryOverview);
router.get('/inventory/low-stock', getLowStockAlerts);
router.post('/inventory/transfer', transferStock);

// General Warehouse CRUD
router.route('/')
  .get(getWarehouses)
  .post(createWarehouse);

router.route('/:id')
  .get(getWarehouse);

export default router;
