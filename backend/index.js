import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { testDBConnection } from './src/config/db.js';
import productRoutes from './src/routes/productRoutes.js';
import warehouseRoutes from './src/routes/warehouseRoutes.js';
import supplierRoutes from './src/routes/supplierRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import { notFound, errorHandler } from './src/middlewares/errorMiddleware.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors()); // Angular / React cross-origin requests ke liye
app.use(express.json()); // JSON payload parse karne ke liye
app.use(morgan('dev')); // HTTP request terminal logger

// Database connection check
testDBConnection();

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'Retail Inventory Management System API',
    version: '1.0.0'
  });
});

// All Feature Routes
app.use('/api/products', productRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Error Handling Middlewares (Ye hamesha saare routes ke baad aate hain)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
