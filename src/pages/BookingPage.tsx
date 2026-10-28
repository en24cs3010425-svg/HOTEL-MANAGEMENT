import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useBooking } from '../context/BookingContext.tsx';
import { api } from '../services/api.ts';
import {
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  Calendar,
  Users,
  ShieldCheck,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface BookingPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const { selectedRoom, searchState, calculatePricing, setConfirmation } = useBooking();

  // Guest fields
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'Credit / Debit Card' | 'Instant UPI / QR' | 'Pay at Front Desk'>('Credit / Debit Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!selectedRoom) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-2xl p-8 max-w-md border border-slate-200 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-slate-900">No Accommodation Selected</h2>
          <p className="text-xs text-slate-600 mt-2">
            Please choose a luxury suite from our portfolio before proceeding to reservation checkout.
          </p>
          <button
            onClick={() => onNavigate('rooms')}
            className="mt-6 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase"
          >
            Browse Suites
          </button>
        </div>
      </div>
    );
  }

  const pricing = calculatePricing(selectedRoom);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!guestName || !guestEmail) {
      setErrorMessage('Please enter guest name and email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.bookings.create({
        roomId: selectedRoom.id,
        checkIn: searchState.checkIn,
        checkOut: searchState.checkOut,
        guestsCount: searchState.guestsCount,
        specialRequests,
        guestName,
        guestEmail,
        guestPhone,
        paymentMethod
      });

      if (res.success && res.booking) {
        setConfirmation(res.booking, res.payment);
        onNavigate('booking-confirmation');
      } else {
        setErrorMessage(res.message || 'Failed to complete reservation.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing reservation. Room may already be reserved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Header */}
      <div className="bg-[#0a1424] text-white py-6 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate('room-details', { roomId: selectedRoom.id })}
            className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Suite Details</span>
          </button>
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">
            Confirm Your Reservation
          </h1>
          <p className="text-xs text-slate-600 mb-8">
            Complete your guest information and select your preferred payment gateway method below.
          </p>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitBooking}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Guest & Payment Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* 1. Guest Details */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="font-serif text-lg font-bold text-slate-900">
                      1. Guest Contact Information
                    </h2>
                    {isAuthenticated ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        Signed in as {user?.role}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Booking as Valued Guest</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        placeholder="e.g. Lord Marcus Vance"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={e => setGuestEmail(e.target.value)}
                        placeholder="guest@example.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Contact Telephone
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={e => setGuestPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Special Requests / Concierge Inquiries
                      </label>
                      <textarea
                        rows={3}
                        value={specialRequests}
                        onChange={e => setSpecialRequests(e.target.value)}
                        placeholder="Dietary preferences, high floor preference, airport chauffeur transfer, champagne on arrival..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* 2. Payment Gateway Mode */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="font-serif text-lg font-bold text-slate-900">
                      2. Secure Payment Gateway (Sandbox Simulation)
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Integrated test sandbox. Verified server-side payment processing.
                    </p>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Credit / Debit Card')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === 'Credit / Debit Card'
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-amber-600 mb-1" />
                      <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                      <div className="text-[10px] text-slate-500">Stripe Sandbox</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Instant UPI / QR')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === 'Instant UPI / QR'
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-amber-600 mb-1" />
                      <div className="text-xs font-bold text-slate-900">UPI / QR Code</div>
                      <div className="text-[10px] text-slate-500">Razorpay Test</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Pay at Front Desk')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === 'Pay at Front Desk'
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <Building className="w-5 h-5 text-amber-600 mb-1" />
                      <div className="text-xs font-bold text-slate-900">Pay at Desk</div>
                      <div className="text-[10px] text-slate-500">Upon Arrival</div>
                    </button>
                  </div>

                  {/* Conditional inputs */}
                  {paymentMethod === 'Credit / Debit Card' && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                          Card Number (Sandbox Test)
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                            Expires
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                            Security CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Instant UPI / QR' && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-xs text-slate-700 font-medium">Instant Test QR Payment</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        A test transaction reference will be verified server-side on submission.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'Pay at Front Desk' && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      Payment will be collected by front desk concierge Sophia upon physical check-in. Your suite is reserved immediately.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Reservation Summary Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xl sticky top-28 space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Selection</span>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mt-1">
                      {selectedRoom.type}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Suite #{selectedRoom.roomNumber} · Floor {selectedRoom.floor}
                    </div>
                  </div>

                  {/* Image preview */}
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={selectedRoom.images[0]}
                      alt={selectedRoom.type}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Dates & guests */}
                  <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>{searchState.checkIn} to {searchState.checkOut}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span>{searchState.guestsCount} Guests · {pricing.nightsCount} Nights</span>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Room rate (${selectedRoom.pricePerNight} × {pricing.nightsCount}n)</span>
                      <span>${pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State & City Occupancy Tax (12%)</span>
                      <span>${pricing.taxAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sanitization & Cleaning</span>
                      <span>${pricing.cleaningFee}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                      <span>Total Amount Due</span>
                      <span className="font-serif text-base text-amber-700">${pricing.totalAmount}</span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming Reservation...' : 'Complete Reservation'}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant confirmation reference generated</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
