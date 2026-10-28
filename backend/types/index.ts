export type UserRole = 'guest' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  createdAt: string;
}

export type RoomType =
  | 'Deluxe Room'
  | 'Executive Suite'
  | 'Presidential Suite'
  | 'Ocean View Villa'
  | 'Classic Heritage'
  | 'Family Penthouse';

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
export type CleaningStatus = 'clean' | 'dirty' | 'in_progress' | 'inspected';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: RoomStatus;
  cleaningStatus: CleaningStatus;
  floor: number;
  sizeSqFt: number;
  bedType: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'completed' | 'pending' | 'refunded' | 'failed';

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  roomImage: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsCount: number;
  nightsCount: number;
  roomRate: number;
  subtotal: number;
  taxAmount: number;
  cleaningFee: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  cancelledAt?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  bookingReference: string;
  userId: string;
  amount: number;
  currency: string;
  provider: 'Stripe Sandbox' | 'Razorpay Test' | 'PayPal Sandbox' | 'Hotel Desk Direct';
  transactionReference: string;
  status: PaymentStatus;
  method: 'Credit / Debit Card' | 'Instant UPI / QR' | 'Net Banking' | 'Pay at Front Desk';
  paymentDate: string;
}

export interface Staff {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  designation: 'Front Desk Manager' | 'Executive Housekeeper' | 'Chief Concierge' | 'Operations Supervisor' | 'Night Auditor';
  assignedResponsibilities: string;
  shift: 'Morning' | 'Evening' | 'Night';
  employmentStatus: 'active' | 'on_leave' | 'inactive';
  joinedDate: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  totalBookings: number;
  confirmedBookings: number;
  checkedInBookings: number;
  totalGuests: number;
  totalRevenue: number;
  occupancyRate: number;
  monthlyRevenue: { month: string; revenue: number; bookings: number }[];
  roomTypeOccupancy: { type: string; count: number; percentage: number }[];
  bookingStatusDistribution: { status: string; count: number }[];
}
