import { Types } from "mongoose";
export interface UserType{
  _id?: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role:string;
  status:string;
  avatar?:string;
  phone?: string;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;  // Changed from firstName/lastName to name
  role?: string;
  phone?: string;
  address?: Address;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  address?: Address;
  avatar?: string;
  status?: string;
}