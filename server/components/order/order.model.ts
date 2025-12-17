import { Schema, model, Document,Types } from 'mongoose';
import { OrderStatus, Address, OrderItem } from './order.dto';

interface OrderDocument extends Document {
  userId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export const  orderItemSchema = new Schema<OrderItem>({
  productId: { type:String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export const addressSchema = new Schema<Address>({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
});

const orderSchema = new Schema<OrderDocument>({
  userId: { type: Types.ObjectId, required: true },
 items: [
  {
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }
],
status:String,
shippingAddress: { type: addressSchema, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const OrderModel = model<OrderDocument>('Order', orderSchema);
