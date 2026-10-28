import React, { useState, useEffect } from 'react';
import { Room } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useBooking } from '../context/BookingContext.tsx';
import {
  Users,
  Bed,
  Maximize2,
  Layers,
  Star,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowLeft,
  Share2
} from 'lucide-react';

interface RoomDetailsPageProps {
  roomId?: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const RoomDetailsPage: React.FC<RoomDetailsPageProps> = ({ roomId, onNavigate }) => {
  const { selectedRoom, setSelectedRoom, searchState, setSearchState, calculatePricing } = useBooking();
  const [room, setRoom] = useState<Room | null>(selectedRoom);
  const [loading, setLoading] = useState(!selectedRoom);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [checkIn, setCheckIn] = useState(searchState.checkIn);
  const [checkOut, setCheckOut] = useState(searchState.checkOut);
  const [guestsCount, setGuestsCount] = useState(searchState.guestsCount);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const targetId = roomId || selectedRoom?.id;
    if (targetId) {
      setLoading(true);
      api.rooms
        .getById(targetId, { checkIn, checkOut })
        .then(res => {
          if (res.room) {
            setRoom(res.room);
            setSelectedRoom(res.room);
            setIsAvailable(res.room.isAvailableForDates ?? true);
          }
        })
        .catch(err => console.error('Error fetching room details:', err))
        .finally(() => setLoading(false));
    }
  }, [roomId]);

  const handleDateCheck = async (newIn: string, newOut: string) => {
    setCheckIn(newIn);
    setCheckOut(newOut);
    if (!room) return;

    setCheckingAvailability(true);
    try {
      const res = await api.rooms.getById(room.id, { checkIn: newIn, checkOut: newOut });
      setIsAvailable(res.room.isAvailableForDates ?? true);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleProceedBooking = () => {
    if (!room) return;
    setSearchState(prev => ({
      ...prev,
      checkIn,
      checkOut,
      guestsCount
    }));
    setSelectedRoom(room);
    onNavigate('booking');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-serif text-lg text-slate-800">Loading sanctuary details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center border border-slate-200 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-slate-900">Accommodation Not Found</h2>
          <p className="text-xs text-slate-600 mt-2">
            The requested suite may have been updated or removed from the active portfolio.
          </p>
          <button
            onClick={() => onNavigate('rooms')}
            className="mt-6 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase"
          >
            Return to Suites Collection
          </button>
        </div>
      </div>
    );
  }

  const pricing = calculatePricing(room, checkIn, checkOut);
  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-[#0a1424] text-white py-4 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate('rooms')}
            className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Suites</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Suite #{room.roomNumber}</span>
            <span>·</span>
            <span className="text-amber-400 font-semibold">{room.type}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>Suite #{room.roomNumber}</span>
              <span aria-hidden="true">·</span>
              <span>Floor {room.floor}</span>
              <span aria-hidden="true">·</span>
              <span>{room.sizeSqFt} sq ft</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                {room.rating} ({room.reviewsCount} verified reviews)
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              {room.type}
            </h1>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase font-medium text-slate-400">Nightly rate from</span>
            <span className="font-serif text-3xl font-bold text-slate-950">${room.pricePerNight}</span>
            <span className="text-xs text-slate-500">/ night</span>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-2xl overflow-hidden mb-12">
          {/* Main Hero Photo */}
          <div className="lg:col-span-2 relative aspect-[16/10] bg-slate-900">
            <img
              src={images[activeImageIdx]}
              alt={room.type}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails Column */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {images.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  activeImageIdx === idx ? 'border-amber-500 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left 2 Cols: Details & Amenities */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview Specs Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div>
                <Users className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
                <div className="text-[11px] text-slate-400 uppercase font-medium">Capacity</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Up to {room.capacity} Guests</div>
              </div>
              <div>
                <Bed className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
                <div className="text-[11px] text-slate-400 uppercase font-medium">Bedding</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{room.bedType}</div>
              </div>
              <div>
                <Maximize2 className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
                <div className="text-[11px] text-slate-400 uppercase font-medium">Dimensions</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{room.sizeSqFt} sq ft / {Math.round(room.sizeSqFt * 0.0929)} m²</div>
              </div>
              <div>
                <Layers className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
                <div className="text-[11px] text-slate-400 uppercase font-medium">Position</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Floor {room.floor} · Ocean Wing</div>
              </div>
            </div>

            {/* Architectural Overview */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                About This Accommodation
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {room.description}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4">
                Crafted by renowned architectural studio Moreau & Vance, every finish echoes California coastline tones. Floor-to-ceiling soundproof glass panes frame golden-hour ocean horizons, while the bedroom sanctuary features tailor-made Rivolta Carmignani Egyptian cotton linens, dual walk-in dressing salons, and automated blackout shades.
              </p>
            </div>

            {/* Signature Amenities */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Signature Suite Inclusions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm text-xs font-medium text-slate-800"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules & Policies */}
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60">
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Reservation Terms & Arrival Policies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Check-in:</strong> 3:00 PM <br />
                    <strong className="text-slate-900">Check-out:</strong> 12:00 PM (Noon)
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Cancellation:</strong> Free cancellation up to 48 hours prior to arrival.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Booking Calculator Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xl sticky top-28 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Reserve Your Stay</div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-serif text-3xl font-bold text-slate-950">${room.pricePerNight}</span>
                  <span className="text-xs text-slate-500">/ night</span>
                </div>
              </div>

              {/* Date pickers */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Check-In
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={checkIn}
                    onChange={e => handleDateCheck(e.target.value, checkOut)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    min={checkIn}
                    value={checkOut}
                    onChange={e => handleDateCheck(checkIn, e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Guests
                  </label>
                  <select
                    value={guestsCount}
                    onChange={e => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Availability Status */}
              <div className="pt-2">
                {checkingAvailability ? (
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <div className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    Verifying calendar dates...
                  </div>
                ) : isAvailable ? (
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Selected dates are available!</span>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                    Unavailable for these dates. Please choose alternate dates.
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>${room.pricePerNight} × {pricing.nightsCount} {pricing.nightsCount === 1 ? 'night' : 'nights'}</span>
                  <span>${pricing.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hotel Occupancy Tax (12%)</span>
                  <span>${pricing.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sanitization & Cleaning</span>
                  <span>${pricing.cleaningFee}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base text-amber-700">${pricing.totalAmount}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={!isAvailable || checkingAvailability}
                onClick={handleProceedBooking}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all ${
                  isAvailable
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/20 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Proceed to Reservation
              </button>

              <p className="text-[11px] text-center text-slate-400">
                No credit card charged until final confirmation step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
