import { Router } from 'express';
import { authenticate, requireRole, optionalAuthenticate } from '../middleware/auth.ts';
import * as authController from '../controllers/authController.ts';
import * as roomController from '../controllers/roomController.ts';
import * as bookingController from '../controllers/bookingController.ts';
import * as paymentController from '../controllers/paymentController.ts';
import * as adminController from '../controllers/adminController.ts';
import * as staffController from '../controllers/staffController.ts';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.me);
router.post('/auth/demo-login', authController.demoLogin);

// --- User Profile ---
router.get('/users/profile', authenticate, authController.me);
router.put('/users/profile', authenticate, authController.updateProfile);

// --- Room Routes ---
router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/:id', roomController.getRoomById);
router.post('/rooms', authenticate, requireRole('admin', 'staff'), roomController.createRoom);
router.put('/rooms/:id', authenticate, requireRole('admin', 'staff'), roomController.updateRoom);
router.delete('/rooms/:id', authenticate, requireRole('admin'), roomController.deleteRoom);
router.patch('/rooms/:id/cleaning', authenticate, requireRole('admin', 'staff'), roomController.updateCleaningStatus);

// --- Booking Routes ---
router.get('/bookings', authenticate, bookingController.getAllBookings);
router.get('/bookings/:id', optionalAuthenticate, bookingController.getBookingById);
router.post('/bookings', optionalAuthenticate, bookingController.createBooking);
router.put('/bookings/:id/cancel', authenticate, bookingController.cancelBooking);
router.patch('/bookings/:id/status', authenticate, requireRole('admin', 'staff'), bookingController.updateBookingStatus);

// --- Admin & Staff Operations ---
router.get('/admin/dashboard', authenticate, requireRole('admin', 'staff'), adminController.getDashboardAnalytics);
router.get('/admin/bookings', authenticate, requireRole('admin', 'staff'), bookingController.getAllBookings);
router.get('/admin/users', authenticate, requireRole('admin'), adminController.getAllGuests);
router.get('/admin/reports', authenticate, requireRole('admin'), adminController.getReports);

// --- Staff Management ---
router.get('/admin/staff', authenticate, requireRole('admin', 'staff'), staffController.getAllStaff);
router.post('/admin/staff', authenticate, requireRole('admin'), staffController.createStaff);
router.put('/admin/staff/:id', authenticate, requireRole('admin'), staffController.updateStaff);
router.delete('/admin/staff/:id', authenticate, requireRole('admin'), staffController.deleteStaff);

// --- Payment Routes ---
router.post('/payments/create', optionalAuthenticate, paymentController.createPayment);
router.post('/payments/verify', optionalAuthenticate, paymentController.verifyPayment);
router.get('/payments/history', authenticate, paymentController.getPaymentHistory);
router.post('/payments/:id/refund', authenticate, requireRole('admin'), paymentController.refundPayment);

// --- Inquiries & Messages ---
router.post('/contact', adminController.createMessage);
router.get('/contact', authenticate, requireRole('admin', 'staff'), adminController.getMessages);

export default router;
