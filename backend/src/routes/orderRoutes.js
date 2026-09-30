import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder);

router.route('/:id/status')
  .patch(updateOrderStatus);

export default router;
