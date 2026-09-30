import OrderModel from '../models/Order.js';

class OrderService {
  static async getAllOrders() {
    return await OrderModel.findAll();
  }

  static async getOrderById(id) {
    const order = await OrderModel.findById(id);
    if (!order) {
      throw new Error(`Order #${id} not found`);
    }
    return order;
  }

  static async placeOrder(orderData) {
    const { customerName, customerEmail, warehouseId, items } = orderData;

    if (!customerName || !customerEmail || !warehouseId || !items || !items.length) {
      throw new Error('Customer Name, Email, Warehouse ID, and at least 1 item are required!');
    }

    // Auto-generate Unique Order Number (e.g. ORD-172767890123)
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

    const newOrderId = await OrderModel.createOrderWithTransaction({
      ...orderData,
      orderNumber
    });

    return await OrderModel.findById(newOrderId);
  }

  static async updateOrderStatus(id, status) {
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status! Allowed: ${validStatuses.join(', ')}`);
    }

    const isUpdated = await OrderModel.updateStatus(id, status);
    if (!isUpdated) {
      throw new Error(`Order #${id} not found`);
    }

    return await OrderModel.findById(id);
  }
}

export default OrderService;
