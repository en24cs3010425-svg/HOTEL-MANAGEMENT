import { Request, Response } from 'express';
import crypto from 'crypto';
import { storage } from '../db/storage.ts';
import { Room } from '../types/index.ts';

export const getAllRooms = (req: Request, res: Response): void => {
  try {
    const { checkIn, checkOut, guests, type, minPrice, maxPrice, status } = req.query;
    let rooms = storage.getRooms();

    // Filter by type
    if (type && type !== 'all') {
      rooms = rooms.filter(r => r.type.toLowerCase() === (type as string).toLowerCase());
    }

    // Filter by guest capacity
    if (guests) {
      const gCount = parseInt(guests as string, 10);
      if (!isNaN(gCount) && gCount > 0) {
        rooms = rooms.filter(r => r.capacity >= gCount);
      }
    }

    // Filter by price
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) rooms = rooms.filter(r => r.pricePerNight >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (!isNaN(max)) rooms = rooms.filter(r => r.pricePerNight <= max);
    }

    // Filter by general status if specified
    if (status && status !== 'all') {
      rooms = rooms.filter(r => r.status === status);
    }

    // Date availability check
    if (checkIn && checkOut) {
      const inStr = checkIn as string;
      const outStr = checkOut as string;
      rooms = rooms.map(room => {
        const isAvail = storage.isRoomAvailableForDates(room.id, inStr, outStr);
        return {
          ...room,
          isAvailableForDates: isAvail && room.status !== 'maintenance'
        };
      });
    }

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, message: 'Server error fetching rooms.' });
  }
};

export const getRoomById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const room = storage.getRoomById(id);
    if (!room) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }

    const { checkIn, checkOut } = req.query;
    let isAvailable = room.status === 'available';
    if (checkIn && checkOut) {
      isAvailable = storage.isRoomAvailableForDates(room.id, checkIn as string, checkOut as string) && room.status !== 'maintenance';
    }

    res.json({
      success: true,
      room: {
        ...room,
        isAvailableForDates: isAvailable
      }
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ success: false, message: 'Server error fetching room details.' });
  }
};

export const createRoom = (req: Request, res: Response): void => {
  try {
    const { roomNumber, type, description, pricePerNight, capacity, amenities, images, floor, sizeSqFt, bedType } = req.body;

    if (!roomNumber || !type || !pricePerNight || !capacity) {
      res.status(400).json({ success: false, message: 'Room number, type, price, and capacity are required.' });
      return;
    }

    // Check duplicate room number
    const existing = storage.getRooms().find(r => r.roomNumber === roomNumber.toString().trim());
    if (existing) {
      res.status(400).json({ success: false, message: `Room number ${roomNumber} already exists.` });
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ];

    const newRoom: Room = {
      id: `room-${crypto.randomUUID().slice(0, 8)}`,
      roomNumber: roomNumber.toString().trim(),
      type: type || 'Deluxe Room',
      description: description || 'Spacious luxury accommodation with handcrafted fittings and signature amenities.',
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      amenities: Array.isArray(amenities) && amenities.length > 0 ? amenities : ['High-speed Wi-Fi', 'Smart 4K TV', 'Rainfall Shower', 'King Bed'],
      images: Array.isArray(images) && images.length > 0 ? images : defaultImages,
      status: 'available',
      cleaningStatus: 'clean',
      floor: floor ? Number(floor) : 1,
      sizeSqFt: sizeSqFt ? Number(sizeSqFt) : 450,
      bedType: bedType || '1 King Bed',
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString()
    };

    storage.createRoom(newRoom);
    res.status(201).json({
      success: true,
      message: 'Room created successfully.',
      room: newRoom
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ success: false, message: 'Server error creating room.' });
  }
};

export const updateRoom = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const existing = storage.getRoomById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }

    const { roomNumber, type, description, pricePerNight, capacity, amenities, images, status, cleaningStatus, floor, sizeSqFt, bedType } = req.body;

    if (roomNumber && roomNumber !== existing.roomNumber) {
      const dup = storage.getRooms().find(r => r.roomNumber === roomNumber.toString().trim() && r.id !== id);
      if (dup) {
        res.status(400).json({ success: false, message: `Room number ${roomNumber} is already in use.` });
        return;
      }
    }

    const updates: Partial<Room> = {};
    if (roomNumber) updates.roomNumber = roomNumber.toString().trim();
    if (type) updates.type = type;
    if (description) updates.description = description;
    if (pricePerNight !== undefined) updates.pricePerNight = Number(pricePerNight);
    if (capacity !== undefined) updates.capacity = Number(capacity);
    if (amenities) updates.amenities = amenities;
    if (images) updates.images = images;
    if (status) updates.status = status;
    if (cleaningStatus) updates.cleaningStatus = cleaningStatus;
    if (floor !== undefined) updates.floor = Number(floor);
    if (sizeSqFt !== undefined) updates.sizeSqFt = Number(sizeSqFt);
    if (bedType) updates.bedType = bedType;

    const updated = storage.updateRoom(id, updates);
    res.json({
      success: true,
      message: 'Room updated successfully.',
      room: updated
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ success: false, message: 'Server error updating room.' });
  }
};

export const deleteRoom = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const room = storage.getRoomById(id);
    if (!room) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }

    // Check if there are active bookings
    const activeBookings = storage.getBookings().filter(b => b.roomId === id && (b.bookingStatus === 'confirmed' || b.bookingStatus === 'checked_in'));
    if (activeBookings.length > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete room ${room.roomNumber} because it currently has ${activeBookings.length} active reservation(s).`
      });
      return;
    }

    storage.deleteRoom(id);
    res.json({
      success: true,
      message: `Room ${room.roomNumber} deleted successfully.`
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ success: false, message: 'Server error deleting room.' });
  }
};

export const updateCleaningStatus = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { cleaningStatus } = req.body;

    if (!['clean', 'dirty', 'in_progress', 'inspected'].includes(cleaningStatus)) {
      res.status(400).json({ success: false, message: 'Invalid cleaning status.' });
      return;
    }

    const updated = storage.updateRoom(id, { cleaningStatus });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Room not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Room ${updated.roomNumber} cleaning status set to ${cleaningStatus}.`,
      room: updated
    });
  } catch (error) {
    console.error('Error updating cleaning status:', error);
    res.status(500).json({ success: false, message: 'Server error updating cleaning status.' });
  }
};
