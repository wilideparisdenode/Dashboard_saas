// src/index.ts
import express, { Application ,Response} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import userRoutes from './components/user/user.routes';
import productRoutes from './components/product/product.routes';
import orderRoutes from './components/order/order.routes';
import paymentRoutes from './components/payment/payment.routes';
import { errorHandler } from './middleware/errorHandler';
import {c} from "./config/db"
import authRoutes from './components/auth/auth.routes';
import {AuthMiddleware}  from "./components/auth/auth.middleware"
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
c();
// Middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res:Response) => {
  
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', AuthMiddleware.verifyToken,userRoutes);
app.use('/api/products',AuthMiddleware.verifyToken, productRoutes);
app.use('/api/orders',AuthMiddleware.verifyToken, orderRoutes);
app.use('/api/payments',AuthMiddleware.verifyToken, paymentRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;




















