import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

// 1. Token Verification Middleware
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      
      req.user = await UserModel.findById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// 2. Role Authorization Middleware (e.g. authorize('ADMIN', 'WAREHOUSE_MANAGER'))
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'GUEST'}' is not authorized to access this resource`
      });
    }
    next();
  };
};
