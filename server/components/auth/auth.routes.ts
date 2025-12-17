import { Router } from 'express';
import AuthController from './auth.controller';
import { AuthMiddleware } from './auth.middleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', AuthMiddleware.verifyToken, AuthController.getProfile);
router.post('/change-password', AuthMiddleware.verifyToken, AuthController.changePassword);
router.post('/refresh-token', AuthMiddleware.verifyToken, AuthController.refreshToken);

export default router;