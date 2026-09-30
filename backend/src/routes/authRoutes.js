import express from 'express';
import { register, login, getProfile, getAllUsers } from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/users', protect, authorizeRoles('ADMIN'), getAllUsers);

export default router;
