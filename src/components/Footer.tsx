import React from 'react';
import { Building2, MapPin, Phone, Mail, Award, Shield, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#060d19] text-slate-300 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Ethos */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">HotelPro</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated architectural grandeur, personalized 24/7 butler service, and Michelin-caliber dining perched along California’s most pristine private coastline.
            </p>
            <div className="flex items-center gap-4 text-xs text-amber-400 font-medium pt-2">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Forbes 5-Star 2026
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" /> Leading Hotels of the World
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Suites & Sanctuaries</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('rooms')} className="hover:text-amber-300 transition-colors">
                  Presidential Grand Suites
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rooms')} className="hover:text-amber-300 transition-colors">
                  Ocean View Villas & Teak Cabanas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rooms')} className="hover:text-amber-300 transition-colors">
                  Executive Dual-Chamber Suites
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rooms')} className="hover:text-amber-300 transition-colors">
                  Classic Heritage Chambers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rooms')} className="hover:text-amber-300 transition-colors">
                  Family Penthouse Residences
                </button>
              </li>
            </ul>
          </div>

          {/* Guest Services & Concierge */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Guest Experience</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('availability')} className="hover:text-amber-300 transition-colors">
                  Real-time Availability Search
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors">
                  Heritage & Architecture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-300 transition-colors">
                  Bespoke Event Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-bookings')} className="hover:text-amber-300 transition-colors">
                  Manage Existing Reservations
                </button>
              </li>
              <li>
                <span className="text-slate-500">Helipad Transfer Coordination</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">Concierge & Location</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>100 Grand Boulevard, Oceanfront Enclave, Pebble Beach, CA 93953</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+1 (800) 555-LUXE / +1 (831) 555-0199</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>concierge@hotelpro-resort.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>24/7 Front Desk & Private Chauffeur</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 HotelPro Hospitality Systems. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-3 sm:mt-0 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Reservation</span>
            <span>·</span>
            <span>PCI-DSS Verified Secure Gateway</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
