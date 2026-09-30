import pool from '../config/db.js';

class WarehouseModel {
  // 1. Saare warehouses fetch karna
  static async findAll() {
    const query = `SELECT * FROM warehouses ORDER BY id ASC`;
    const [rows] = await pool.query(query);
    return rows;
  }

  // 2. ID se warehouse dhoondhna
  static async findById(id) {
    const query = `SELECT * FROM warehouses WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // 3. Code se warehouse dhoondhna (Unique code jaise WH-DEL-01)
  static async findByCode(code) {
    const query = `SELECT * FROM warehouses WHERE code = ?`;
    const [rows] = await pool.query(query, [code]);
    return rows[0];
  }

  // 4. Naya warehouse create karna
  static async create(warehouseData) {
    const { code, name, location, capacity } = warehouseData;
    const query = `
      INSERT INTO warehouses (code, name, location, capacity)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      code,
      name,
      location,
      capacity || 1000
    ]);
    return result.insertId;
  }

  // 5. Complete Inventory View (SQL JOIN: Product + Warehouse + Quantity)
  static async getInventoryOverview() {
    const query = `
      SELECT 
        i.id AS inventory_id,
        p.id AS product_id,
        p.sku,
        p.name AS product_name,
        p.category,
        p.price,
        w.id AS warehouse_id,
        w.code AS warehouse_code,
        w.name AS warehouse_name,
        w.location,
        i.quantity,
        i.min_threshold,
        CASE 
          WHEN i.quantity <= i.min_threshold THEN 'LOW_STOCK'
          ELSE 'IN_STOCK'
        END AS stock_status
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      ORDER BY w.name, p.name;
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // 6. Low Stock Alert query (Wo products jinka stock threshold se kam hai)
  static async getLowStockAlerts() {
    const query = `
      SELECT 
        p.sku,
        p.name AS product_name,
        w.code AS warehouse_code,
        w.name AS warehouse_name,
        i.quantity,
        i.min_threshold
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      WHERE i.quantity <= i.min_threshold;
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // 7. Stock Transfer (ACID SQL Transaction)
  static async transferStock(productId, sourceWarehouseId, destWarehouseId, quantity) {
    const connection = await pool.getConnection();
    try {
      // Step A: Transaction Start
      await connection.beginTransaction();

      // Step B: Source warehouse mein stock check karein
      const [sourceStock] = await connection.query(
        `SELECT quantity FROM inventory WHERE product_id = ? AND warehouse_id = ? FOR UPDATE`,
        [productId, sourceWarehouseId]
      );

      if (!sourceStock[0] || sourceStock[0].quantity < quantity) {
        throw new Error('Insufficient stock in source warehouse to transfer!');
      }

      // Step C: Source se minus karein
      await connection.query(
        `UPDATE inventory SET quantity = quantity - ? WHERE product_id = ? AND warehouse_id = ?`,
        [quantity, productId, sourceWarehouseId]
      );

      // Step D: Destination warehouse mein add karein (Upsert: agar entry nahi hai toh insert karein)
      await connection.query(
        `INSERT INTO inventory (product_id, warehouse_id, quantity)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
        [productId, destWarehouseId, quantity]
      );

      // Step E: Commit Transaction
      await connection.commit();
      return true;
    } catch (error) {
      // Agar koi bhi step fail hua toh Rollback (undo sab changes)
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default WarehouseModel;
