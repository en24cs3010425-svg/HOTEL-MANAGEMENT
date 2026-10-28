import { Response } from 'express';
import crypto from 'crypto';
import { storage } from '../db/storage.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { Payment } from '../types/index.ts';

export const createPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, amount, provider, method } = req.body;

    if (!bookingId || !amount) {
      res.status(400).json({ success: false, message: 'Booking ID and amount are required.' });
      return;
    }

    const booking = storage.getBookingById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    const transactionReference = `txn_sbx_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`;

    const newPayment: Payment = {
      id: `pay-${crypto.randomUUID().slice(0, 8)}`,
      bookingId,
      bookingReference: booking.bookingReference,
      userId: req.user ? req.user.id : booking.userId,
      amount: Number(amount),
      currency: 'USD',
      provider: provider || 'Stripe Sandbox',
      transactionReference,
      status: 'pending',
      method: method || 'Credit / Debit Card',
      paymentDate: new Date().toISOString()
    };

    storage.createPayment(newPayment);

    res.status(201).json({
      success: true,
      message: 'Payment initiated.',
      payment: newPayment
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ success: false, message: 'Server error processing payment.' });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { transactionReference, providerResult } = req.body;

    if (!transactionReference) {
      res.status(400).json({ success: false, message: 'Transaction reference is required.' });
      return;
    }

    const payment = storage.getPayments().find(p => p.transactionReference === transactionReference);
    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found for this reference.' });
      return;
    }

    // In a sandbox environment, we perform server-side verification:
    const isSuccess = providerResult !== 'simulate_failure';
    const status = isSuccess ? 'completed' : 'failed';

    const updatedPayment = storage.updatePayment(payment.id, { status });
    if (isSuccess) {
      storage.updateBooking(payment.bookingId, { paymentStatus: 'completed' });
    }

    res.json({
      success: isSuccess,
      message: isSuccess ? 'Payment verified successfully.' : 'Payment gateway declined transaction.',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Server error verifying payment.' });
  }
};

export const getPaymentHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let payments = storage.getPayments();

    if (req.user && req.user.role === 'guest') {
      payments = payments.filter(p => p.userId === req.user?.id);
    }

    // Sort by paymentDate desc
    payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Server error fetching payment history.' });
  }
};

export const refundPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payment = storage.getPaymentById(id);

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found.' });
      return;
    }

    if (payment.status === 'refunded') {
      res.status(400).json({ success: false, message: 'Payment is already refunded.' });
      return;
    }

    const updated = storage.updatePayment(id, { status: 'refunded' });
    storage.updateBooking(payment.bookingId, { paymentStatus: 'refunded' });

    res.json({
      success: true,
      message: `Refund of $${payment.amount} processed for transaction ${payment.transactionReference}.`,
      payment: updated
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ success: false, message: 'Server error processing refund.' });
  }
};
