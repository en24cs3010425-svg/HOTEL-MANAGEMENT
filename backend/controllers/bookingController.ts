import { Response } from 'express';
import crypto from 'crypto';
import { storage } from '../db/storage.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { Booking, BookingStatus, Payment } from '../types/index.ts';

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guestsCount,
      specialRequests,
      guestName,
      guestEmail,
      guestPhone,
      paymentMethod
    } = req.body;

    if (!roomId || !checkIn || !checkOut || !guestsCount) {
      res.status(400).json({ success: false, message: 'Room, check-in, check-out, and guest count are required.' });
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      res.status(400).json({ success: false, message: 'Invalid check-in or check-out date format.' });
      return;
    }

    if (checkInDate >= checkOutDate) {
      res.status(400).json({ success: false, message: 'Check-out date must be after check-in date.' });
      return;
    }

    const room = storage.getRoomById(roomId);
    if (!room) {
      res.status(404).json({ success: false, message: 'Selected room not found.' });
      return;
    }

    if (guestsCount > room.capacity) {
      res.status(400).json({
        success: false,
        message: `Selected room capacity is ${room.capacity} guests max. You requested ${guestsCount} guests.`
      });
      return;
    }

    // Critical: Collision check with database consistency
    const isAvail = storage.isRoomAvailableForDates(roomId, checkIn, checkOut);
    if (!isAvail) {
      res.status(409).json({
        success: false,
        message: 'This room is already reserved for the selected dates. Please select other dates or another luxury suite.'
      });
      return;
    }

    // Calculate nights & pricing
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nightsCount = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    const roomRate = room.pricePerNight;
    const subtotal = roomRate * nightsCount;
    const taxAmount = Math.round(subtotal * 0.12 * 100) / 100; // 12% hotel occupancy tax
    const cleaningFee = room.pricePerNight > 500 ? 75 : 50;
    const totalAmount = Math.round((subtotal + taxAmount + cleaningFee) * 100) / 100;

    // Determine user details
    const userId = req.user ? req.user.id : `guest-${crypto.randomUUID().slice(0, 8)}`;
    const userName = req.user ? req.user.name : (guestName || 'Valued Guest');
    const userEmail = req.user ? req.user.email : (guestEmail || 'guest@example.com');
    const userPhone = req.user ? req.user.phone : (guestPhone || '');

    // Unique reference: HP-XXXXXX
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString();
    const bookingReference = `HP-${randomHex}`;

    const newBooking: Booking = {
      id: `book-${crypto.randomUUID().slice(0, 8)}`,
      bookingReference,
      userId,
      userName,
      userEmail,
      userPhone,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomType: room.type,
      roomImage: room.images[0] || '',
      checkIn,
      checkOut,
      guestsCount: Number(guestsCount),
      nightsCount,
      roomRate,
      subtotal,
      taxAmount,
      cleaningFee,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'completed',
      specialRequests: specialRequests || '',
      createdAt: new Date().toISOString()
    };

    storage.createBooking(newBooking);

    // Record verified transaction in payments ledger
    const newPayment: Payment = {
      id: `pay-${crypto.randomUUID().slice(0, 8)}`,
      bookingId: newBooking.id,
      bookingReference: newBooking.bookingReference,
      userId,
      amount: totalAmount,
      currency: 'USD',
      provider: 'Stripe Sandbox',
      transactionReference: `txn_sbx_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`,
      status: 'completed',
      method: paymentMethod || 'Credit / Debit Card',
      paymentDate: new Date().toISOString()
    };
    storage.createPayment(newPayment);

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully!',
      booking: newBooking,
      payment: newPayment
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Server error creating booking.' });
  }
};

export const getAllBookings = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { status, search } = req.query;
    let bookings = storage.getBookings();

    // If guest, show only their bookings
    if (req.user && req.user.role === 'guest') {
      bookings = bookings.filter(b => b.userId === req.user?.id || b.userEmail === req.user?.email);
    }

    if (status && status !== 'all') {
      bookings = bookings.filter(b => b.bookingStatus === status);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      bookings = bookings.filter(
        b =>
          b.bookingReference.toLowerCase().includes(q) ||
          b.userName.toLowerCase().includes(q) ||
          b.roomNumber.toLowerCase().includes(q) ||
          b.roomType.toLowerCase().includes(q)
      );
    }

    // Sort by createdAt descending
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching bookings.' });
  }
};

export const getBookingById = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const booking = storage.getBookingById(id) || storage.getBookingByReference(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Reservation not found.' });
      return;
    }

    // Check ownership if guest
    if (req.user && req.user.role === 'guest') {
      if (booking.userId !== req.user.id && booking.userEmail !== req.user.email) {
        res.status(403).json({ success: false, message: 'Unauthorized to view this reservation.' });
        return;
      }
    }

    const room = storage.getRoomById(booking.roomId);
    const payment = storage.getPayments().find(p => p.bookingId === booking.id);

    res.json({
      success: true,
      booking,
      room,
      payment
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Server error fetching booking details.' });
  }
};

export const cancelBooking = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const booking = storage.getBookingById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Reservation not found.' });
      return;
    }

    // Authorization
    if (req.user && req.user.role === 'guest') {
      if (booking.userId !== req.user.id && booking.userEmail !== req.user.email) {
        res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
        return;
      }
    }

    if (booking.bookingStatus === 'cancelled') {
      res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
      return;
    }

    if (booking.bookingStatus === 'checked_out') {
      res.status(400).json({ success: false, message: 'Cannot cancel a completed stay.' });
      return;
    }

    const updated = storage.updateBooking(booking.id, {
      bookingStatus: 'cancelled',
      paymentStatus: 'refunded',
      cancelledAt: new Date().toISOString()
    });

    // Also update associated payment record
    const payment = storage.getPayments().find(p => p.bookingId === booking.id);
    if (payment) {
      storage.updatePayment(payment.id, { status: 'refunded' });
    }

    res.json({
      success: true,
      message: `Reservation ${booking.bookingReference} has been cancelled and refund processed.`,
      booking: updated
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Server error cancelling booking.' });
  }
};

export const updateBookingStatus = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    const validStatuses: BookingStatus[] = ['confirmed', 'checked_in', 'checked_out', 'cancelled'];
    if (!validStatuses.includes(bookingStatus)) {
      res.status(400).json({ success: false, message: 'Invalid booking status.' });
      return;
    }

    const booking = storage.getBookingById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Reservation not found.' });
      return;
    }

    const updates: Partial<Booking> = { bookingStatus };

    // If checking in, mark room occupied
    if (bookingStatus === 'checked_in') {
      storage.updateRoom(booking.roomId, { status: 'occupied' });
    } else if (bookingStatus === 'checked_out') {
      // Room becomes dirty for housekeeping
      storage.updateRoom(booking.roomId, { status: 'available', cleaningStatus: 'dirty' });
    }

    const updated = storage.updateBooking(id, updates);

    res.json({
      success: true,
      message: `Reservation status updated to ${bookingStatus}.`,
      booking: updated
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Server error updating reservation status.' });
  }
};
