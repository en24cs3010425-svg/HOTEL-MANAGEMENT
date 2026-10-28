import React, { useState, useEffect } from 'react';
import { Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Ban,
  Clock,
  Eye,
  User,
  Phone,
  Mail,
  AlertCircle,
  X
} from 'lucide-react';

export const BookingManagementPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

  const handleUpdateStatus = async (bookingId: string, bookingStatus: string) => {
    setFeedback(null);
    try {
      const res = await api.bookings.updateStatus(bookingId, bookingStatus);
      if (res.success) {
        setFeedback({
          text: `Booking ${res.booking.bookingReference} status changed to ${bookingStatus}.`,
          type: 'success'
        });
        fetchBookings();
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking(res.booking);
        }
      }
    } catch (err: any) {
      setFeedback({ text: err.message || 'Error updating status', type: 'error' });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setFeedback(null);
    try {
      const res = await api.bookings.cancel(bookingId);
      if (res.success) {
        setFeedback({
          text: `Booking ${res.booking.bookingReference} has been cancelled & refunded.`,
          type: 'success'
        });
        fetchBookings();
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking(res.booking);
        }
      }
    } catch (err: any) {
      setFeedback({ text: err.message || 'Error cancelling reservation.', type: 'error' });
    }
  };

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.bookingReference.toLowerCase().includes(q) ||
      b.userName.toLowerCase().includes(q) ||
      b.userEmail.toLowerCase().includes(q) ||
      b.roomNumber.toLowerCase().includes(q) ||
      b.roomType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Banner */}
      <section className="bg-[#0a1424] text-white pt-14 pb-14 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              Front Desk & Reservation Console
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
              Guest Reservations & Arrivals
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Real-time guest check-in, room key issuance, stay tracking, and special concierge requests.
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
            Total active guest folios: <strong className="text-white">{bookings.length}</strong>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'all', label: 'All Stays' },
              { id: 'confirmed', label: 'Confirmed (Arriving)' },
              { id: 'checked_in', label: 'In-House (Checked In)' },
              { id: 'checked_out', label: 'Departed' },
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

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search guest, email, ref #, room..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Ref #</th>
                  <th className="py-3.5 px-4">Primary Guest</th>
                  <th className="py-3.5 px-4">Suite</th>
                  <th className="py-3.5 px-4">Dates & Nights</th>
                  <th className="py-3.5 px-4">Folio Amount</th>
                  <th className="py-3.5 px-4">Stay Status</th>
                  <th className="py-3.5 px-4 text-right">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-amber-800">
                      {b.bookingReference}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{b.userName}</div>
                      <div className="text-[11px] text-slate-400">{b.userEmail}</div>
                      {b.userPhone && (
                        <div className="text-[10px] text-slate-400">{b.userPhone}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">
                      <div>{b.roomType}</div>
                      <div className="text-[11px] text-slate-400">Suite #{b.roomNumber}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div className="font-medium text-slate-900">{b.checkIn} → {b.checkOut}</div>
                      <div className="text-[11px] text-slate-400">{b.nightsCount} Nights · {b.guestsCount} Guests</div>
                    </td>
                    <td className="py-4 px-4 font-serif font-bold text-slate-900 text-sm">
                      ${b.totalAmount}
                      <div className="text-[10px] text-slate-400 font-normal">Paid via {b.paymentStatus}</div>
                    </td>
                    <td className="py-4 px-4">
                      {/* Zero-pill clean text status */}
                      <span
                        className={`font-semibold ${
                          b.bookingStatus === 'confirmed'
                            ? 'text-emerald-700'
                            : b.bookingStatus === 'checked_in'
                            ? 'text-indigo-700'
                            : b.bookingStatus === 'checked_out'
                            ? 'text-slate-500'
                            : 'text-rose-700'
                        }`}
                      >
                        {b.bookingStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Guest Folio"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {b.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'checked_in')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                          >
                            Check In
                          </button>
                        )}

                        {b.bookingStatus === 'checked_in' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'checked_out')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                          >
                            Check Out
                          </button>
                        )}

                        {b.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="px-2 py-1 text-[11px] font-semibold rounded border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Guest Folio Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-5">
              <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wider">Guest Stay Folio</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
                Ref: {selectedBooking.bookingReference}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Suite:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.roomType} (Suite #{selectedBooking.roomNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dates:</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.checkIn} to {selectedBooking.checkOut} ({selectedBooking.nightsCount} nights)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guests:</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.guestsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billed:</span>
                  <span className="font-serif text-sm font-bold text-slate-900">${selectedBooking.totalAmount}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[10px] mb-1">Guest Details</h4>
                <p className="font-semibold text-slate-900">{selectedBooking.userName}</p>
                <p className="text-slate-500">{selectedBooking.userEmail} · {selectedBooking.userPhone}</p>
              </div>

              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-[10px] mb-1">Concierge Notes & Special Requests</h4>
                  <p className="italic text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    “{selectedBooking.specialRequests}”
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Current Status: <strong className="text-slate-900 uppercase">{selectedBooking.bookingStatus}</strong>
              </span>

              <div className="flex gap-2">
                {selectedBooking.bookingStatus === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'checked_in')}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Check In Guest
                  </button>
                )}
                {selectedBooking.bookingStatus === 'checked_in' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'checked_out')}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Check Out Guest
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
