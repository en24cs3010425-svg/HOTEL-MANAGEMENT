import React, { useState, useEffect } from 'react';
import { DashboardStats, Booking } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  BedDouble,
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  BarChart3
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, bookRes] = await Promise.all([
        api.admin.getDashboard(),
        api.bookings.getAll()
      ]);
      if (dashRes.stats) {
        setStats(dashRes.stats);
      }
      if (bookRes.bookings) {
        setRecentBookings(bookRes.bookings.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await api.bookings.updateStatus(bookingId, newStatus);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error updating stay status');
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-serif text-lg text-slate-800">Calculating live hotel operations metrics...</p>
        </div>
      </div>
    );
  }

  // Find max monthly revenue for SVG bar chart scaling
  const maxMonthly = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1000);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Banner */}
      <section className="bg-[#0a1424] text-white pt-14 pb-14 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Executive Command & Analytics
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
              Hotel Operations Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Live statistics computed directly from guest bookings, room inventory, and payment ledgers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('room-management')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              Manage Inventory
            </button>
            <button
              onClick={() => onNavigate('booking-management')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
            >
              Front Desk Stays
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Rooms */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <BedDouble className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Suites</div>
            <div className="font-serif text-2xl font-bold text-slate-900 mt-0.5">{stats.totalRooms}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">
              {stats.availableRooms} available today
            </div>
          </div>

          {/* Available Rooms */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Available</div>
            <div className="font-serif text-2xl font-bold text-slate-900 mt-0.5">{stats.availableRooms}</div>
            <div className="text-[10px] text-slate-500 mt-1">
              {stats.occupiedRooms} occupied / stay
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Reservations</div>
            <div className="font-serif text-2xl font-bold text-slate-900 mt-0.5">{stats.totalBookings}</div>
            <div className="text-[10px] text-slate-500 mt-1">
              {stats.confirmedBookings} confirmed
            </div>
          </div>

          {/* Active Guests */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Registered Guests</div>
            <div className="font-serif text-2xl font-bold text-slate-900 mt-0.5">{stats.totalGuests}</div>
            <div className="text-[10px] text-slate-500 mt-1">Loyalty members</div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue</div>
            <div className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">Verified sandbox</div>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Percent className="w-5 h-5" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Occupancy</div>
            <div className="font-serif text-2xl font-bold text-slate-900 mt-0.5">{stats.occupancyRate}%</div>
            <div className="text-[10px] text-slate-500 mt-1">Inventory efficiency</div>
          </div>
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly Revenue Trend Bar Chart (SVG) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  Monthly Gross Revenue Trends
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated from confirmed guest stay transactions over recent operational periods
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
                2026 Fiscal Year
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-64 w-full flex items-end justify-between gap-4 pt-6 pb-2 px-2">
              {stats.monthlyRevenue.map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.revenue / maxMonthly) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[11px] font-bold text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.revenue.toLocaleString()}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-all shadow-sm"
                    ></div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">{item.month}</div>
                    <div className="text-[10px] text-slate-400">{item.bookings} stays</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inventory Category Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  Suite Inventory Mix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proportion by accommodation tier
                </p>
              </div>

              <div className="space-y-4">
                {stats.roomTypeOccupancy.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span className="truncate pr-2">{item.type}</span>
                      <span className="font-bold text-slate-900">{item.count} units ({item.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${item.percentage}%` }}
                        className="h-full rounded-full bg-amber-500"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigate('room-management')}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors text-center"
              >
                Add or Configure Room Tiers
              </button>
            </div>
          </div>
        </div>

        {/* Live Stays & Front Desk Action Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Recent Guest Reservations & Front Desk Operations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Execute guest check-ins, departures, and review guest notes in real time.
              </p>
            </div>
            <button
              onClick={() => onNavigate('booking-management')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Reservations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Suite</th>
                  <th className="py-3 px-4">Stay Dates</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-800">{b.bookingReference}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{b.userName}</div>
                      <div className="text-[11px] text-slate-400">{b.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {b.roomType} (#{b.roomNumber})
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {b.checkIn} → {b.checkOut} ({b.nightsCount}n)
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">${b.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      {/* Zero-pill clean text representation */}
                      <span
                        className={`font-semibold ${
                          b.bookingStatus === 'confirmed'
                            ? 'text-emerald-700'
                            : b.bookingStatus === 'checked_in'
                            ? 'text-indigo-700'
                            : b.bookingStatus === 'checked_out'
                            ? 'text-slate-500'
                            : 'text-rose-700'
                        }`}
                      >
                        {b.bookingStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.bookingStatus === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'checked_in')}
                          className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        >
                          Check In
                        </button>
                      )}
                      {b.bookingStatus === 'checked_in' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'checked_out')}
                          className="px-2.5 py-1 text-[11px] font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                      {(b.bookingStatus === 'checked_out' || b.bookingStatus === 'cancelled') && (
                        <span className="text-[11px] text-slate-400 italic">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
