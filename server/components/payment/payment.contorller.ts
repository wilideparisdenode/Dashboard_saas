
import { Request, Response, NextFunction } from 'express';
import paymentService from './payment.service';

export const createPayment = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (_req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });return
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const getPaymentsByOrderId = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const payments = await paymentService.getPaymentsByOrderId(req.params.orderId);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

export const processPayment = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const payment = await paymentService.processPayment(req.params.id);
    console.log(req.params.id)
    if (!payment) {
       res.status(404).json({ success: false, message: 'Payment not found' });return;

    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const payment = await paymentService.refundPayment(req.params.id);
    if (!payment) {
       res.status(404).json({ success: false, message: 'Payment not found' });
       return;
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
