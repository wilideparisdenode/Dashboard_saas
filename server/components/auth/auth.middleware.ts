import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { DecodedToken } from './auth.dto';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// Strongly type env values for jsonwebtoken
const JWT_SECRET: jwt.Secret =
  process.env.JWT_SECRET ?? 'your-secret-key-change-in-production';

const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '7d';

export class AuthMiddleware {
  // Generate JWT token
  static generateToken(
    userId: string,
    email: string,
    role: string
  ): string {
    return jwt.sign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Verify JWT token middleware
  static verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided or invalid format',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          message: 'Token expired',
        });
        return;
      }

      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  }

  // Alias for verifyToken - more concise name
  static protect = AuthMiddleware.verifyToken;

  // Role-based authorization middleware
  static authorize(...allowedRoles: string[]) {
    return (
      req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
        return;
      }

      next();
    };
  }

  // Optional authentication middleware
  static optionalAuth(
    req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        req.user = decoded;
      } catch {
        // silently ignore invalid token
      }
    }

    next();
  }
}