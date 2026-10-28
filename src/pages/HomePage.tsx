import React, { useEffect, useState } from 'react';
import { Room } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useBooking } from '../context/BookingContext.tsx';
import { AvailabilitySearchForm } from '../components/AvailabilitySearchForm.tsx';
import { RoomCard } from '../components/RoomCard.tsx';
import {
  Sparkles,
  Utensils,
  Waves,
  HeartPulse,
  Car,
  BellRing,
  Wine,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  Quote
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedRoom, searchState } = useBooking();

  useEffect(() => {
    api.rooms
      .getAll({ checkIn: searchState.checkIn, checkOut: searchState.checkOut })
      .then(res => {
        if (res.rooms) {
          setFeaturedRooms(res.rooms.slice(0, 3));
        }
      })
      .catch(err => console.error('Error loading featured rooms:', err))
      .finally(() => setLoading(false));
  }, [searchState.checkIn, searchState.checkOut]);

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    onNavigate('booking');
  };

  const handleViewRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    onNavigate('room-details', { roomId: room.id });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Luxury Hotel Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
            alt="HotelPro Grand Resort Oceanfront"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081220] via-[#091526]/75 to-[#091526]/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>World Luxury Hotel Award 2026 Winner</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-[1.15]">
            Experience Comfort. <br />
            <span className="italic font-normal text-amber-300">Discover Luxury.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to HotelPro. An architectural masterpiece commanding private oceanfront bluffs. Where tailored concierge hospitality, Michelin-grade gastronomy, and bespoke suites converge into effortless living.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('availability')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Book Your Stay
            </button>
            <button
              onClick={() => onNavigate('rooms')}
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-widest border border-white/25 backdrop-blur-sm transition-all"
            >
              Explore Suites
            </button>
          </div>
        </div>

        {/* Floating Availability Search Form */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 max-w-5xl mx-auto px-4 sm:px-6">
          <AvailabilitySearchForm onSearch={() => onNavigate('availability')} />
        </div>
      </section>

      {/* Direct Booking Guarantee Strip */}
      <section className="bg-[#0b172a] text-slate-300 py-6 border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Best Rate Guarantee</p>
                <p className="text-[11px] text-slate-400">Direct booking price match + perks</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Flexible Cancellation</p>
                <p className="text-[11px] text-slate-400">Full refund up to 48h prior to arrival</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">VIP Welcome Amenity</p>
                <p className="text-[11px] text-slate-400">Chilled champagne & artisan truffles</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <BellRing className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">24/7 Dedicated Butler</p>
                <p className="text-[11px] text-slate-400">Personalized stay management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Suites Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Selected Sanctuaries</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              Featured Rooms & Suites
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">
              Each residence is individually architected with panoramic private terraces, Italian marble baths, and handcrafted bespoke furnishings.
            </p>
          </div>
          <button
            onClick={() => onNavigate('rooms')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider transition-colors"
          >
            <span>View All Accommodations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onSelect={handleBookRoom}
                onViewDetails={handleViewRoomDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Hotel Facilities & Experiences Grid */}
      <section className="py-20 bg-[#0d1a2d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Tailored Hospitality</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
              Unrivaled Resort Amenities
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              Immerse yourself in world-class wellness, culinary excellence, and discreet coastal leisure designed for the discerning traveler.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Dining */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-5">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Michelin-Caliber Dining</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Experience farm-to-table tasting journeys orchestrated by Master Chef Antoine Moreau overlooking sunset Pacific waves.
              </p>
            </div>

            {/* 2. Infinity Pool */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-5">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Oceanfront Infinity Pool</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Heated saline infinity pool suspended over coastal cliffs with private teak cabanas, chilled towels, and signature cocktail service.
              </p>
            </div>

            {/* 3. Spa */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-5">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Alpine & Thalasso Spa</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Holistic rejuvenation featuring Finnish wood saunas, eucalyptus steam chambers, and therapeutic mineral mud wraps.
              </p>
            </div>

            {/* 4. Chauffeur */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-5">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Chauffeur & Helipad Access</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seamless airport and scenic vineyard transportation with our private fleet of Maybach and Range Rover vehicles.
              </p>
            </div>

            {/* 5. Butler */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-5">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">24/7 Dedicated Butler</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                From luggage unpacking to personalized pillow menus and bespoke yacht charters, every desire is anticipated.
              </p>
            </div>

            {/* 6. Wine Cellar */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-5">
                <Wine className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Grand Vintage Cellar</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sommelier-guided tastings among 1,500 historic vintage bottles, paired with rare artisanal cheeses and charcuterie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Guest Reflections</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            Praised by Discerning Travelers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Read what guests have to say about their unforgettable moments at HotelPro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-amber-200 mb-2" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                “Staying at the Presidential Suite was pure magic. From the chauffeur waiting at the tarmac to the private sauna overlooking the ocean, HotelPro sets the gold standard for global luxury hospitality.”
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Marcus Vance"
                className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Marcus Vance</p>
                <p className="text-[11px] text-slate-500">Executive Stay · London, UK</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-amber-200 mb-2" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                “The Ocean View Villa was unbelievable. Waking up to private plunge pool swims and breakfast prepared by our personal chef was an experience my family will remember forever.”
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                alt="Elena Rostova"
                className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Elena Rostova</p>
                <p className="text-[11px] text-slate-500">Anniversary Retreat · Geneva, CH</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-amber-200 mb-2" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                “Check-in was seamless, the online reservation system provided clear date confirmation, and front desk concierge Sophia fulfilled every request within minutes.”
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="David Chen"
                className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">David Chen</p>
                <p className="text-[11px] text-slate-500">Business Summit Delegate · San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Callout / Booking CTA */}
      <section className="bg-gradient-to-r from-[#0b172a] via-[#10233d] to-[#0b172a] text-white py-16 border-t border-amber-900/30">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Reserve Your Sanctuary Today
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Begin your unforgettable stay. Exclusive web-direct privileges include complimentary daily breakfast for two and flexible 48-hour cancellation.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => onNavigate('availability')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-950/40 transition-all hover:scale-[1.02]"
            >
              Check Available Dates
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
