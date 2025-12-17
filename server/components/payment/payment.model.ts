import { Schema, model, Types } from 'mongoose';

// Payment schema
const paymentSchema = new Schema(
  {
    orderId:{ type: Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    method: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    transactionId:String
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create and export model
export const PaymentModel = model('Payment', paymentSchema);
