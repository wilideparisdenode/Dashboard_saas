import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginDTO, RegisterDTO, AuthResponse } from './auth.dto';
import { CreateUserDTO } from '../user/user.dto';
import UserService from '../user/user.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class AuthService {
  private userService = UserService;

  // Register new user
  async register(data: RegisterDTO): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userService.getUserByEmail(data.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user data
      const userData: CreateUserDTO = {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || 'user',
        phone: data.phone,
      };

      // Create user (password will be hashed in user service)
      const user = await this.userService.createUser(userData);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id!.toString(), 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: {
          _id: user._id!.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          phone: user.phone,
          avatar: user.avatar
        },
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(data: LoginDTO): Promise<AuthResponse> {
    try {
      // Find user by email (including password for verification)
      const user = await this.userService.getUserByEmailForAuth(data.email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new Error('Account is not active');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id!.toString(), 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

     
      return {
        user: {
          _id: user._id!.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          phone: user.phone,
          avatar: user.avatar
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Verify token
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Get current user profile
  async getProfile(userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // First get user with password
      const userWithPassword = await this.getUserWithPassword(userId);
      if (!userWithPassword) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, userWithPassword.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.userService.updateUserPassword(userId, hashedPassword);

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Helper method to get user with password (for internal use)
  private async getUserWithPassword(userId: string) {
    try {
      const user = await this.userService.getUserByIdWithPassword(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();