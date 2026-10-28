import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { storage } from '../db/storage.ts';
import { generateToken, AuthenticatedRequest } from '../middleware/auth.ts';
import { User, UserRole } from '../types/index.ts';

function sanitizeUser(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existing = storage.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Only allow guest registration by default, or admin if explicitly flagged
    const userRole: UserRole = role === 'admin' || role === 'staff' ? role : 'guest';

    const newUser: User = {
      id: `user-${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      phone: phone || '',
      address: address || '',
      role: userRole,
      avatar: `https://images.unsplash.com/photo-${userRole === 'admin' ? '1534528741775-53994a69daeb' : '1535713875002-d1d0cf377fde'}?auto=format&fit=crop&w=200&q=80`,
      createdAt: new Date().toISOString()
    };

    storage.createUser(newUser);
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = storage.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Welcome back!',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
};

export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  const { role } = req.body;
  let targetEmail = 'guest@hotelpro.com';
  if (role === 'admin') targetEmail = 'admin@hotelpro.com';
  if (role === 'staff') targetEmail = 'staff@hotelpro.com';

  const user = storage.getUserByEmail(targetEmail);
  if (!user) {
    res.status(404).json({ success: false, message: `Demo account for ${role} not found.` });
    return;
  }

  const token = generateToken(user);
  res.json({
    success: true,
    message: `Logged in as demo ${role}`,
    token,
    user: sanitizeUser(user)
  });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { name, phone, address, avatar, currentPassword, newPassword } = req.body;
    const updates: Partial<User> = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address.trim();
    if (avatar) updates.avatar = avatar.trim();

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ success: false, message: 'Current password is required to set new password.' });
        return;
      }
      const match = await bcrypt.compare(currentPassword, req.user.passwordHash);
      if (!match) {
        res.status(400).json({ success: false, message: 'Current password does not match.' });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    const updated = storage.updateUser(req.user.id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitizeUser(updated)
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};
