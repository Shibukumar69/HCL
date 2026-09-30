import pool from '../config/db.js';

class DashboardModel {
  static async getSummaryStats() {
    // 1. Total Products
    const [productsCount] = await pool.query(`SELECT COUNT(*) as count FROM products`);
    
    // 2. Total Warehouses
    const [warehousesCount] = await pool.query(`SELECT COUNT(*) as count FROM warehouses`);
    
    // 3. Total Stock & Low Stock Items
    const [inventoryStats] = await pool.query(`
      SELECT 
        COALESCE(SUM(quantity), 0) AS total_units_in_stock,
        COUNT(CASE WHEN quantity <= min_threshold THEN 1 END) AS low_stock_items_count
      FROM inventory
    `);

    // 4. Total Orders & Revenue
    const [orderStats] = await pool.query(`
      SELECT 
        COUNT(*) AS total_orders,
        COALESCE(SUM(CASE WHEN status != 'CANCELLED' THEN total_amount ELSE 0 END), 0) AS total_revenue
      FROM orders
    `);

    // 5. Recent 5 Orders
    const [recentOrders] = await pool.query(`
      SELECT o.id, o.order_number, o.customer_name, o.total_amount, o.status, o.created_at, w.name AS warehouse_name
      FROM orders o
      JOIN warehouses w ON o.warehouse_id = w.id
      ORDER BY o.id DESC
      LIMIT 5
    `);

    return {
      totalProducts: productsCount[0].count,
      totalWarehouses: warehousesCount[0].count,
      totalStockUnits: Number(inventoryStats[0].total_units_in_stock),
      lowStockItemsCount: Number(inventoryStats[0].low_stock_items_count),
      totalOrders: orderStats[0].total_orders,
      totalRevenue: Number(orderStats[0].total_revenue),
      recentOrders
    };
  }
}

export default DashboardModel;
