import type { UserType, UpdateUserDTO, CreateUserDTO } from './user.dto.ts';
import bcrypt from 'bcrypt';
import { User } from "./user.model"

class UserService {
  // Get user by email (for authentication - includes password)
  async getUserByEmailForAuth(email: string): Promise<UserType | null> {
    return await User.findOne({ email }).lean() as UserType;
  }

  // Get user by ID with password
  async getUserByIdWithPassword(id: string): Promise<UserType | null> {
    return await User.findById(id).lean() as UserType;
  }

  // Update user password
  async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
    const result = await User.findByIdAndUpdate(id, { password: newPassword });
    return !!result;
  }

  // Get user by email (without password - for public use)
  async getUserByEmail(email: string): Promise<Omit<UserType, 'password'> | null> {
    return await User.findOne({ email }).select('-password').lean() as Omit<UserType, 'password'>;
  }

  // Create user
  async createUser(data: CreateUserDTO): Promise<Omit<UserType, "password">> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user: UserType = {
      ...data,
      password: hashedPassword,
      role: data.role || 'user',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const u = new User(user);
    await u.save();
    const { password, ...userWithoutPassword } = u.toObject();
    
    // Convert null to undefined for avatar field
    return {
      ...userWithoutPassword,
      avatar: userWithoutPassword.avatar ?? undefined
    } as Omit<UserType, 'password'>;
  }

  // Get all users
  async getAllUsers(): Promise<Omit<UserType, 'password'>[]> {
    const users = await User.find().select('-password').lean();
    return users as Omit<UserType, 'password'>[];
  }

  // Get user by ID
  async getUserById(id: string): Promise<Omit<UserType, 'password'> | null> {
    const user = await User.findById(id).select('-password').lean();
    return user as Omit<UserType, 'password'> | null;
  }

  // Update user
  async updateUser(id: string, data: UpdateUserDTO): Promise<Omit<UserType, 'password'> | null> {
    const user = await User.findByIdAndUpdate(
      id, 
      { ...data, updatedAt: new Date() },
      { new: true, lean: true }
    ).select('-password');
    return user as Omit<UserType, 'password'> | null;
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    const user = await User.findByIdAndDelete(id);
    return !!user;
  }
}

export default new UserService();