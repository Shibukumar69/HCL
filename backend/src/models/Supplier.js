import pool from '../config/db.js';

class SupplierModel {
  // 1. Saare suppliers fetch karna
  static async findAll() {
    const query = `SELECT * FROM suppliers ORDER BY id DESC`;
    const [rows] = await pool.query(query);
    return rows;
  }

  // 2. ID se supplier fetch
  static async findById(id) {
    const query = `SELECT * FROM suppliers WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // 3. Email se supplier check (Unique email)
  static async findByEmail(email) {
    const query = `SELECT * FROM suppliers WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  // 4. Naya supplier create karna
  static async create(supplierData) {
    const { name, contact_person, email, phone, address, lead_time_days } = supplierData;
    const query = `
      INSERT INTO suppliers (name, contact_person, email, phone, address, lead_time_days)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      name,
      contact_person || '',
      email,
      phone || '',
      address || '',
      lead_time_days || 7
    ]);
    return result.insertId;
  }

  // 5. Supplier delete karna
  static async deleteById(id) {
    const query = `DELETE FROM suppliers WHERE id = ?`;
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}

export default SupplierModel;
