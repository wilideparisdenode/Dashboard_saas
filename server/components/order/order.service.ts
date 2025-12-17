
import  type  { Order, CreateOrderDTO } from './order.dto';
import    { OrderStatus } from './order.dto';
import { OrderModel } from './order.model';

import productService from '../product/product.service';
import paymentService from '../payment/payment.service';
import { PaymentStatus } from '../payment/payment.dto';

class OrderService {
 

async createOrder(data: CreateOrderDTO,userId:any) {
  // 1. Calculate total amount
  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 2. Create order object
  const order: Order = {
   
    ...data,
    totalAmount,
    status: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 3. Save order
  const savedOrder = await new OrderModel(order).save();
 console.log(data)
  // 4. Update product stock
  for (const item of data.items) {
   const r= await productService.updateStock(item.productId, item.quantity);
    if(r)console.log(r);
  }

  // 5. Automatically create PENDING payment
  await paymentService.createPayment({
    orderId: savedOrder._id.toString(),
    userId:userId.toString(),
    amount: totalAmount,
    method: data.method,
    status: PaymentStatus.PENDING
  });
const orderObject = savedOrder.toObject();
return orderObject;
}

  async getAllOrders(): Promise<Order[]> {
    return await OrderModel.find();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return OrderModel.findById(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await OrderModel.find({userId});
  }
async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
 const order = await OrderModel.findByIdAndUpdate(
  id,
  { status, updatedAt: new Date() },
  { new: true }
).lean<Order>().exec(); 


  return order;
}


  async cancelOrder(id: string): Promise<Order | null> {
    return await OrderModel.findByIdAndUpdate(id, {status:"Cancelled"}, { new: true }
).lean<Order>().exec();
  }

    async deleteOrder(id: string): Promise<Order | null> {
    return await OrderModel.findByIdAndDelete(id).lean<Order>().exec();
  }
}

export default new OrderService();