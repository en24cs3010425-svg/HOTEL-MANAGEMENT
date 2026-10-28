import React, { useState, useEffect } from 'react';
import { Room } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useBooking } from '../context/BookingContext.tsx';
import { AvailabilitySearchForm } from '../components/AvailabilitySearchForm.tsx';
import { RoomCard } from '../components/RoomCard.tsx';
import { CalendarCheck, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface SearchAvailabilityPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const SearchAvailabilityPage: React.FC<SearchAvailabilityPageProps> = ({ onNavigate }) => {
  const { searchState, setSelectedRoom } = useBooking();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, [searchState.checkIn, searchState.checkOut, searchState.guestsCount, searchState.roomType]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await api.rooms.getAll({
        checkIn: searchState.checkIn,
        checkOut: searchState.checkOut,
        guests: searchState.guestsCount,
        type: searchState.roomType !== 'all' ? searchState.roomType : undefined
      });
      if (res.rooms) {
        setRooms(res.rooms);
      }
    } catch (err) {
      console.error('Error checking availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (room: Room) => {
    setSelectedRoom(room);
    onNavigate('booking');
  };

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    onNavigate('room-details', { roomId: room.id });
  };

  const availableRooms = rooms.filter(r => r.isAvailableForDates);
  const unavailableRooms = rooms.filter(r => !r.isAvailableForDates);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="bg-[#0a1424] text-white pt-16 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              Real-Time Calendar Engine
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
              Check Suite Availability
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Select your arrival and departure dates below. Our real-time reservation system cross-references all verified guest stays to ensure immediate confirmation without overlaps.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Search Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <AvailabilitySearchForm onSearch={fetchAvailability} />

        {/* Results Section */}
        <div className="mt-12 space-y-12">
          {/* Available Suites */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Available Sanctuaries ({availableRooms.length})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ready for instant booking from {searchState.checkIn} to {searchState.checkOut}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : availableRooms.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-slate-900">All Selected Suites Reserved</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Every accommodation matching this capacity is booked for the requested dates. Please choose alternate dates to discover open inventory.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={handleSelect}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Currently Reserved / Unavailable Suites */}
          {unavailableRooms.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <div className="mb-6">
                <h3 className="font-serif text-xl font-bold text-slate-700">
                  Reserved for These Dates ({unavailableRooms.length})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The following accommodations have existing confirmed guest bookings during {searchState.checkIn} to {searchState.checkOut}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                {unavailableRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={handleSelect}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
