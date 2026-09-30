import OrderService from '../services/orderService.js';

// 1. GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /api/orders/:id
export const getOrder = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// 3. POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const order = await OrderService.placeOrder(req.body);
    res.status(201).json({
      success: true,
      message: 'Order created & stock deducted successfully!',
      data: order
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await OrderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json({
      success: true,
      message: `Order status updated to ${req.body.status}!`,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
