// ============================================

// ============================================
export interface Order {
  _id?: string;
  userId: String;
  items: OrderItem[];
  totalAmount: number;
  status?: OrderStatus;
  mothod?:string,
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface CreateOrderDTO {
  userId: String;
  items: OrderItem[];
  method:string;
  shippingAddress: Address;
}
