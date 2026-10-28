import React, { useState, useEffect } from 'react';
import { Payment, FinancialReports } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Download,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Search,
  Building,
  CreditCard
} from 'lucide-react';

export const PaymentReportsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reports, setReports] = useState<FinancialReports | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refundingPayment, setRefundingPayment] = useState<Payment | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const [payRes, repRes] = await Promise.all([
        api.payments.getHistory(),
        api.admin.getReports()
      ]);
      if (payRes.payments) {
        setPayments(payRes.payments);
      }
      if (repRes.reports) {
        setReports(repRes.reports);
      }
    } catch (err) {
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRefund = async () => {
    if (!refundingPayment) return;
    try {
      const res = await api.payments.refund(refundingPayment.id);
      if (res.success) {
        setFeedback({
          text: `Refund of $${refundingPayment.amount} processed for transaction ${refundingPayment.transactionReference}.`,
          type: 'success'
        });
        fetchFinancialData();
      }
    } catch (err: any) {
      setFeedback({ text: err.message || 'Error processing refund.', type: 'error' });
    } finally {
      setRefundingPayment(null);
    }
  };

  const handleExportCSV = () => {
    if (payments.length === 0) return;
    const headers = ['Transaction Ref', 'Booking Ref', 'Amount USD', 'Provider', 'Method', 'Status', 'Date'];
    const rows = payments.map(p => [
      p.transactionReference,
      p.bookingReference,
      p.amount,
      p.provider,
      p.method,
      p.status,
      p.paymentDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hotelpro_payments_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = payments.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.transactionReference.toLowerCase().includes(q) ||
      p.bookingReference.toLowerCase().includes(q) ||
      p.provider.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Banner */}
      <section className="bg-[#0a1424] text-white pt-14 pb-14 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Financial Accounting & Reports
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
              Payment Ledger & Revenue Reports
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Audit transaction folios, gateway sandbox verifications, room yield, and customer refunds.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all self-start md:self-auto shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit Ledger</span>
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Financial KPI Summary Cards */}
        {reports && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Gross Processed</div>
              <div className="font-serif text-3xl font-bold text-slate-900 mt-1">
                ${reports.grossRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1">All gateway settlements</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Disbursed Refunds</div>
              <div className="font-serif text-3xl font-bold text-rose-700 mt-1">
                ${reports.refundedAmount.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1">Policy cancellations</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Net Realized Revenue</div>
              <div className="font-serif text-3xl font-bold text-emerald-700 mt-1">
                ${reports.netRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1">Net earnings retained</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Average Daily Rate (ADR)</div>
              <div className="font-serif text-3xl font-bold text-amber-700 mt-1">
                ${reports.averageDailyRate.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1">Yield per occupied night</div>
            </div>
          </div>
        )}

        {/* Revenue by Room Tier Breakdown */}
        {reports && Object.keys(reports.revenueByType).length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
              Revenue Contribution by Room Tier
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Financial performance segmented across presidential, villa, and executive collections.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(reports.revenueByType).map(([type, data]) => (
                <div key={type} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">{type}</div>
                  <div className="font-serif text-xl font-bold text-amber-800 mt-1">
                    ${data.revenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {data.bookingsCount} bookings · {data.nights} total room nights
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Ledger Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Transaction Audit Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every transaction reference is verified through sandbox API integration.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search transaction ref or folio #..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Transaction Ref</th>
                  <th className="py-3.5 px-4">Booking Folio</th>
                  <th className="py-3.5 px-4">Settlement Amount</th>
                  <th className="py-3.5 px-4">Payment Method & Provider</th>
                  <th className="py-3.5 px-4">Transaction Status</th>
                  <th className="py-3.5 px-4">Settlement Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-800 text-[11px]">
                      {p.transactionReference}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-amber-800">
                      {p.bookingReference}
                    </td>
                    <td className="py-4 px-4 font-serif font-bold text-slate-900 text-sm">
                      ${p.amount} {p.currency}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div>{p.method}</div>
                      <div className="text-[11px] text-slate-400">{p.provider}</div>
                    </td>
                    <td className="py-4 px-4">
                      {/* Zero-pill clean text status */}
                      <span
                        className={`font-semibold ${
                          p.status === 'completed'
                            ? 'text-emerald-700'
                            : p.status === 'refunded'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(p.paymentDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {p.status === 'completed' ? (
                        <button
                          onClick={() => setRefundingPayment(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Process Refund</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No Action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!refundingPayment}
        title={`Process Refund of $${refundingPayment?.amount}?`}
        message={`Are you sure you want to refund $${refundingPayment?.amount} for transaction ${refundingPayment?.transactionReference} (Booking ${refundingPayment?.bookingReference})? The payment and booking records will be updated immediately.`}
        confirmLabel="Yes, Disburse Refund"
        cancelLabel="Keep Payment"
        isDestructive={true}
        onConfirm={handleConfirmRefund}
        onCancel={() => setRefundingPayment(null)}
      />
    </div>
  );
};
