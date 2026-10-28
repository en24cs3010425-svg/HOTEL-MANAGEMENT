# HotelPro – Modern Luxury Hotel Management System (MERN)

HotelPro is an enterprise-grade luxury hotel management system built with the MERN stack (Node.js, Express.js, React.js, and JSON document store matching MongoDB/Mongoose ODM semantics). It streamlines luxury hospitality operations with real-time room inventory management, collision-free reservation booking, role-based authentication (Guest, Staff, Admin), guest CRM, front-desk check-in/out, and financial reporting.

---

## 🌟 Key Features

1. **Guest Experience & Booking Engine**
   - Live date search with zero-double-booking collision detection against active reservations.
   - Dynamic multi-night price calculation: nightly rate × nights + 12% occupancy tax + sanitization fee.
   - Sandbox payment gateway simulation (Stripe Sandbox, Razorpay Test QR, Desk settlement).
   - Instant booking confirmation with reference codes (`HP-XXXXXX`) and printable vouchers with touchless express check-in QR pass.
   - Guest portal to view reservations, profile settings, and flexible reservation cancellations with instant refund processing.

2. **Front Desk & Hotel Staff Console**
   - Real-time guest arrivals and departures tracking.
   - Express 1-click Check-In and Check-Out.
   - Housekeeping and room sanitization updates (`Clean`, `Dirty`, `Cleaning in Progress`, `Inspected & VIP Ready`).
   - Guest special requests and dietary concierge notes.

3. **Executive Admin Dashboard & Analytics**
   - Live KPI summary: Total Rooms, Available, Occupied, Total Bookings, Registered Guests, Gross Revenue, and Occupancy Rate %.
   - Monthly gross revenue trend bar chart.
   - Suite inventory distribution and booking status breakdowns.
   - Full Room Inventory CRUD (Create, Read, Update, Delete) with conflict checks.
   - Guest directory CRM with lifetime stay counts and spend metrics.
   - Staff shifts and responsibilities roster management.
   - Financial ledger with CSV export and sandbox refund processing.

4. **Security & Authentication**
   - Secure password hashing using `bcryptjs`.
   - JSON Web Token (JWT) session generation and bearer header verification.
   - Role-Based Access Control (`guest`, `staff`, `admin`) guards on frontend and backend.
   - 1-Click Demo Evaluation Switcher on navbar and login page.

---

## 👥 Demo Accounts for Testing

| Role | Name | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Alexander Wright | `admin@hotelpro.com` | `admin123` | Full dashboard, room CRUD, staff roster, revenue ledger, refunds |
| **Staff** | Sophia Sterling | `staff@hotelpro.com` | `staff123` | Front desk check-in/out, housekeeping status, stay notes |
| **Guest** | Marcus Vance | `guest@hotelpro.com` | `guest123` | Online booking, reservation history, profile, cancellations |

*(You can also use the **Test Quick Access** buttons at the top of the app to switch roles in one click without typing!)*

---

## 🛠️ Architecture & Folder Structure

```
├── backend/
│   ├── controllers/
│   │   ├── adminController.ts      # Analytics, guest CRM, financial reports, inquiries
│   │   ├── authController.ts       # Registration, login, JWT issuance, profile updates
│   │   ├── bookingController.ts    # Date collision check, pricing math, reservation CRUD
│   │   ├── paymentController.ts    # Sandbox gateway verification, ledger, refunds
│   │   ├── roomController.ts       # Inventory CRUD, housekeeping status updates
│   │   └── staffController.ts      # Staff roster, shift schedules, operations
│   ├── db/
│   │   └── storage.ts              # JSON document persistent storage & seed data
│   ├── middleware/
│   │   └── auth.ts                 # JWT verification and role-based guards
│   ├── routes/
│   │   └── api.ts                  # REST API routing
│   └── types/
│       └── index.ts                # TypeScript domain models
├── src/
│   ├── components/
│   │   ├── AvailabilitySearchForm.tsx
│   │   ├── ConfirmationModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── RoomCard.tsx
│   ├── context/
│   │   ├── AuthContext.tsx         # User authentication & role state
│   │   └── BookingContext.tsx      # Date search parameters & pricing math
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── BookingConfirmationPage.tsx
│   │   ├── BookingManagementPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── GuestManagementPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MyBookingsPage.tsx
│   │   ├── PaymentReportsPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── RoomDetailsPage.tsx
│   │   ├── RoomManagementPage.tsx
│   │   ├── RoomsPage.tsx
│   │   ├── SearchAvailabilityPage.tsx
│   │   ├── StaffManagementPage.tsx
│   │   └── UserProfilePage.tsx
│   ├── services/
│   │   └── api.ts                  # Typed client API requests
│   ├── App.tsx                     # Main client router
│   ├── index.css                   # Tailwind v4 & typography
│   └── main.tsx
├── data/
│   └── hotelpro_db.json            # Persistent database file
├── server.ts                       # Express server + Vite middlewares
├── package.json
└── README.md
```

