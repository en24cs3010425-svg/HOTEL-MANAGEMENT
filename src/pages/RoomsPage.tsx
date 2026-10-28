import React, { useState, useEffect, useMemo } from 'react';
import { Room } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useBooking } from '../context/BookingContext.tsx';
import { RoomCard } from '../components/RoomCard.tsx';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  BedDouble,
  Users,
  DollarSign
} from 'lucide-react';

interface RoomsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ onNavigate }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedRoom, searchState, setSearchState } = useBooking();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchState.roomType || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minGuests, setMinGuests] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  useEffect(() => {
    fetchRooms();
  }, [searchState.checkIn, searchState.checkOut]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.rooms.getAll({
        checkIn: searchState.checkIn,
        checkOut: searchState.checkOut
      });
      if (res.rooms) {
        setRooms(res.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (room: Room) => {
    setSelectedRoom(room);
    onNavigate('booking');
  };

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    onNavigate('room-details', { roomId: room.id });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setMaxPrice(1000);
    setMinGuests(1);
    setSortBy('featured');
    setSearchState(prev => ({ ...prev, roomType: 'all' }));
  };

  // Filtered and sorted rooms
  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room => {
        // Search term
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchTitle = room.type.toLowerCase().includes(q);
          const matchDesc = room.description.toLowerCase().includes(q);
          const matchNum = room.roomNumber.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchNum) return false;
        }

        // Category
        if (selectedCategory !== 'all' && room.type.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Max price
        if (room.pricePerNight > maxPrice) {
          return false;
        }

        // Guest capacity
        if (room.capacity < minGuests) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
        if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [rooms, searchTerm, selectedCategory, maxPrice, minGuests, sortBy]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Page Header Banner */}
      <section className="bg-[#0a1424] text-white pt-16 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Accommodations Portfolio
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
              Rooms, Suites & Villas
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Explore bespoke residential sanctuaries designed for peaceful privacy. Discover sweeping Pacific views, custom marble bathrooms, and dedicated butler care.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-28 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-serif text-base font-bold text-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>Refine Stay</span>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Keywords
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search villa, suite, plunge pool..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Category Segmented Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Suite Category
                </label>
                <div className="space-y-1">
                  {[
                    { label: 'All Accommodations', value: 'all' },
                    { label: 'Deluxe Room', value: 'Deluxe Room' },
                    { label: 'Executive Suite', value: 'Executive Suite' },
                    { label: 'Presidential Suite', value: 'Presidential Suite' },
                    { label: 'Ocean View Villa', value: 'Ocean View Villa' },
                    { label: 'Classic Heritage', value: 'Classic Heritage' },
                    { label: 'Family Penthouse', value: 'Family Penthouse' }
                  ].map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat.value
                          ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.value && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Nightly Rate Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <span>Max Rate</span>
                  <span className="font-serif text-amber-700 text-sm font-bold">${maxPrice} / night</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="50"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$200</span>
                  <span>$1,200+</span>
                </div>
              </div>

              {/* Guests Capacity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Minimum Capacity
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 4, 6].map(count => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setMinGuests(count)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        minGuests === count
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {count}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Room Listings */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">
                  Showing <strong className="text-slate-900">{filteredRooms.length}</strong> luxurious accommodations
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Dates: {searchState.checkIn} to {searchState.checkOut}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Room Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <BedDouble className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">No Accommodations Found</h3>
                <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
                  No rooms match your specific filter criteria or guest capacity for the selected dates. Try adjusting the price slider or resetting filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={handleBook}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
