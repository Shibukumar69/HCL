import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

class AuthService {
  // Token generation helper
  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // 1. Register User
  static async register({ name, email, password, role }) {
    if (!name || !email || !password) {
      throw new Error('Name, Email, and Password are required!');
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error(`User with email '${email}' already exists!`);
    }

    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserId = await UserModel.create({
      name,
      email,
      hashedPassword,
      role
    });

    const user = await UserModel.findById(newUserId);
    const token = this.generateToken(user);

    return { user, token };
  }

  // 2. Login User
  static async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and Password are required!');
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare plain password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    const safeUser = await UserModel.findById(user.id);

    return { user: safeUser, token };
  }
}

export default AuthService;
