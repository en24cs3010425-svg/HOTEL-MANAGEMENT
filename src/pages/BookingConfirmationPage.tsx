import React from 'react';
import { useBooking } from '../context/BookingContext.tsx';
import {
  CheckCircle,
  Calendar,
  Users,
  CreditCard,
  Printer,
  ArrowRight,
  ShieldCheck,
  Building2,
  QrCode
} from 'lucide-react';

interface BookingConfirmationPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({ onNavigate }) => {
  const { lastConfirmedBooking, lastConfirmedPayment } = useBooking();

  // If page was directly refreshed without booking state, fallback to demo booking
  const booking = lastConfirmedBooking || {
    id: 'book-sample',
    bookingReference: 'HP-849201',
    userName: 'Marcus Vance',
    userEmail: 'guest@hotelpro.com',
    userPhone: '+1 (555) 890-1234',
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
    createdAt: new Date().toISOString()
  };

  const payment = lastConfirmedPayment || {
    id: 'pay-sample',
    transactionReference: 'txn_sbx_98421098412',
    provider: 'Stripe Sandbox',
    method: 'Credit / Debit Card',
    amount: booking.totalAmount,
    status: 'completed'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Banner */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Reservation Confirmed & Secured
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            We Look Forward to Welcoming You
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            A confirmation voucher with check-in instructions has been dispatched to{' '}
            <strong className="text-slate-900">{booking.userEmail}</strong>.
          </p>
        </div>

        {/* Printable Voucher Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
          {/* Header Strip */}
          <div className="bg-[#0a1424] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white">HotelPro Resort & Spa</span>
                <p className="text-[11px] text-slate-400">Pebble Beach Oceanfront Enclave, CA</p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Booking Reference</div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white tracking-widest">
                {booking.bookingReference}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Stay Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Accommodations</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
                  {booking.roomType} (Suite #{booking.roomNumber})
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>{booking.guestsCount} Guests · {booking.nightsCount} Nights</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Arrival & Departure</span>
                <div className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{booking.checkIn} (3:00 PM) → {booking.checkOut} (12:00 PM)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  Status: <span className="text-emerald-700 font-bold uppercase">Confirmed & Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Guest & Payment details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Primary Guest
                </h4>
                <div className="text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{booking.userName}</p>
                  <p>{booking.userEmail}</p>
                  <p>{booking.userPhone}</p>
                  {booking.specialRequests && (
                    <p className="italic text-slate-500 text-[11px] mt-2">
                      “{booking.specialRequests}”
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Payment Verification
                </h4>
                <div className="text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Payment Completed (Paid in Full)</span>
                  </div>
                  <p>Method: {payment.method || 'Credit Card'}</p>
                  <p className="font-mono text-[11px] text-slate-500">Txn: {payment.transactionReference}</p>
                  <p className="font-bold text-slate-900 text-sm mt-1">Total Paid: ${booking.totalAmount}</p>
                </div>
              </div>
            </div>

            {/* Touchless Front Desk Express Check-in Barcode Simulation */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-900">
                  <QrCode className="w-10 h-10" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Express Check-In QR Pass</h5>
                  <p className="text-[11px] text-slate-500">
                    Present this voucher or code at our front desk kiosk for immediate digital key issuance.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Concierge Desk</span>
                <p className="text-xs font-semibold text-slate-900">Available 24/7</p>
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Reservation Voucher</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('my-bookings')}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
              >
                View in My Bookings
              </button>
              <button
                onClick={() => onNavigate('rooms')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
              >
                <span>Browse Suites</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
