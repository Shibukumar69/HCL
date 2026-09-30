import pool from '../config/db.js';

class OrderModel {
  // 1. Saare orders list karna
  static async findAll() {
    const query = `
      SELECT o.id, o.order_number, o.customer_name, o.customer_email, 
             o.total_amount, o.status, o.created_at, w.name AS warehouse_name
      FROM orders o
      JOIN warehouses w ON o.warehouse_id = w.id
      ORDER BY o.id DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // 2. Order details along with all items
  static async findById(id) {
    const orderQuery = `
      SELECT o.*, w.name AS warehouse_name 
      FROM orders o
      JOIN warehouses w ON o.warehouse_id = w.id
      WHERE o.id = ?
    `;
    const [orders] = await pool.query(orderQuery, [id]);
    if (!orders[0]) return null;

    const itemsQuery = `
      SELECT oi.*, p.name AS product_name, p.sku 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    const [items] = await pool.query(itemsQuery, [id]);

    return {
      ...orders[0],
      items
    };
  }

  // 3. Create Order with Transaction & Automatic Stock Deduction
  static async createOrderWithTransaction(orderData) {
    const { orderNumber, customerName, customerEmail, warehouseId, items } = orderData;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let totalAmount = 0;
      const verifiedItems = [];

      // Step A: Stock aur Price verify karein
      for (const item of items) {
        const [prod] = await connection.query(`SELECT price, name FROM products WHERE id = ?`, [item.productId]);
        if (!prod[0]) throw new Error(`Product ID ${item.productId} not found`);

        const [inv] = await connection.query(
          `SELECT quantity FROM inventory WHERE product_id = ? AND warehouse_id = ? FOR UPDATE`,
          [item.productId, warehouseId]
        );

        const currentStock = inv[0] ? inv[0].quantity : 0;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${prod[0].name} in this warehouse! (Available: ${currentStock})`);
        }

        const subtotal = Number(prod[0].price) * Number(item.quantity);
        totalAmount += subtotal;

        verifiedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: prod[0].price,
          subtotal
        });
      }

      // Step B: Insert into Orders table
      const [orderResult] = await connection.query(
        `INSERT INTO orders (order_number, customer_name, customer_email, warehouse_id, total_amount, status)
         VALUES (?, ?, ?, ?, ?, 'PENDING')`,
        [orderNumber, customerName, customerEmail, warehouseId, totalAmount]
      );
      const newOrderId = orderResult.insertId;

      // Step C: Insert Order Items & Deduct Inventory
      for (const item of verifiedItems) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [newOrderId, item.productId, item.quantity, item.unitPrice, item.subtotal]
        );

        // Inventory se stock ghatana
        await connection.query(
          `UPDATE inventory SET quantity = quantity - ? WHERE product_id = ? AND warehouse_id = ?`,
          [item.quantity, item.productId, warehouseId]
        );
      }

      await connection.commit();
      return newOrderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // 4. Update Order Status
  static async updateStatus(id, status) {
    const query = `UPDATE orders SET status = ? WHERE id = ?`;
    const [result] = await pool.query(query, [status, id]);
    return result.affectedRows > 0;
  }
}

export default OrderModel;
