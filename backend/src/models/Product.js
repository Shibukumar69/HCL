import pool from '../config/db.js';

class ProductModel {
  // 1. Saare products fetch karna (with category & pricing)
  static async findAll() {
    const query = `
      SELECT id, sku, name, category, price, cost_price, created_at, updated_at 
      FROM products 
      ORDER BY id DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // 2. ID se single product dhoondhna
  static async findById(id) {
    const query = `SELECT * FROM products WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0]; // Pehla matching record
  }

  // 3. SKU se product dhoondhna (SKU unique hota hai)
  static async findBySku(sku) {
    const query = `SELECT * FROM products WHERE sku = ?`;
    const [rows] = await pool.query(query, [sku]);
    return rows[0];
  }

  // 4. Naya product insert karna
  static async create(productData) {
    const { sku, name, category, price, cost_price } = productData;
    const query = `
      INSERT INTO products (sku, name, category, price, cost_price) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      sku,
      name,
      category,
      price,
      cost_price || 0.00
    ]);
    return result.insertId;
  }

  // 5. Product delete karna
  static async deleteById(id) {
    const query = `DELETE FROM products WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}

export default ProductModel;
