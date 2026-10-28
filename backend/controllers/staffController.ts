import { Request, Response } from 'express';
import crypto from 'crypto';
import { storage } from '../db/storage.ts';
import { Staff } from '../types/index.ts';

export const getAllStaff = (_req: Request, res: Response): void => {
  try {
    const staff = storage.getStaff();
    res.json({
      success: true,
      count: staff.length,
      staff
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ success: false, message: 'Server error fetching staff members.' });
  }
};

export const createStaff = (req: Request, res: Response): void => {
  try {
    const { name, email, phone, designation, assignedResponsibilities, shift } = req.body;

    if (!name || !email || !designation) {
      res.status(400).json({ success: false, message: 'Name, email, and designation are required.' });
      return;
    }

    const newStaff: Staff = {
      id: `staff-${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      designation: designation || 'Front Desk Manager',
      assignedResponsibilities: assignedResponsibilities || 'Guest check-in, customer support, and lobby concierge.',
      shift: shift || 'Morning',
      employmentStatus: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    storage.createStaff(newStaff);

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully.',
      staff: newStaff
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ success: false, message: 'Server error adding staff member.' });
  }
};

export const updateStaff = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, email, phone, designation, assignedResponsibilities, shift, employmentStatus } = req.body;

    const existing = storage.getStaffById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Staff member not found.' });
      return;
    }

    const updates: Partial<Staff> = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (phone !== undefined) updates.phone = phone.trim();
    if (designation) updates.designation = designation;
    if (assignedResponsibilities) updates.assignedResponsibilities = assignedResponsibilities;
    if (shift) updates.shift = shift;
    if (employmentStatus) updates.employmentStatus = employmentStatus;

    const updated = storage.updateStaff(id, updates);

    res.json({
      success: true,
      message: 'Staff profile updated.',
      staff: updated
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ success: false, message: 'Server error updating staff profile.' });
  }
};

export const deleteStaff = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteStaff(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Staff member not found.' });
      return;
    }
    res.json({
      success: true,
      message: 'Staff member removed successfully.'
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ success: false, message: 'Server error removing staff member.' });
  }
};