---

## 🚀 Installation & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `PORT=3000` and `JWT_SECRET="hotelpro-super-secret-jwt-key-2026"`.

### 3. Start Development Server
```bash
npm run dev
```
The full-stack application will launch on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Create user account (`name`, `email`, `password`, `phone`, `role`)
- `POST /api/auth/login` — Login with credentials and receive JWT
- `GET /api/auth/me` — Retrieve current session profile
- `POST /api/auth/demo-login` — 1-click login for test evaluation (`role: 'admin' | 'staff' | 'guest'`)

### Accommodations & Rooms
- `GET /api/rooms` — Query rooms (supports `?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=2&type=Deluxe`)
- `GET /api/rooms/:id` — Get single room details with date availability
- `POST /api/rooms` — [Admin/Staff] Create new room listing
- `PUT /api/rooms/:id` — [Admin/Staff] Update room details
- `DELETE /api/rooms/:id` — [Admin] Delete room listing (checks for active stays)
- `PATCH /api/rooms/:id/cleaning` — [Staff/Admin] Update room cleaning state

### Reservations
- `GET /api/bookings` — [Auth] List reservations (filtered by user role)
- `GET /api/bookings/:id` — Get specific booking voucher details
- `POST /api/bookings` — Create reservation with date collision check and pricing calculation
- `PUT /api/bookings/:id/cancel` — [Auth] Cancel eligible booking and issue refund
- `PATCH /api/bookings/:id/status` — [Staff/Admin] Update stay to `checked_in`, `checked_out`

### Analytics & Administration
- `GET /api/admin/dashboard` — [Admin/Staff] Get live KPI metrics and revenue trends
- `GET /api/admin/users` — [Admin] List guest directory with spend metrics
- `GET /api/admin/reports` — [Admin] Financial yields by room tier
- `GET /api/admin/staff` — [Admin/Staff] List hotel staff roster
- `POST /api/admin/staff` — [Admin] Add staff member
- `PUT /api/admin/staff/:id` — [Admin] Update staff member details
- `DELETE /api/admin/staff/:id` — [Admin] Delete staff member

### Payments & Inquiries
- `POST /api/payments/create` — Initiate transaction intent
- `POST /api/payments/verify` — Sandbox gateway verification
- `GET /api/payments/history` — List transaction records
- `POST /api/payments/:id/refund` — [Admin] Process refund
- `POST /api/contact` — Submit guest inquiry
- `GET /api/contact` — [Admin/Staff] Review guest inquiries

---

## 🧪 Postman & API Testing Instructions

### 1. Test Demo Login
- **URL**: `POST /api/auth/demo-login`
- **Body (JSON)**:
  ```json
  { "role": "admin" }
  ```
- **Response**: Returns JWT token and sanitized admin profile.

### 2. Test Room Availability Check
- **URL**: `GET /api/rooms?checkIn=2026-11-05&checkOut=2026-11-08&guests=2`
- **Response**: List of rooms with `isAvailableForDates: true/false` verified against database bookings.

### 3. Test Room Reservation
- **URL**: `POST /api/bookings`
- **Headers**: `Authorization: Bearer <TOKEN>` (or guest fields)
- **Body (JSON)**:
  ```json
  {
    "roomId": "room-101",
    "checkIn": "2026-12-01",
    "checkOut": "2026-12-04",
    "guestsCount": 2,
    "guestName": "Jane Doe",
    "guestEmail": "jane.doe@example.com",
    "paymentMethod": "Credit / Debit Card",
    "specialRequests": "Ocean view high floor preferred"
  }
  ```
- **Response**: Returns unique reference `HP-XXXXXX`, calculated total amount with taxes, and confirmed payment record.
