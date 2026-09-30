import pool from '../config/db.js';

class UserModel {
  // 1. Email se user find karna
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  // 2. ID se user find karna (Password exclude karke)
  static async findById(id) {
    const query = `SELECT id, name, email, role, created_at FROM users WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // 3. Naya user create karna
  static async create(userData) {
    const { name, email, hashedPassword, role } = userData;
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      name,
      email,
      hashedPassword,
      role || 'STAFF'
    ]);
    return result.insertId;
  }

  // 4. Saare users list karna (Admin feature)
  static async findAll() {
    const query = `SELECT id, name, email, role, created_at FROM users ORDER BY id DESC`;
    const [rows] = await pool.query(query);
    return rows;
  }
}

export default UserModel;
