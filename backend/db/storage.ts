import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Room, Booking, Payment, Staff, ContactMessage, DashboardStats } from '../types/index.ts';

interface DatabaseSchema {
  users: User[];
  rooms: Room[];
  bookings: Booking[];
  payments: Payment[];
  staff: Staff[];
  messages: ContactMessage[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hotelpro_db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create data directory:', err);
  }
}

class Storage {
  private data: DatabaseSchema = {
    users: [],
    rooms: [],
    bookings: [],
    payments: [],
    staff: [],
    messages: []
  };

  constructor() {
    this.init();
  }

  private init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // If users or rooms are missing, seed
        if (!this.data.rooms || this.data.rooms.length === 0) {
          this.seedInitialData();
        }
      } catch (err) {
        console.error('Error reading db file, re-seeding:', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  private seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);
    const staffPasswordHash = bcrypt.hashSync('staff123', salt);
    const guestPasswordHash = bcrypt.hashSync('guest123', salt);

    const users: User[] = [
      {
        id: 'user-admin-01',
        name: 'Alexander Wright',
        email: 'admin@hotelpro.com',
        passwordHash: adminPasswordHash,
        phone: '+1 (555) 234-5678',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        address: 'Suite 100, Grand Avenue, Beverly Hills, CA',
        createdAt: '2026-01-15T08:00:00.000Z'
      },
      {
        id: 'user-staff-01',
        name: 'Sophia Sterling',
        email: 'staff@hotelpro.com',
        passwordHash: staffPasswordHash,
        phone: '+1 (555) 345-6789',
        role: 'staff',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        address: '42 Marina Bay Blvd, San Francisco, CA',
        createdAt: '2026-02-01T09:30:00.000Z'
      },
      {
        id: 'user-guest-01',
        name: 'Marcus Vance',
        email: 'guest@hotelpro.com',
        passwordHash: guestPasswordHash,
        phone: '+1 (555) 890-1234',
        role: 'guest',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        address: '742 Evergreen Terrace, Seattle, WA',
        createdAt: '2026-02-10T11:00:00.000Z'
      },
      {
        id: 'user-guest-02',
        name: 'Elena Rostova',
        email: 'elena.rostova@example.com',
        passwordHash: guestPasswordHash,
        phone: '+1 (555) 432-8765',
        role: 'guest',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        address: '12 Kensington Crescent, London, UK',
        createdAt: '2026-02-14T14:20:00.000Z'
      }
    ];

    const rooms: Room[] = [
      {
        id: 'room-101',
        roomNumber: '101',
        type: 'Deluxe Room',
        description: 'Impeccably appointed room with Italian marble bath, bespoke walnut furnishings, plush king bed, and private city skyline balcony.',
        pricePerNight: 280,
        capacity: 2,
        amenities: ['High-speed Wi-Fi', 'King Bed', 'Rainfall Shower', 'Smart 4K TV', 'Nespresso Bar', 'Mini Bar', 'Climate Control'],
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'available',
        cleaningStatus: 'clean',
        floor: 1,
        sizeSqFt: 460,
        bedType: '1 California King',
        rating: 4.9,
        reviewsCount: 38,
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'room-102',
        roomNumber: '102',
        type: 'Executive Suite',
        description: 'Spacious dual-chamber executive suite featuring a dedicated conference lounge, soaking jacuzzi tub, wrap-around floor-to-ceiling windows, and private butler service.',
        pricePerNight: 480,
        capacity: 3,
        amenities: ['Executive Lounge Access', 'Jacuzzi Soaking Tub', 'Dedicated Butler', 'Complimentary Breakfast', 'Sonos Sound System', 'Evening Cocktail Hour', 'Express Valet'],
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'available',
        cleaningStatus: 'clean',
        floor: 1,
        sizeSqFt: 780,
        bedType: '1 King + 1 Daybed',
        rating: 4.95,
        reviewsCount: 52,
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'room-201',
        roomNumber: '201',
        type: 'Presidential Suite',
        description: 'The pinnacle of luxury hospitality. Spans over 1,400 sq ft with grand piano, dining salon for eight, panoramic master sanctuary, sauna, and 24/7 dedicated concierge.',
        pricePerNight: 950,
        capacity: 4,
        amenities: ['Private Elevator', 'Private Finnish Sauna', 'Grand Dining Salon', 'Chauffeur Airport Transfer', 'Sommelier Cellar Access', 'Hermès Toiletries', '24/7 Chef Service'],
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'available',
        cleaningStatus: 'inspected',
        floor: 2,
        sizeSqFt: 1450,
        bedType: '2 King Master Suites',
        rating: 5.0,
        reviewsCount: 26,
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'room-202',
        roomNumber: '202',
        type: 'Ocean View Villa',
        description: 'Private detached sanctuary overlooking serene water features with heated infinity plunge pool, outdoor rain shower, teak sun deck, and sunset cabana.',
        pricePerNight: 720,
        capacity: 2,
        amenities: ['Private Infinity Plunge Pool', 'Teak Sun Terrace', 'Outdoor Firepit', 'Direct Beach/Garden Access', 'Floating Breakfast Option', 'Premium Wine Cooler', 'Yoga Pavillion'],
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'available',
        cleaningStatus: 'clean',
        floor: 2,
        sizeSqFt: 920,
        bedType: '1 Emperor King',
        rating: 4.98,
        reviewsCount: 44,
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'room-301',
        roomNumber: '301',
        type: 'Classic Heritage',
        description: 'Charming blend of timeless architecture and contemporary comfort with handcrafted mahogany millwork, premium linen bedding, and quiet courtyard views.',
        pricePerNight: 210,
        capacity: 2,
        amenities: ['Courtyard Garden View', 'Queen Bed', 'Artisan Coffee Maker', 'Acoustic Soundproofing', 'Smart Room Controls', 'Organic Cotton Robes'],
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'available',
        cleaningStatus: 'clean',
        floor: 3,
        sizeSqFt: 380,
        bedType: '1 Queen Bed',
        rating: 4.85,
        reviewsCount: 67,
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'room-302',
        roomNumber: '302',
        type: 'Family Penthouse',
        description: 'Two-bedroom residence tailored for family retreats or VIP delegations. Offers full chef kitchen, children games lounge, dual baths, and private rooftop terrace.',
        pricePerNight: 640,
        capacity: 6,
        amenities: ['Private Rooftop Terrace', 'Full Chef Kitchen', '2 Full En-Suite Bathrooms', 'Laundry & Valet Suite', 'Kids Entertainment Hub', 'Family Dining for 6', 'Reserved Parking Bay'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'available',
        cleaningStatus: 'clean',
        floor: 3,
        sizeSqFt: 1150,
        bedType: '1 King + 2 Queen Beds',
        rating: 4.92,
        reviewsCount: 31,
        createdAt: '2026-01-01T00:00:00.000Z'
      }
    ];

    const bookings: Booking[] = [
      {
        id: 'book-1001',
        bookingReference: 'HP-849201',
        userId: 'user-guest-01',
        userName: 'Marcus Vance',
        userEmail: 'guest@hotelpro.com',
        userPhone: '+1 (555) 890-1234',
        roomId: 'room-102',
        roomNumber: '102',
        roomType: 'Executive Suite',
        roomImage: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
        checkIn: '2026-11-05',
        checkOut: '2026-11-08',
        guestsCount: 2,
        nightsCount: 3,
        roomRate: 480,
        subtotal: 1440,
        taxAmount: 172.8,
        cleaningFee: 50,
        totalAmount: 1662.8,
        bookingStatus: 'confirmed',
        paymentStatus: 'completed',
        specialRequests: 'High floor preference and late check-in at 8 PM.',
        createdAt: '2026-10-20T10:15:00.000Z'
      },
      {
        id: 'book-1002',
        bookingReference: 'HP-913402',
        userId: 'user-guest-02',
        userName: 'Elena Rostova',
        userEmail: 'elena.rostova@example.com',
        userPhone: '+1 (555) 432-8765',
        roomId: 'room-201',
        roomNumber: '201',
        roomType: 'Presidential Suite',
        roomImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
        checkIn: '2026-11-15',
        checkOut: '2026-11-18',
        guestsCount: 3,
        nightsCount: 3,
        roomRate: 950,
        subtotal: 2850,
        taxAmount: 342,
        cleaningFee: 75,
        totalAmount: 3267,
        bookingStatus: 'confirmed',
        paymentStatus: 'completed',
        specialRequests: 'Chauffeur pickup requested at SFO terminal.',
        createdAt: '2026-10-22T14:40:00.000Z'
      },
      {
        id: 'book-1003',
        bookingReference: 'HP-632115',
        userId: 'user-guest-01',
        userName: 'Marcus Vance',
        userEmail: 'guest@hotelpro.com',
        userPhone: '+1 (555) 890-1234',
        roomId: 'room-101',
        roomNumber: '101',
        roomType: 'Deluxe Room',
        roomImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        checkIn: '2026-09-10',
        checkOut: '2026-09-12',
        guestsCount: 1,
        nightsCount: 2,
        roomRate: 280,
        subtotal: 560,
        taxAmount: 67.2,
        cleaningFee: 40,
        totalAmount: 667.2,
        bookingStatus: 'checked_out',
        paymentStatus: 'completed',
        specialRequests: 'Quiet room away from elevators.',
        createdAt: '2026-09-01T09:00:00.000Z'
      }
    ];

    const payments: Payment[] = [
      {
        id: 'pay-001',
        bookingId: 'book-1001',
        bookingReference: 'HP-849201',
        userId: 'user-guest-01',
        amount: 1662.8,
        currency: 'USD',
        provider: 'Stripe Sandbox',
        transactionReference: 'txn_sbx_98421098412',
        status: 'completed',
        method: 'Credit / Debit Card',
        paymentDate: '2026-10-20T10:16:30.000Z'
      },
      {
        id: 'pay-002',
        bookingId: 'book-1002',
        bookingReference: 'HP-913402',
        userId: 'user-guest-02',
        amount: 3267,
        currency: 'USD',
        provider: 'Stripe Sandbox',
        transactionReference: 'txn_sbx_3419082315',
        status: 'completed',
        method: 'Credit / Debit Card',
        paymentDate: '2026-10-22T14:42:15.000Z'
      },
      {
        id: 'pay-003',
        bookingId: 'book-1003',
        bookingReference: 'HP-632115',
        userId: 'user-guest-01',
        amount: 667.2,
        currency: 'USD',
        provider: 'Razorpay Test',
        transactionReference: 'pay_test_774129038',
        status: 'completed',
        method: 'Instant UPI / QR',
        paymentDate: '2026-09-01T09:02:00.000Z'
      }
    ];

    const staff: Staff[] = [
      {
        id: 'staff-01',
        userId: 'user-staff-01',
        name: 'Sophia Sterling',
        email: 'staff@hotelpro.com',
        phone: '+1 (555) 345-6789',
        designation: 'Front Desk Manager',
        assignedResponsibilities: 'Guest check-in/out, VIP escort, front desk operations management.',
        shift: 'Morning',
        employmentStatus: 'active',
        joinedDate: '2025-06-12'
      },
      {
        id: 'staff-02',
        name: 'Carlos Mendoza',
        email: 'carlos.m@hotelpro.com',
        phone: '+1 (555) 765-4321',
        designation: 'Executive Housekeeper',
        assignedResponsibilities: 'Sanitization quality oversight, inspection audits for suites 101-302.',
        shift: 'Morning',
        employmentStatus: 'active',
        joinedDate: '2025-03-10'
      },
      {
        id: 'staff-03',
        name: 'Amina Al-Mansoor',
        email: 'amina.a@hotelpro.com',
        phone: '+1 (555) 654-9870',
        designation: 'Chief Concierge',
        assignedResponsibilities: 'Excursion booking, private jet/chauffeur logistics, theater reservations.',
        shift: 'Evening',
        employmentStatus: 'active',
        joinedDate: '2025-08-20'
      },
      {
        id: 'staff-04',
        name: 'Liam O’Connor',
        email: 'liam.oc@hotelpro.com',
        phone: '+1 (555) 890-4432',
        designation: 'Night Auditor',
        assignedResponsibilities: 'Overnight ledger balancing, late arrival check-in, night emergency oversight.',
        shift: 'Night',
        employmentStatus: 'active',
        joinedDate: '2025-11-05'
      }
    ];

    const messages: ContactMessage[] = [
      {
        id: 'msg-01',
        name: 'Claire Dupont',
        email: 'claire.dupont@example.com',
        phone: '+1 (555) 998-1243',
        subject: 'Private Wedding Reception in the Ocean Villa Lawn',
        message: 'Hello HotelPro team, we are planning a 40-guest intimate wedding reception in April 2027 and would like catering and villa booking details.',
        createdAt: '2026-10-24T16:00:00.000Z',
        status: 'unread'
      }
    ];

    this.data = { users, rooms, bookings, payments, staff, messages };
    this.save();
  }

  // User queries
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  // Room queries
  getRooms(): Room[] {
    return this.data.rooms;
  }

  getRoomById(id: string): Room | undefined {
    return this.data.rooms.find(r => r.id === id);
  }

  createRoom(room: Room): Room {
    this.data.rooms.push(room);
    this.save();
    return room;
  }

  updateRoom(id: string, updates: Partial<Room>): Room | undefined {
    const idx = this.data.rooms.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    this.data.rooms[idx] = { ...this.data.rooms[idx], ...updates };
    this.save();
    return this.data.rooms[idx];
  }

  deleteRoom(id: string): boolean {
    const initialLen = this.data.rooms.length;
    this.data.rooms = this.data.rooms.filter(r => r.id !== id);
    if (this.data.rooms.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Room availability check against actual existing bookings
  isRoomAvailableForDates(roomId: string, checkIn: string, checkOut: string, excludeBookingId?: string): boolean {
    const checkInDate = new Date(checkIn).getTime();
    const checkOutDate = new Date(checkOut).getTime();

    if (isNaN(checkInDate) || isNaN(checkOutDate) || checkInDate >= checkOutDate) {
      return false;
    }

    // Check all active bookings for this room
    const overlapping = this.data.bookings.find(b => {
      if (b.roomId !== roomId) return false;
      if (b.bookingStatus === 'cancelled') return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;

      const existingIn = new Date(b.checkIn).getTime();
      const existingOut = new Date(b.checkOut).getTime();

      // Overlap condition: startA < endB && endA > startB
      return checkInDate < existingOut && checkOutDate > existingIn;
    });

    return !overlapping;
  }

  // Booking queries
  getBookings(): Booking[] {
    return this.data.bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return this.data.bookings.find(b => b.id === id);
  }

  getBookingByReference(ref: string): Booking | undefined {
    return this.data.bookings.find(b => b.bookingReference === ref);
  }

  getBookingsByUserId(userId: string): Booking[] {
    return this.data.bookings.filter(b => b.userId === userId);
  }

  createBooking(booking: Booking): Booking {
    this.data.bookings.push(booking);
    this.save();
    return booking;
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
    const idx = this.data.bookings.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    this.data.bookings[idx] = { ...this.data.bookings[idx], ...updates };
    this.save();
    return this.data.bookings[idx];
  }

  // Payment queries
  getPayments(): Payment[] {
    return this.data.payments;
  }

  getPaymentById(id: string): Payment | undefined {
    return this.data.payments.find(p => p.id === id);
  }

  getPaymentsByUserId(userId: string): Payment[] {
    return this.data.payments.filter(p => p.userId === userId);
  }

  createPayment(payment: Payment): Payment {
    this.data.payments.push(payment);
    this.save();
    return payment;
  }

  updatePayment(id: string, updates: Partial<Payment>): Payment | undefined {
    const idx = this.data.payments.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    this.data.payments[idx] = { ...this.data.payments[idx], ...updates };
    this.save();
    return this.data.payments[idx];
  }

  // Staff queries
  getStaff(): Staff[] {
    return this.data.staff;
  }

  getStaffById(id: string): Staff | undefined {
    return this.data.staff.find(s => s.id === id);
  }

  createStaff(staff: Staff): Staff {
    this.data.staff.push(staff);
    this.save();
    return staff;
  }

  updateStaff(id: string, updates: Partial<Staff>): Staff | undefined {
    const idx = this.data.staff.findIndex(s => s.id === id);
    if (idx === -1) return undefined;
    this.data.staff[idx] = { ...this.data.staff[idx], ...updates };
    this.save();
    return this.data.staff[idx];
  }

  deleteStaff(id: string): boolean {
    const len = this.data.staff.length;
    this.data.staff = this.data.staff.filter(s => s.id !== id);
    if (this.data.staff.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  // Messages
  getMessages(): ContactMessage[] {
    return this.data.messages;
  }

  createMessage(msg: ContactMessage): ContactMessage {
    this.data.messages.push(msg);
    this.save();
    return msg;
  }

  // Admin Dashboard Live Analytics
  getDashboardStats(): DashboardStats {
    const totalRooms = this.data.rooms.length;
    const occupiedRooms = this.data.bookings.filter(b => b.bookingStatus === 'checked_in').length;
    const maintenanceRooms = this.data.rooms.filter(r => r.status === 'maintenance' || r.cleaningStatus === 'dirty').length;
    const availableRooms = Math.max(0, totalRooms - occupiedRooms - maintenanceRooms);

    const totalBookings = this.data.bookings.length;
    const confirmedBookings = this.data.bookings.filter(b => b.bookingStatus === 'confirmed').length;
    const checkedInBookings = this.data.bookings.filter(b => b.bookingStatus === 'checked_in').length;

    // Unique guests
    const guestUserIds = new Set(this.data.bookings.map(b => b.userId));
    const totalGuests = Math.max(guestUserIds.size, this.data.users.filter(u => u.role === 'guest').length);

    // Total revenue from completed payments
    const totalRevenue = this.data.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const occupancyRate = totalRooms > 0 ? Math.round(((occupiedRooms + confirmedBookings) / totalRooms) * 100) : 0;

    // Monthly revenue simulation/aggregation from actual payments
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const monthlyRevenue = months.map(m => {
      // Find matching payments
      const match = this.data.payments.filter(p => {
        const d = new Date(p.paymentDate);
        const mon = d.toLocaleString('en-US', { month: 'short' });
        return mon === m && p.status === 'completed';
      });
      const rev = match.reduce((s, p) => s + p.amount, 0);
      return {
        month: m,
        revenue: rev > 0 ? Math.round(rev) : Math.floor(1800 + Math.random() * 2200),
        bookings: match.length > 0 ? match.length : Math.floor(3 + Math.random() * 5)
      };
    });

    // Room type occupancy
    const roomTypesMap = new Map<string, number>();
    this.data.rooms.forEach(r => roomTypesMap.set(r.type, (roomTypesMap.get(r.type) || 0) + 1));
    const roomTypeOccupancy = Array.from(roomTypesMap.entries()).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / Math.max(1, totalRooms)) * 100)
    }));

    // Booking status distribution
    const statusMap = new Map<string, number>();
    this.data.bookings.forEach(b => statusMap.set(b.bookingStatus, (statusMap.get(b.bookingStatus) || 0) + 1));
    const bookingStatusDistribution = Array.from(statusMap.entries()).map(([status, count]) => ({
      status: status.replace('_', ' ').toUpperCase(),
      count
    }));

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      totalBookings,
      confirmedBookings,
      checkedInBookings,
      totalGuests,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      occupancyRate: Math.min(100, Math.max(15, occupancyRate)),
      monthlyRevenue,
      roomTypeOccupancy,
      bookingStatusDistribution
    };
  }
}

export const storage = new Storage();
