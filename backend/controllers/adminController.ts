import { Request, Response } from 'express';
import { storage } from '../db/storage.ts';

export const getDashboardAnalytics = (_req: Request, res: Response): void => {
  try {
    const stats = storage.getDashboardStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error computing dashboard analytics:', error);
    res.status(500).json({ success: false, message: 'Server error computing dashboard metrics.' });
  }
};

export const getAllGuests = (_req: Request, res: Response): void => {
  try {
    const users = storage.getUsers().filter(u => u.role === 'guest');
    const bookings = storage.getBookings();

    const guestsWithStats = users.map(user => {
      const userBookings = bookings.filter(b => b.userId === user.id || b.userEmail === user.email);
      const totalSpent = userBookings
        .filter(b => b.bookingStatus !== 'cancelled')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...safe } = user;
      return {
        ...safe,
        bookingsCount: userBookings.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        lastBookingDate: userBookings[0]?.createdAt || null
      };
    });

    res.json({
      success: true,
      count: guestsWithStats.length,
      guests: guestsWithStats
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ success: false, message: 'Server error fetching guest list.' });
  }
};

export const getReports = (_req: Request, res: Response): void => {
  try {
    const rooms = storage.getRooms();
    const bookings = storage.getBookings();
    const payments = storage.getPayments();

    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const refundedAmount = payments
      .filter(p => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0);

    // Revenue by Room Type
    const revenueByType: Record<string, { revenue: number; nights: number; bookingsCount: number }> = {};
    bookings
      .filter(b => b.bookingStatus !== 'cancelled')
      .forEach(b => {
        if (!revenueByType[b.roomType]) {
          revenueByType[b.roomType] = { revenue: 0, nights: 0, bookingsCount: 0 };
        }
        revenueByType[b.roomType].revenue += b.totalAmount;
        revenueByType[b.roomType].nights += b.nightsCount;
        revenueByType[b.roomType].bookingsCount += 1;
      });

    res.json({
      success: true,
      reports: {
        totalRoomsCount: rooms.length,
        totalBookingsCount: bookings.length,
        grossRevenue: Math.round(totalRevenue * 100) / 100,
        refundedAmount: Math.round(refundedAmount * 100) / 100,
        netRevenue: Math.round((totalRevenue - refundedAmount) * 100) / 100,
        revenueByType,
        averageDailyRate: bookings.length > 0 ? Math.round(totalRevenue / bookings.reduce((acc, b) => acc + b.nightsCount, 1)) : 0
      }
    });
  } catch (error) {
    console.error('Error generating reports:', error);
    res.status(500).json({ success: false, message: 'Server error generating reports.' });
  }
};

export const getMessages = (_req: Request, res: Response): void => {
  try {
    const messages = storage.getMessages();
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error fetching contact messages.' });
  }
};

export const createMessage = (req: Request, res: Response): void => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
      return;
    }

    const newMsg = storage.createMessage({
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject: subject || 'General Hotel Inquiry',
      message,
      createdAt: new Date().toISOString(),
      status: 'unread'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to HotelPro. Our concierge will respond shortly.',
      contactMessage: newMsg
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ success: false, message: 'Server error submitting inquiry.' });
  }
};
