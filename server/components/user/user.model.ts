import mongoose, { Schema } from 'mongoose';

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  avatar: String,
  phone: String,
  address: addressSchema,
  lastloggedin: { type: Date, default:Date.now() }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt
});

export const User = mongoose.model('User', userSchema);