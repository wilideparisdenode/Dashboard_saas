
import { Request, Response, NextFunction } from 'express';
import orderService from './order.service';
// import { OrderModel } from './order.model';

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await orderService.createOrder(req.body,req.user?.userId);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    res.status(200).json({ success: true, data: order });
        console.log({ success: true, data: order })

  } catch (error) {
    next(error);
  }
};

export const getOrdersByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await orderService.getOrdersByUserId(req.params.userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await orderService.cancelOrder(req.params.id);
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    if (!order) {
       res.status(404).json({ success: false, message: 'Order not found' });
       return;
    }
    res.status(200).json({ success: true, message: "product was succefully deleted" });
  } catch (error) {
    next(error);
  }
};