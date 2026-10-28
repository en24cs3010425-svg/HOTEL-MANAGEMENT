import React, { useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Crown
} from 'lucide-react';

interface GuestWithStats extends User {
  bookingsCount: number;
  totalSpent: number;
  lastBookingDate: string | null;
}

export const GuestManagementPage: React.FC = () => {
  const [guests, setGuests] = useState<GuestWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getGuests();
      if (res.guests) {
        setGuests(res.guests);
      }
    } catch (err) {
      console.error('Error fetching guests:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = guests.filter(g => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      (g.phone && g.phone.toLowerCase().includes(q)) ||
      (g.address && g.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Banner */}
      <section className="bg-[#0a1424] text-white pt-14 pb-14 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              Guest Directory & CRM
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
              Guest Profiles & Loyalty Records
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Review traveler stay histories, cumulative expenditures, and hospitality preferences.
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
            Registered Travelers: <strong className="text-white">{guests.length}</strong>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="text-xs text-slate-500 font-medium">
            Displaying {filtered.length} hotel guests
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search guest by name, email, city..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
            />
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Guest</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Residence Location</th>
                  <th className="py-3.5 px-4">Total Reservations</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Loyalty Tier</th>
                  <th className="py-3.5 px-4 text-right">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(guest => {
                  const isPlatinum = guest.totalSpent >= 2500;
                  const isGold = guest.totalSpent >= 1000 && !isPlatinum;

                  return (
                    <tr key={guest.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              guest.avatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={guest.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{guest.name}</div>
                            <div className="text-[11px] text-slate-400">ID: {guest.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{guest.email}</span>
                        </div>
                        {guest.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{guest.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {guest.address ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{guest.address}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not specified</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        {guest.bookingsCount} {guest.bookingsCount === 1 ? 'Stay' : 'Stays'}
                      </td>
                      <td className="py-4 px-4 font-serif font-bold text-slate-900 text-sm">
                        ${guest.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        {/* Zero-pill clean text representation */}
                        {isPlatinum ? (
                          <span className="font-bold text-purple-700 flex items-center gap-1">
                            <Crown className="w-3.5 h-3.5 text-purple-600" /> Platinum Patron
                          </span>
                        ) : isGold ? (
                          <span className="font-bold text-amber-700 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-600" /> Gold VIP
                          </span>
                        ) : (
                          <span className="font-medium text-slate-600">Member Guest</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right text-slate-500 font-mono text-[11px]">
                        {new Date(guest.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
