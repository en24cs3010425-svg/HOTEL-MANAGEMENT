import React, { useState, useEffect } from 'react';
import { Room, RoomType, RoomStatus, CleaningStatus } from '../types/index.ts';
import { api } from '../services/api.ts';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import {
  BedDouble,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Search,
  X,
  Brush
} from 'lucide-react';

export const RoomManagementPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form fields
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState<RoomType>('Deluxe Room');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState<number>(300);
  const [capacity, setCapacity] = useState<number>(2);
  const [floor, setFloor] = useState<number>(1);
  const [sizeSqFt, setSizeSqFt] = useState<number>(500);
  const [bedType, setBedType] = useState('1 California King');
  const [amenitiesStr, setAmenitiesStr] = useState('High-speed Wi-Fi, King Bed, Rainfall Shower, Smart 4K TV, Mini Bar');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.rooms.getAll();
      if (res.rooms) {
        setRooms(res.rooms);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setRoomNumber('');
    setType('Deluxe Room');
    setDescription('');
    setPricePerNight(300);
    setCapacity(2);
    setFloor(1);
    setSizeSqFt(500);
    setBedType('1 California King');
    setAmenitiesStr('High-speed Wi-Fi, King Bed, Rainfall Shower, Smart 4K TV, Mini Bar');
    setImageUrl('https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setRoomNumber(room.roomNumber);
    setType(room.type);
    setDescription(room.description);
    setPricePerNight(room.pricePerNight);
    setCapacity(room.capacity);
    setFloor(room.floor);
    setSizeSqFt(room.sizeSqFt);
    setBedType(room.bedType);
    setAmenitiesStr(room.amenities.join(', '));
    setImageUrl(room.images[0] || '');
    setIsModalOpen(true);
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const amenitiesList = amenitiesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: Partial<Room> = {
      roomNumber,
      type,
      description,
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      floor: Number(floor),
      sizeSqFt: Number(sizeSqFt),
      bedType,
      amenities: amenitiesList,
      images: imageUrl ? [imageUrl] : undefined
    };

    try {
      if (editingRoom) {
        await api.rooms.update(editingRoom.id, payload);
        setFeedback({ text: `Suite ${roomNumber} updated successfully.`, type: 'success' });
      } else {
        await api.rooms.create(payload);
        setFeedback({ text: `Suite ${roomNumber} created and listed in inventory.`, type: 'success' });
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (err: any) {
      setFeedback({ text: err.message || 'Error saving room listing.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRoom) return;
    try {
      await api.rooms.delete(deletingRoom.id);
      setFeedback({ text: `Suite ${deletingRoom.roomNumber} deleted from inventory.`, type: 'success' });
      fetchRooms();
    } catch (err: any) {
      setFeedback({ text: err.message || 'Cannot delete room.', type: 'error' });
    } finally {
      setDeletingRoom(null);
    }
  };

  const handleCleaningChange = async (roomId: string, cleaningStatus: string) => {
    try {
      await api.rooms.updateCleaning(roomId, cleaningStatus);
      fetchRooms();
    } catch (err: any) {
      alert(err.message || 'Error updating cleaning status');
    }
  };

  const filteredRooms = rooms.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.roomNumber.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Banner */}
      <section className="bg-[#0a1424] text-white pt-14 pb-14 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-amber-400" />
              Room Inventory Management
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
              Suites, Residences & Housekeeping
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Add new rooms, modify pricing and capacity, and update housekeeping sanitization states.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all self-start md:self-auto shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Suite</span>
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
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="font-bold underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50"
            >
              <option value="all">All Inventory ({rooms.length})</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search suite number or type..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Room #</th>
                  <th className="py-3.5 px-4">Suite Category</th>
                  <th className="py-3.5 px-4">Rate / Night</th>
                  <th className="py-3.5 px-4">Capacity & Bedding</th>
                  <th className="py-3.5 px-4">Floor & Size</th>
                  <th className="py-3.5 px-4">Housekeeping Status</th>
                  <th className="py-3.5 px-4">Inventory State</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 text-sm">
                      #{r.roomNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{r.type}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{r.description}</div>
                    </td>
                    <td className="py-4 px-4 font-serif font-bold text-slate-900 text-sm">
                      ${r.pricePerNight}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div>{r.capacity} Guests</div>
                      <div className="text-[11px] text-slate-400">{r.bedType}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div>Floor {r.floor}</div>
                      <div className="text-[11px] text-slate-400">{r.sizeSqFt} sq ft</div>
                    </td>
                    <td className="py-4 px-4">
                      {/* Cleaning status dropdown for quick staff updates */}
                      <select
                        value={r.cleaningStatus}
                        onChange={e => handleCleaningChange(r.id, e.target.value)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded border ${
                          r.cleaningStatus === 'clean' || r.cleaningStatus === 'inspected'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : r.cleaningStatus === 'dirty'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="clean">Clean (Ready)</option>
                        <option value="dirty">Dirty (Housekeeping Req)</option>
                        <option value="in_progress">Cleaning in Progress</option>
                        <option value="inspected">Inspected & VIP Ready</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-semibold ${
                          r.status === 'available'
                            ? 'text-emerald-700'
                            : r.status === 'occupied'
                            ? 'text-indigo-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Suite"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingRoom(r)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Suite"
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

      {/* Add / Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingRoom ? `Edit Suite #${editingRoom.roomNumber}` : 'Create New Room Listing'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                    placeholder="e.g. 401"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Room Type *
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  >
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                    <option value="Ocean View Villa">Ocean View Villa</option>
                    <option value="Classic Heritage">Classic Heritage</option>
                    <option value="Family Penthouse">Family Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Price per Night ($) *
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={pricePerNight}
                    onChange={e => setPricePerNight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Max Guest Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Floor Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={floor}
                    onChange={e => setFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    value={sizeSqFt}
                    onChange={e => setSizeSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Bedding Configuration
                  </label>
                  <input
                    type="text"
                    value={bedType}
                    onChange={e => setBedType(e.target.value)}
                    placeholder="e.g. 1 California King + 1 Daybed"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Room Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description of architecture and view..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={amenitiesStr}
                    onChange={e => setAmenitiesStr(e.target.value)}
                    placeholder="Wi-Fi, Jacuzzi, Ocean View, Mini Bar..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>
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
                  {editingRoom ? 'Update Suite' : 'Create Suite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Safeguard */}
      <ConfirmationModal
        isOpen={!!deletingRoom}
        title={`Delete Suite #${deletingRoom?.roomNumber}?`}
        message={`Are you sure you want to permanently remove Suite ${deletingRoom?.roomNumber} (${deletingRoom?.type}) from the hotel inventory? This action cannot be reversed.`}
        confirmLabel="Yes, Delete Suite"
        cancelLabel="Keep Suite"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingRoom(null)}
      />
    </div>
  );
};
