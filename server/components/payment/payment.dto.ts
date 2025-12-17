import { Types } from 'mongoose';
 export interface Payment {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  amount: number;
  method: string;
  status: PaymentStatus;
  transactionId?: string | null;
}

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus =
  typeof OrderStatus[keyof typeof OrderStatus];
export const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus =
  typeof PaymentStatus[keyof typeof PaymentStatus];


export interface CreatePaymentDTO {
  orderId: string;
  userId: string;
  amount: number;
  status:PaymentStatus;
  method?: String;
}