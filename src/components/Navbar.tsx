import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Building2,
  CalendarCheck,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Briefcase,
  Menu,
  X,
  Compass,
  BedDouble,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, role, isAuthenticated, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleNav = (page: string, params?: Record<string, string>) => {
    onNavigate(page, params);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a1424]/95 backdrop-blur-md border-b border-amber-900/30 text-white">
      {/* Top Demo Utility Bar for Quick Evaluator Role Switching */}
      <div className="bg-[#060c17] px-4 py-1.5 border-b border-amber-950/40 text-xs flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">Test Quick Access:</span>
          <span className="text-slate-400 hidden sm:inline">Switch roles instantly:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => demoLogin('guest')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                role === 'guest' && isAuthenticated
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Guest (Marcus)
            </button>
            <button
              onClick={() => demoLogin('staff')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                role === 'staff'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Staff (Sophia)
            </button>
            <button
              onClick={() => demoLogin('admin')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                role === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Admin (Alexander)
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
          <span>Direct Concierge: +1 (800) 555-LUXE</span>
          <span>·</span>
          <span>Beverly Hills & Coastline Sanctuary</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                HotelPro
              </span>
              <span className="text-[10px] tracking-widest text-amber-400 uppercase font-semibold">Resort & Spa</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-light">Bespoke Hospitality</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => handleNav('home')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'home' ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('rooms')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'rooms' ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Rooms & Suites
          </button>
          <button
            onClick={() => handleNav('availability')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'availability' ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Check Availability
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'about' ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleNav('contact')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'contact' ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right CTA & Profile Area */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-amber-500/50 transition-colors text-left"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
                />
                <div className="text-xs">
                  <div className="font-medium text-white flex items-center gap-1.5">
                    <span>{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0c182b] border border-amber-900/40 shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-4 py-2 border-b border-slate-800 text-xs">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-slate-400 text-[11px]">{user.email}</p>
                  </div>

                  {user.role === 'admin' && (
                    <>
                      <button
                        onClick={() => handleNav('admin-dashboard')}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2 text-amber-300"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Admin Dashboard
                      </button>
                      <button
                        onClick={() => handleNav('room-management')}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2"
                      >
                        <BedDouble className="w-4 h-4 text-slate-400" />
                        Room Inventory CRUD
                      </button>
                      <button
                        onClick={() => handleNav('booking-management')}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2"
                      >
                        <CalendarCheck className="w-4 h-4 text-slate-400" />
                        Reservations & Stays
                      </button>
                      <button
                        onClick={() => handleNav('guest-management')}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Guest Management
                      </button>
                      <button
                        onClick={() => handleNav('staff-management')}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2"
                      >
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        Staff & Shifts
                      </button>
                      <button
                        onClick={() => handleNav('payment-reports')}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2"
                      >
                        <Compass className="w-4 h-4 text-slate-400" />
                        Financial Reports & Ledger
                      </button>
                      <div className="border-t border-slate-800 my-1"></div>
                    </>
                  )}

                  {user.role === 'staff' && (
                    <>
                      <button
                        onClick={() => handleNav('booking-management')}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2 text-indigo-300"
                      >
                        <CalendarCheck className="w-4 h-4 text-indigo-400" />
                        Front Desk & Check-Ins
                      </button>
                      <button
                        onClick={() => handleNav('room-management')}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2"
                      >
                        <BedDouble className="w-4 h-4 text-slate-400" />
                        Housekeeping & Room Status
                      </button>
                      <div className="border-t border-slate-800 my-1"></div>
                    </>
                  )}

                  <button
                    onClick={() => handleNav('my-bookings')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2"
                  >
                    <CalendarCheck className="w-4 h-4 text-slate-400" />
                    My Reservations
                  </button>
                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800/80 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Guest Profile
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      handleNav('home');
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNav('login')}
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors border border-slate-700 rounded-lg hover:border-slate-500"
              >
                Register
              </button>
            </div>
          )}

          {/* Book Now Button */}
          <button
            onClick={() => handleNav('rooms')}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wider uppercase shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Book Your Stay
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => handleNav('rooms')}
            className="px-3 py-1.5 rounded-md bg-amber-500 text-slate-950 font-semibold text-xs uppercase"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c182b] border-b border-amber-900/30 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNav('home')}
              className="text-left py-2 text-sm text-slate-200 border-b border-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('rooms')}
              className="text-left py-2 text-sm text-slate-200 border-b border-slate-800"
            >
              Rooms & Suites
            </button>
            <button
              onClick={() => handleNav('availability')}
              className="text-left py-2 text-sm text-slate-200 border-b border-slate-800"
            >
              Check Availability
            </button>
            <button
              onClick={() => handleNav('about')}
              className="text-left py-2 text-sm text-slate-200 border-b border-slate-800"
            >
              About Us
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="text-left py-2 text-sm text-slate-200 border-b border-slate-800"
            >
              Contact Us
            </button>

            {isAuthenticated && user ? (
              <>
                <div className="pt-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Signed in as {user.name} ({user.role})
                </div>
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => handleNav('admin-dashboard')}
                      className="text-left py-1.5 text-xs text-amber-300 font-medium"
                    >
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => handleNav('room-management')}
                      className="text-left py-1.5 text-xs text-slate-300"
                    >
                      Room Management CRUD
                    </button>
                    <button
                      onClick={() => handleNav('booking-management')}
                      className="text-left py-1.5 text-xs text-slate-300"
                    >
                      All Reservations
                    </button>
                    <button
                      onClick={() => handleNav('guest-management')}
                      className="text-left py-1.5 text-xs text-slate-300"
                    >
                      Guest Records
                    </button>
                    <button
                      onClick={() => handleNav('staff-management')}
                      className="text-left py-1.5 text-xs text-slate-300"
                    >
                      Staff & Roster
                    </button>
                    <button
                      onClick={() => handleNav('payment-reports')}
                      className="text-left py-1.5 text-xs text-slate-300"
                    >
                      Payment Reports
                    </button>
                  </>
                )}
                {user.role === 'staff' && (
                  <>
                    <button
                      onClick={() => handleNav('booking-management')}
                      className="text-left py-1.5 text-xs text-indigo-300 font-medium"
                    >
                      Front Desk Stays
                    </button>
                    <button
                      onClick={() => handleNav('room-management')}
                      className="text-left py-1.5 text-xs text-slate-300"
                    >
                      Housekeeping Status
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleNav('my-bookings')}
                  className="text-left py-1.5 text-xs text-slate-300"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => handleNav('profile')}
                  className="text-left py-1.5 text-xs text-slate-300"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNav('home');
                  }}
                  className="text-left py-2 text-xs text-red-400 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleNav('login')}
                  className="flex-1 py-2 text-center text-xs font-semibold bg-slate-800 text-white rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="flex-1 py-2 text-center text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
