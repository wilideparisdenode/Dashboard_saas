
import { Router } from 'express';
import * as paymentController from './payment.contorller';

const router = Router();

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.get('/order/:orderId', paymentController.getPaymentsByOrderId);
router.put('/:id/process', paymentController.processPayment);
router.post('/:id/refund', paymentController.refundPayment);

export default router;