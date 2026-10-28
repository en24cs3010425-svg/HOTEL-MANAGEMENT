import React, { createContext, useContext, useState } from 'react';
import { Room, Booking, Payment } from '../types/index.ts';

interface BookingSearchState {
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  roomType: string;
}

interface PriceBreakdown {
  nightsCount: number;
  roomRate: number;
  subtotal: number;
  taxAmount: number;
  cleaningFee: number;
  totalAmount: number;
}

interface BookingContextType {
  searchState: BookingSearchState;
  setSearchState: React.Dispatch<React.SetStateAction<BookingSearchState>>;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  calculatePricing: (room: Room, checkIn?: string, checkOut?: string) => PriceBreakdown;
  lastConfirmedBooking: Booking | null;
  lastConfirmedPayment: Payment | null;
  setConfirmation: (booking: Booking | null, payment: Payment | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper to format date YYYY-MM-DD
function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchState, setSearchState] = useState<BookingSearchState>({
    checkIn: getFutureDate(1),
    checkOut: getFutureDate(4),
    guestsCount: 2,
    roomType: 'all'
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<Booking | null>(null);
  const [lastConfirmedPayment, setLastConfirmedPayment] = useState<Payment | null>(null);

  const calculatePricing = (room: Room, customCheckIn?: string, customCheckOut?: string): PriceBreakdown => {
    const inDateStr = customCheckIn || searchState.checkIn;
    const outDateStr = customCheckOut || searchState.checkOut;

    const inDate = new Date(inDateStr);
    const outDate = new Date(outDateStr);

    let nightsCount = 1;
    if (!isNaN(inDate.getTime()) && !isNaN(outDate.getTime()) && outDate > inDate) {
      const diffMs = outDate.getTime() - inDate.getTime();
      nightsCount = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    }

    const roomRate = room.pricePerNight;
    const subtotal = roomRate * nightsCount;
    const taxAmount = Math.round(subtotal * 0.12 * 100) / 100;
    const cleaningFee = room.pricePerNight > 500 ? 75 : 50;
    const totalAmount = Math.round((subtotal + taxAmount + cleaningFee) * 100) / 100;

    return {
      nightsCount,
      roomRate,
      subtotal,
      taxAmount,
      cleaningFee,
      totalAmount
    };
  };

  const setConfirmation = (booking: Booking | null, payment: Payment | null) => {
    setLastConfirmedBooking(booking);
    setLastConfirmedPayment(payment);
  };

  return (
    <BookingContext.Provider
      value={{
        searchState,
        setSearchState,
        selectedRoom,
        setSelectedRoom,
        calculatePricing,
        lastConfirmedBooking,
        lastConfirmedPayment,
        setConfirmation
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
