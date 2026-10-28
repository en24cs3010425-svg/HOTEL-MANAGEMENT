import React from 'react';
import { useBooking } from '../context/BookingContext.tsx';
import { Calendar, Users, Home, Search } from 'lucide-react';

interface AvailabilitySearchFormProps {
  onSearch?: () => void;
  compact?: boolean;
}

export const AvailabilitySearchForm: React.FC<AvailabilitySearchFormProps> = ({ onSearch, compact = false }) => {
  const { searchState, setSearchState } = useBooking();

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (val: string) => {
    setSearchState(prev => {
      let nextOut = prev.checkOut;
      if (new Date(val) >= new Date(prev.checkOut)) {
        const nextDay = new Date(val);
        nextDay.setDate(nextDay.getDate() + 1);
        nextOut = nextDay.toISOString().split('T')[0];
      }
      return { ...prev, checkIn: val, checkOut: nextOut };
    });
  };

  const handleCheckOutChange = (val: string) => {
    setSearchState(prev => ({ ...prev, checkOut: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-amber-900/10 text-slate-900 ${
        compact ? 'p-4' : 'p-6 lg:p-7'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Check In Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Check-In Date
          </label>
          <input
            type="date"
            min={todayStr}
            value={searchState.checkIn}
            onChange={e => handleCheckInChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
            required
          />
        </div>

        {/* Check Out Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Check-Out Date
          </label>
          <input
            type="date"
            min={searchState.checkIn || todayStr}
            value={searchState.checkOut}
            onChange={e => handleCheckOutChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
            required
          />
        </div>

        {/* Guests Count & Room Type */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Guests
            </label>
            <select
              value={searchState.guestsCount}
              onChange={e => setSearchState(prev => ({ ...prev, guestsCount: Number(e.target.value) }))}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-600" />
              Category
            </label>
            <select
              value={searchState.roomType}
              onChange={e => setSearchState(prev => ({ ...prev, roomType: e.target.value }))}
              className="w-full px-2 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium truncate"
            >
              <option value="all">All Suites</option>
              <option value="Deluxe Room">Deluxe</option>
              <option value="Executive Suite">Executive</option>
              <option value="Presidential Suite">Presidential</option>
              <option value="Ocean View Villa">Ocean Villa</option>
              <option value="Classic Heritage">Heritage</option>
              <option value="Family Penthouse">Penthouse</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            Check Availability
          </button>
        </div>
      </div>
    </form>
  );
};
