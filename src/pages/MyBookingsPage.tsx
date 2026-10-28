import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useBooking } from '../context/BookingContext.tsx';
import { Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import {
  Calendar,
  Users,
  CreditCard,
  Ban,
  Receipt,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  BedDouble,
  Search
} from 'lucide-react';

interface MyBookingsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const { setConfirmation } = useBooking();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelingBooking, setCancelingBooking] = useState<Booking | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.bookings.getAll({
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      if (res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelingBooking) return;
    try {
      const res = await api.bookings.cancel(cancelingBooking.id);
      if (res.success) {
        setActionMessage({
          text: `Reservation ${cancelingBooking.bookingReference} has been cancelled and refund processed.`,
          type: 'success'
        });
        fetchBookings();
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Failed to cancel reservation.', type: 'error' });
    } finally {
      setCancelingBooking(null);
    }
  };

  const handleViewVoucher = (booking: Booking) => {
    setConfirmation(booking, null);
    onNavigate('booking-confirmation');
  };

  const filteredBookings = bookings.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingReference.toLowerCase().includes(q) ||
      b.roomNumber.toLowerCase().includes(q) ||
      b.roomType.toLowerCase().includes(q) ||
      b.userName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Banner */}
      <section className="bg-[#0a1424] text-white pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Guest Portal
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
              My Reservations & Stays
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Review current, upcoming, and past stays. Access digital receipts and cancellation requests.
            </p>
          </div>

          <button
            onClick={() => onNavigate('rooms')}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto"
          >
            Reserve New Suite
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Flash Message */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center justify-between border ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'all', label: 'All Stays' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'checked_in', label: 'Checked In' },
              { id: 'checked_out', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Query */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reference #, room..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-44 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <BedDouble className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-slate-900">No Reservations Found</h3>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
              You do not have any bookings matching this status. Explore our accommodations portfolio to book your next bespoke getaway.
            </p>
            <button
              onClick={() => onNavigate('rooms')}
              className="mt-6 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Browse Rooms & Suites
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map(b => {
              const isEligibleForCancel = b.bookingStatus === 'confirmed';

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* Room Thumbnail */}
                    <img
                      src={b.roomImage || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80'}
                      alt={b.roomType}
                      className="w-full sm:w-36 h-28 object-cover rounded-xl border border-slate-200 shrink-0"
                    />

                    {/* Booking Details */}
                    <div>
                      {/* Zero-pill metadata line */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                        <span className="font-mono font-bold text-amber-700">{b.bookingReference}</span>
                        <span aria-hidden="true">·</span>
                        <span>Suite #{b.roomNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{b.nightsCount} {b.nightsCount === 1 ? 'Night' : 'Nights'}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-slate-900">
                        {b.roomType}
                      </h3>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-2">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          {b.checkIn} → {b.checkOut}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {b.guestsCount} Guests
                        </span>
                      </div>

                      {/* Status indicator (Zero-pill text styling) */}
                      <div className="mt-2 text-xs flex items-center gap-3">
                        <span className="font-semibold text-slate-700">
                          Status:{' '}
                          <span
                            className={
                              b.bookingStatus === 'confirmed'
                                ? 'text-emerald-700'
                                : b.bookingStatus === 'checked_in'
                                ? 'text-indigo-700'
                                : b.bookingStatus === 'checked_out'
                                ? 'text-slate-600'
                                : 'text-rose-700'
                            }
                          >
                            {b.bookingStatus.replace('_', ' ').toUpperCase()}
                          </span>
                        </span>
                        <span>·</span>
                        <span className="text-slate-500 font-medium">
                          Payment:{' '}
                          <span
                            className={
                              b.paymentStatus === 'completed'
                                ? 'text-emerald-700'
                                : b.paymentStatus === 'refunded'
                                ? 'text-amber-700'
                                : 'text-slate-600'
                            }
                          >
                            {b.paymentStatus.toUpperCase()}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="flex flex-col sm:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3 shrink-0">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</div>
                      <div className="font-serif text-2xl font-bold text-slate-950">${b.totalAmount}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewVoucher(b)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Voucher</span>
                      </button>

                      {isEligibleForCancel && (
                        <button
                          type="button"
                          onClick={() => setCancelingBooking(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Stay</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Cancellation */}
      <ConfirmationModal
        isOpen={!!cancelingBooking}
        title="Cancel This Reservation?"
        message={`Are you sure you wish to cancel reservation ${cancelingBooking?.bookingReference} for ${cancelingBooking?.roomType}? As per our flexible cancellation policy, your full payment of $${cancelingBooking?.totalAmount} will be refunded.`}
        confirmLabel="Yes, Cancel & Refund"
        cancelLabel="Keep Reservation"
        isDestructive={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelingBooking(null)}
      />
    </div>
  );
};
