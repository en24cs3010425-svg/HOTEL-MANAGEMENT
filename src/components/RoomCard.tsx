import React, { useState } from 'react';
import { Room } from '../types/index.ts';
import { Users, Bed, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
  onViewDetails: (room: Room) => void;
  showAvailabilityBadge?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onSelect,
  onViewDetails,
  showAvailabilityBadge = true
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const isAvailable = room.isAvailableForDates !== undefined
    ? room.isAvailableForDates
    : room.status === 'available';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image Gallery Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={images[activeImageIdx]}
          alt={room.type}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Carousel Nav Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Live Availability Flag (Zero-pill compliant clean flag) */}
        {showAvailabilityBadge && (
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-medium tracking-wide rounded-md text-white border border-white/10 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            <span>{isAvailable ? 'Available for Selected Dates' : 'Reserved / Unavailable'}</span>
          </div>
        )}

        {/* Room number tag */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-xs font-serif font-bold text-slate-900 rounded border border-slate-200">
          Suite {room.roomNumber}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line (No static pills!) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
            <span>{room.type}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Floor {room.floor}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{room.sizeSqFt} sq ft</span>
          </div>

          {/* Room Title */}
          <h3
            onClick={() => onViewDetails(room)}
            className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {room.type}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Key Specs Icons */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Max {room.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-amber-600" />
              <span>{room.bedType}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{room.rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">({room.reviewsCount})</span>
            </div>
          </div>

          {/* Amenities preview */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
            {room.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-slate-400">+{room.amenities.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Footer: Price & CTA Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Starting from</div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl font-bold text-slate-950">${room.pricePerNight}</span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(room)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors border border-slate-200 hover:border-slate-300 rounded-lg"
            >
              Details
            </button>
            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelect(room)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-sm ${
                isAvailable
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/10 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isAvailable ? 'Book Suite' : 'Reserved'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
