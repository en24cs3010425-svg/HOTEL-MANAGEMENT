import React, { useState, useEffect } from 'react';
import { Staff } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Search
} from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState<Staff['designation']>('Front Desk Manager');
  const [assignedResponsibilities, setAssignedResponsibilities] = useState('');
  const [shift, setShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [employmentStatus, setEmploymentStatus] = useState<'active' | 'on_leave' | 'inactive'>('active');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getStaff();
      if (res.staff) {
        setStaffList(res.staff);
      }
    } catch (err) {
      console.error('Error loading staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setPhone('');
    setDesignation('Front Desk Manager');
    setAssignedResponsibilities('Guest arrivals, concierge inquiries, VIP escort.');
    setShift('Morning');
    setEmploymentStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setName(staff.name);
    setEmail(staff.email);
    setPhone(staff.phone);
    setDesignation(staff.designation);
    setAssignedResponsibilities(staff.assignedResponsibilities);
    setShift(staff.shift);
    setEmploymentStatus(staff.employmentStatus);
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const payload: Partial<Staff> = {
      name,
      email,
      phone,
      designation,
      assignedResponsibilities,
      shift,
      employmentStatus
    };

    try {
      if (editingStaff) {
        await api.admin.updateStaff(editingStaff.id, payload);
        setFeedback({ text: `Staff member ${name} updated.`, type: 'success' });
      } else {
        await api.admin.createStaff(payload);
        setFeedback({ text: `Staff member ${name} created.`, type: 'success' });
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (err: any) {
      setFeedback({ text: err.message || 'Error saving staff record.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStaff) return;
    try {
      await api.admin.deleteStaff(deletingStaff.id);
      setFeedback({ text: `Staff member ${deletingStaff.name} removed from roster.`, type: 'success' });
      fetchStaff();
    } catch (err: any) {
      setFeedback({ text: err.message || 'Error deleting staff.', type: 'error' });
    } finally {
      setDeletingStaff(null);
    }
  };

  const filtered = staffList.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.designation.toLowerCase().includes(q) ||
      s.shift.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Banner */}
      <section className="bg-[#0a1424] text-white pt-14 pb-14 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-400" />
              Human Resources & Hotel Staff
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
              Staff Operations & Roster
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Manage front desk managers, executive housekeepers, concierges, and operational shift rosters.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all self-start md:self-auto shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Team Member</span>
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center justify-between border ${
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

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="text-xs text-slate-500 font-medium">
            Active staff members: <strong className="text-slate-900">{filtered.length}</strong>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, role, shift..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Active Shift</th>
                  <th className="py-3.5 px-4">Assigned Operations</th>
                  <th className="py-3.5 px-4">Employment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{s.email}</span>
                      </div>
                      {s.phone && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{s.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-900">
                      {s.designation}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {s.shift} Shift
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs">
                      <p className="line-clamp-2">{s.assignedResponsibilities}</p>
                    </td>
                    <td className="py-4 px-4">
                      {/* Zero-pill styling */}
                      <span
                        className={`font-semibold ${
                          s.employmentStatus === 'active'
                            ? 'text-emerald-700'
                            : s.employmentStatus === 'on_leave'
                            ? 'text-amber-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.employmentStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Staff Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStaff(s)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Remove Staff"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingStaff ? `Edit ${editingStaff.name}` : 'Add Staff Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sophia Sterling"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="staff@hotelpro.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Designation *
                  </label>
                  <select
                    value={designation}
                    onChange={e => setDesignation(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  >
                    <option value="Front Desk Manager">Front Desk Manager</option>
                    <option value="Executive Housekeeper">Executive Housekeeper</option>
                    <option value="Chief Concierge">Chief Concierge</option>
                    <option value="Operations Supervisor">Operations Supervisor</option>
                    <option value="Night Auditor">Night Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Shift *
                  </label>
                  <select
                    value={shift}
                    onChange={e => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  >
                    <option value="Morning">Morning Shift (7 AM - 3 PM)</option>
                    <option value="Evening">Evening Shift (3 PM - 11 PM)</option>
                    <option value="Night">Night Shift (11 PM - 7 AM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Assigned Responsibilities
                </label>
                <textarea
                  rows={2}
                  value={assignedResponsibilities}
                  onChange={e => setAssignedResponsibilities(e.target.value)}
                  placeholder="Primary daily operational duties..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  {editingStaff ? 'Save Changes' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Safeguard */}
      <ConfirmationModal
        isOpen={!!deletingStaff}
        title={`Remove ${deletingStaff?.name}?`}
        message={`Are you sure you want to remove ${deletingStaff?.name} (${deletingStaff?.designation}) from the staff registry?`}
        confirmLabel="Yes, Remove"
        cancelLabel="Keep Record"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingStaff(null)}
      />
    </div>
  );
};
