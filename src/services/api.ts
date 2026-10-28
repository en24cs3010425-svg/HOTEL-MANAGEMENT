import { Room, Booking, Payment, Staff, User, DashboardStats, FinancialReports, ContactMessage } from '../types/index.ts';

const TOKEN_KEY = 'hotelpro_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),

    register: (userData: { name: string; email: string; password: string; phone?: string; address?: string; role?: string }) =>
      request<{ success: boolean; token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    me: () =>
      request<{ success: boolean; user: User }>('/api/auth/me'),

    demoLogin: (role: 'admin' | 'staff' | 'guest') =>
      request<{ success: boolean; token: string; user: User }>('/api/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ role })
      }),

    updateProfile: (profile: Partial<User> & { currentPassword?: string; newPassword?: string }) =>
      request<{ success: boolean; message: string; user: User }>('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      })
  },

  // Rooms
  rooms: {
    getAll: (params?: { checkIn?: string; checkOut?: string; guests?: number; type?: string; minPrice?: number; maxPrice?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            query.append(key, String(val));
          }
        });
      }
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; rooms: Room[] }>(`/api/rooms${qs}`);
    },

    getById: (id: string, dates?: { checkIn?: string; checkOut?: string }) => {
      const qs = dates?.checkIn && dates?.checkOut ? `?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}` : '';
      return request<{ success: boolean; room: Room }>(`/api/rooms/${id}${qs}`);
    },

    create: (roomData: Partial<Room>) =>
      request<{ success: boolean; message: string; room: Room }>('/api/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData)
      }),

    update: (id: string, roomData: Partial<Room>) =>
      request<{ success: boolean; message: string; room: Room }>(`/api/rooms/${id}`, {
        method: 'PUT',
        body: JSON.stringify(roomData)
      }),

    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/rooms/${id}`, {
        method: 'DELETE'
      }),

    updateCleaning: (id: string, cleaningStatus: string) =>
      request<{ success: boolean; message: string; room: Room }>(`/api/rooms/${id}/cleaning`, {
        method: 'PATCH',
        body: JSON.stringify({ cleaningStatus })
      })
  },

  // Bookings
  bookings: {
    getAll: (params?: { status?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.search) query.append('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; bookings: Booking[] }>(`/api/bookings${qs}`);
    },

    getById: (id: string) =>
      request<{ success: boolean; booking: Booking; room?: Room; payment?: Payment }>(`/api/bookings/${id}`),

    create: (bookingData: {
      roomId: string;
      checkIn: string;
      checkOut: string;
      guestsCount: number;
      specialRequests?: string;
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      paymentMethod?: string;
    }) =>
      request<{ success: boolean; message: string; booking: Booking; payment: Payment }>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      }),

    cancel: (id: string) =>
      request<{ success: boolean; message: string; booking: Booking }>(`/api/bookings/${id}/cancel`, {
        method: 'PUT'
      }),

    updateStatus: (id: string, bookingStatus: string) =>
      request<{ success: boolean; message: string; booking: Booking }>(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ bookingStatus })
      })
  },

  // Payments
  payments: {
    create: (data: { bookingId: string; amount: number; provider?: string; method?: string }) =>
      request<{ success: boolean; message: string; payment: Payment }>('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    verify: (transactionReference: string, providerResult?: string) =>
      request<{ success: boolean; message: string; payment: Payment }>('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({ transactionReference, providerResult })
      }),

    getHistory: () =>
      request<{ success: boolean; count: number; payments: Payment[] }>('/api/payments/history'),

    refund: (id: string) =>
      request<{ success: boolean; message: string; payment: Payment }>(`/api/payments/${id}/refund`, {
        method: 'POST'
      })
  },

  // Admin & Staff Operations
  admin: {
    getDashboard: () =>
      request<{ success: boolean; stats: DashboardStats }>('/api/admin/dashboard'),

    getGuests: () =>
      request<{ success: boolean; count: number; guests: (User & { bookingsCount: number; totalSpent: number; lastBookingDate: string | null })[] }>('/api/admin/users'),

    getReports: () =>
      request<{ success: boolean; reports: FinancialReports }>('/api/admin/reports'),

    getStaff: () =>
      request<{ success: boolean; count: number; staff: Staff[] }>('/api/admin/staff'),

    createStaff: (data: Partial<Staff>) =>
      request<{ success: boolean; message: string; staff: Staff }>('/api/admin/staff', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    updateStaff: (id: string, data: Partial<Staff>) =>
      request<{ success: boolean; message: string; staff: Staff }>(`/api/admin/staff/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    deleteStaff: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/admin/staff/${id}`, {
        method: 'DELETE'
      })
  },

  // Contact & Inquiries
  contact: {
    sendMessage: (data: { name: string; email: string; phone?: string; subject: string; message: string }) =>
      request<{ success: boolean; message: string; contactMessage: ContactMessage }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    getMessages: () =>
      request<{ success: boolean; count: number; messages: ContactMessage[] }>('/api/contact')
  }
};
