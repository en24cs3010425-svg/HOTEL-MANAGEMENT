import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Building2, Lock, Mail, AlertCircle, ShieldCheck, User, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onNavigate('home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'admin' | 'staff' | 'guest') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      if (role === 'admin') onNavigate('admin-dashboard');
      else if (role === 'staff') onNavigate('booking-management');
      else onNavigate('my-bookings');
    } catch (err: any) {
      setError(err.message || 'Error signing into demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-3 cursor-pointer group mb-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <span className="font-serif text-3xl font-bold tracking-tight text-slate-950">HotelPro</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-xs text-slate-600">
          Access your private reservations, concierge requests, or administrative console.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 space-y-6">
        {/* Quick Demo Access Bar */}
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-4 text-xs shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Instant Demo Accounts (One-Click Sign In)</span>
          </div>
          <p className="text-slate-600 text-[11px] mb-3">
            Click any account below to instantly test the platform with full privileges:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('guest')}
              className="px-2 py-2 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-slate-900 font-semibold text-[11px] transition-colors shadow-2xs"
            >
              Guest User
            </button>
            <button
              type="button"
              onClick={() => handleDemo('staff')}
              className="px-2 py-2 rounded-lg bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-900 font-semibold text-[11px] transition-colors shadow-2xs"
            >
              Hotel Staff
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="px-2 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors shadow-sm"
            >
              Administrator
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-xl">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. guest@hotelpro.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-amber-700 hover:text-amber-800 font-bold underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
