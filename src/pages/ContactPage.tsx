import React, { useState } from 'react';
import { api } from '../services/api.ts';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);

    try {
      const res = await api.contact.sendMessage({ name, email, phone, subject, message });
      if (res.success) {
        setStatus({
          text: 'Thank you for contacting HotelPro Concierge. Our guest relation managers will respond within 4 hours.',
          type: 'success'
        });
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch (err: any) {
      setStatus({ text: err.message || 'Error submitting message.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Banner */}
      <section className="bg-[#0a1424] text-white pt-16 pb-16 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Concierge & Guest Relations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            Connect With Our Team
          </h1>
          <p className="text-xs text-slate-300 mt-2 font-light">
            Whether inquiring about private helipad transfers, bespoke wedding receptions, or customized suite dining, our concierge stands ready.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Concierge Desks
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Physical Sanctuary:</strong>
                    100 Grand Boulevard, Oceanfront Enclave, Pebble Beach, CA 93953
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Direct Telephones:</strong>
                    VIP Desk: +1 (800) 555-LUXE <br />
                    Front Desk: +1 (831) 555-0199
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Electronic Inquiries:</strong>
                    concierge@hotelpro-resort.com <br />
                    events@hotelpro-resort.com
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Availability:</strong>
                    Front Desk: 24 Hours / 7 Days <br />
                    In-Suite Dining: 24/7 Butler Service
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0b172a] text-white p-6 rounded-2xl border border-amber-900/40">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Fast Response Pledge</span>
              <h4 className="font-serif text-base font-bold text-white mt-1">Private Event Planning</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Our event architects assist with intimate coastal weddings, corporate retreats, and private buyouts.
              </p>
            </div>
          </div>

          {/* Right 2 Columns: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
                Send an Inquiry or Concierge Request
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                All inquiries are stored and routed directly to our on-duty front desk management.
              </p>

              {status && (
                <div
                  className={`mb-6 p-4 rounded-xl text-xs flex items-center justify-between border ${
                    status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {status.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{status.text}</span>
                  </div>
                  <button onClick={() => setStatus(null)} className="font-bold underline">
                    Dismiss
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Lady Claire Dupont"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Inquiry Subject *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. Private Villa Dining, Airport Maybach Transfer"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Provide dates, guest counts, or specific hospitality requirements..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    required
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Transmitting...' : 'Dispatch Message'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
