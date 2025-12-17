import type { Payment, CreatePaymentDTO } from './payment.dto';
import { PaymentStatus } from './payment.dto';
import { PaymentModel } from './payment.model';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';

class PaymentService {
  async createPayment(data: CreatePaymentDTO): Promise<Payment> {
   const paymentData = {
  orderId: new Types.ObjectId(data.orderId),
  userId: new Types.ObjectId(data.userId),
  amount: data.amount,
  method: data.method, 
  status: PaymentStatus.PENDING,
  transactionId: `TXN-${uuidv4().slice(0, 8)}`,
};


    const newPayment = await new PaymentModel(paymentData).save();
    return newPayment.toObject() as Payment;
  }

  async getAllPayments(): Promise<Payment[]> {
    return PaymentModel.find().lean() as unknown as Payment[];
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    const payment = await PaymentModel.findById(id).lean();
    return payment as Payment | null;
  }

  async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
    const payments = await PaymentModel.find({
      orderId: new Types.ObjectId(orderId),
    }).lean();

    return payments as Payment[];
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    const payments = await PaymentModel.find({
      userId: new Types.ObjectId(userId),
    }).lean();

    return payments as Payment[];
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment | null> {
    const payment = await PaymentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    return payment as Payment | null;
  }

  async processPayment(id: string): Promise<Payment | null> {
    // step 1
    await PaymentModel.findByIdAndUpdate(id, {
      status: PaymentStatus.PROCESSING,
    });

    // step 2
    const finalPayment = await PaymentModel.findByIdAndUpdate(
      id,
      { status: PaymentStatus.COMPLETED },
      { new: true }
    ).lean();

    return finalPayment as Payment | null;
  }

  async refundPayment(id: string): Promise<Payment | null> {
    const refund = await PaymentModel.findByIdAndUpdate(
      id,
      { status: PaymentStatus.REFUNDED },
      { new: true }
    ).lean();

    return refund as Payment | null;
  }
}

export default new PaymentService();
