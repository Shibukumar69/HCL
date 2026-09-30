import AuthService from '../services/authService.js';
import UserModel from '../models/User.js';

// 1. POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { user, token } = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: { user, token }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { user, token } = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: { user, token }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

// 3. GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. GET /api/auth/users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
