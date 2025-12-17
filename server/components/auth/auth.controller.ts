import { Request, Response } from 'express';
import { LoginDTO, RegisterDTO } from './auth.dto';
import AuthService from './auth.service';
import { AuthMiddleware } from './auth.middleware';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const userData: RegisterDTO = req.body;
      
      // Basic validation
      if (!userData.email || !userData.password || !userData.name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and name are required'
        });
      }

      const result = await AuthService.register(userData);
      
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginDTO = req.body;
      
      // Basic validation
      if (!loginData.email || !loginData.password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await AuthService.login(loginData);
      
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const user = await AuthService.getProfile(req.user.userId);
      
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'User not found'
      });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      const result = await AuthService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );
      if(!result) {
        return res.status(400).json({
        success: false,
        message: 'Password change not successful'
      });
      }
      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to change password'
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      // Get user from request (set by auth middleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      // Generate new token
      const token = AuthMiddleware.generateToken(
        req.user.userId,
        req.user.email,
        req.user.role
      );

      // Get user profile
      const user = await AuthService.getProfile(req.user.userId);

      return res.status(200).json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed'
      });
    }
  }
}

export default new AuthController();