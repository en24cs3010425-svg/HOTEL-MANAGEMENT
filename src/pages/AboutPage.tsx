import React from 'react';
import { Award, Shield, Sparkles, Building2, Utensils, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Hero Banner */}
      <section className="relative py-24 bg-[#0a1424] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
            alt="HotelPro Architecture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            A Century of Timeless Hospitality
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            The Legend of HotelPro
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Perched along California’s most dramatic coastal bluffs, HotelPro has redefined global hospitality for nearly a century through architectural purity, personalized butler traditions, and bespoke guest experiences.
          </p>
        </div>
      </section>

      {/* Philosophy & Heritage */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Our Heritage</span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-2">
              Where Architecture Meets the Pacific Ocean
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-4">
              Founded in 1928 as an exclusive retreat for international diplomats and artists, HotelPro stands today as an iconic sanctuary of discreet luxury.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
              Every detail—from the hand-carved limestone arches to our private saltwater plunge pools—is tuned to provide a restorative escape from the pace of modern life.
            </p>

            <div className="mt-6 space-y-2 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Forbes 5-Star Hotel Distinction (2020 – 2026)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>World Luxury Hotel Award for Coastal Excellence</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Certified Carbon-Neutral Luxury Operations</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
              alt="Hotel Interior Salon"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Executive Leadership</span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-2">
              The Curators Behind Your Stay
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              A passionate team of internationally celebrated hospitality masters dedicated to your absolute comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Alexander Wright"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-amber-400"
              />
              <h3 className="font-serif text-base font-bold text-slate-900">Alexander Wright</h3>
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mt-0.5">Managing Director</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Over 25 years leading premier ultra-luxury resorts across Switzerland, the French Riviera, and California.
              </p>
            </div>

            <div className="text-center bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80"
                alt="Chef Antoine Moreau"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-amber-400"
              />
              <h3 className="font-serif text-base font-bold text-slate-900">Chef Antoine Moreau</h3>
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mt-0.5">Executive Master Chef</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Three Michelin-starred culinary virtuoso orchestrating our signature oceanfront farm-to-table tasting salons.
              </p>
            </div>

            <div className="text-center bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                alt="Sophia Sterling"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-amber-400"
              />
              <h3 className="font-serif text-base font-bold text-slate-900">Sophia Sterling</h3>
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mt-0.5">Director of Guest Experiences</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Les Clefs d'Or international concierge leader ensuring every guest preference is anticipated and fulfilled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-slate-900">Begin Your HotelPro Story</h2>
        <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
          Reserve your preferred suite directly with our online booking system for guaranteed best rates.
        </p>
        <button
          onClick={() => onNavigate('rooms')}
          className="mt-6 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          View Suites & Sanctuaries
        </button>
      </section>
    </div>
  );
};
