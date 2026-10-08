import React, { useState } from 'react';
import { Train, User, Booking, ClassCode } from '../types';
import { addTrain, updateTrain, deleteTrain, getUsers } from '../utils/storage';
import { 
  Shield, 
  Users as UsersIcon, 
  Train as TrainIcon, 
  Ticket, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Layers, 
  DollarSign, 
  Search,
  Filter,
  Clock,
  ArrowRight
} from 'lucide-react';

interface AdminViewProps {
  trains: Train[];
  bookings: Booking[];
  currentUser: User | null;
  onRefreshData: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  trains,
  bookings,
  currentUser,
  onRefreshData
}) => {
  const users = getUsers();

  const [activeTab, setActiveTab] = useState<'trains' | 'bookings' | 'users'>('trains');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add / Edit Train Modal State
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  
  // Train Form State
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [fromStation, setFromStation] = useState('New Delhi (NDLS)');
  const [toStation, setToStation] = useState('Mumbai Central (MMCT)');
  const [departureTime, setDepartureTime] = useState('06:00');
  const [arrivalTime, setArrivalTime] = useState('14:30');
  const [duration, setDuration] = useState('8h 30m');
  const [trainType, setTrainType] = useState<Train['type']>('Superfast Express');
  const [platform, setPlatform] = useState('01');
  const [trainStatus, setTrainStatus] = useState<Train['status']>('On Time');
  const [primaryClass, setPrimaryClass] = useState<ClassCode>('CC');
  const [seatsCount, setSeatsCount] = useState<number>(80);
  const [fareAmount, setFareAmount] = useState<number>(1250);
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [trainToDelete, setTrainToDelete] = useState<Train | null>(null);

  // Compute metrics
  const totalUsersCount = users.length;
  const totalTrainsCount = trains.length;
  const totalBookingsCount = bookings.length;
  const cancelledTicketsCount = bookings.filter(b => b.status === 'Cancelled').length;
  
  const totalAvailableSeats = trains.reduce((acc, t) => {
    const seats = Object.values(t.classes).reduce((sum, c) => sum + (c?.availableSeats || 0), 0);
    return acc + seats;
  }, 0);

  const totalRevenue = bookings
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.totalFare, 0);

  // Open modal for Adding
  const handleOpenAdd = () => {
    setEditingTrain(null);
    setTrainNumber('');
    setTrainName('');
    setFromStation('New Delhi (NDLS)');
    setToStation('Mumbai Central (MMCT)');
    setDepartureTime('06:00');
    setArrivalTime('14:30');
    setDuration('8h 30m');
    setTrainType('Superfast Express');
    setPlatform('01');
    setTrainStatus('On Time');
    setPrimaryClass('CC');
    setSeatsCount(80);
    setFareAmount(1250);
    setFormError('');
    setIsTrainModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (t: Train) => {
    setEditingTrain(t);
    setTrainNumber(t.number);
    setTrainName(t.name);
    setFromStation(t.from);
    setToStation(t.to);
    setDepartureTime(t.departureTime);
    setArrivalTime(t.arrivalTime);
    setDuration(t.duration);
    setTrainType(t.type);
    setPlatform(t.platform || '01');
    setTrainStatus(t.status || 'On Time');
    
    const firstClassCode = (Object.keys(t.classes)[0] || 'CC') as ClassCode;
    setPrimaryClass(firstClassCode);
    setSeatsCount(t.classes[firstClassCode]?.availableSeats || 60);
    setFareAmount(t.classes[firstClassCode]?.fare || 1000);
    setFormError('');
    setIsTrainModalOpen(true);
  };

  const handleSaveTrain = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!trainNumber.trim() || !trainName.trim() || !fromStation.trim() || !toStation.trim()) {
      setFormError('Please fill out all required train identity and schedule fields.');
      return;
    }

    if (seatsCount < 1 || fareAmount < 1) {
      setFormError('Seat count and fare must be positive values.');
      return;
    }

    const classPayload = editingTrain?.classes ? { ...editingTrain.classes } : {};
    classPayload[primaryClass] = {
      code: primaryClass,
      name: primaryClass === '1A' ? 'AC First Class' : primaryClass === '2A' ? 'AC 2 Tier' : primaryClass === '3A' ? 'AC 3 Tier' : primaryClass === 'CC' ? 'AC Chair Car' : 'Sleeper Class',
      totalSeats: seatsCount,
      availableSeats: seatsCount,
      fare: fareAmount
    };

    if (editingTrain) {
      const updated: Train = {
        ...editingTrain,
        number: trainNumber.trim(),
        name: trainName.trim(),
        from: fromStation.trim(),
        to: toStation.trim(),
        departureTime,
        arrivalTime,
        duration,
        type: trainType,
        platform,
        status: trainStatus,
        classes: classPayload,
      };
      updateTrain(updated);
    } else {
      const newTrain: Train = {
        id: `tr-${Date.now()}`,
        number: trainNumber.trim(),
        name: trainName.trim(),
        from: fromStation.trim(),
        to: toStation.trim(),
        departureTime,
        arrivalTime,
        duration,
        type: trainType,
        platform,
        status: trainStatus,
        runsOn: ['Daily'],
        classes: classPayload,
      };
      addTrain(newTrain);
    }

    setIsTrainModalOpen(false);
    onRefreshData();
  };

  const handleConfirmDelete = () => {
    if (!trainToDelete) return;
    deleteTrain(trainToDelete.id);
    setTrainToDelete(null);
    onRefreshData();
  };

  // Filtered trains
  const filteredTrains = trains.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.number.includes(searchTerm) ||
    t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
              Official Administration
            </span>
            <span className="text-xs text-slate-400">Authenticated: {currentUser?.name || 'Admin'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Railway Management Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Control fleet inventory, modify schedules, manage passenger bookings, and review revenue telemetry.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Train</span>
        </button>
      </div>

      {/* 5 Required Dashboard Cards + Revenue */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
            <UsersIcon className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalUsersCount}</p>
          <span className="text-[10px] text-slate-500">Registered Accounts</span>
        </div>

        {/* Card 2: Total Trains */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Trains</span>
            <TrainIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalTrainsCount}</p>
          <span className="text-[10px] text-slate-500">Active Rakes</span>
        </div>

        {/* Card 3: Total Bookings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
            <Ticket className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalBookingsCount}</p>
          <span className="text-[10px] text-slate-500">Generated PNRs</span>
        </div>

        {/* Card 4: Cancelled Tickets */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cancelled</span>
            <RotateCcw className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-700 font-mono">{cancelledTicketsCount}</p>
          <span className="text-[10px] text-slate-500">Released Berths</span>
        </div>

        {/* Card 5: Available Seats */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available Seats</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-teal-700 font-mono">{totalAvailableSeats}</p>
          <span className="text-[10px] text-slate-500">Live Vacancies</span>
        </div>

        {/* Card 6: Gross Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-slate-900 font-mono">₹{totalRevenue}</p>
          <span className="text-[10px] text-slate-500">Net Ticket Sales</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('trains')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'trains'
              ? 'border-blue-700 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Train Management ({trains.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'bookings'
              ? 'border-blue-700 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'border-blue-700 text-blue-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Users ({users.length})
        </button>
      </div>

      {/* Tab 1: Train Management */}
      {activeTab === 'trains' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search train by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
            <span className="text-xs text-slate-500">
              Showing {filteredTrains.length} trains in active schedule
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Train No</th>
                  <th className="py-3 px-3">Train Name</th>
                  <th className="py-3 px-3">From</th>
                  <th className="py-3 px-3">To</th>
                  <th className="py-3 px-3">Dept</th>
                  <th className="py-3 px-3">Arr</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Seats</th>
                  <th className="py-3 px-3">Fare</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                {filteredTrains.map((t) => {
                  const classEntries = Object.entries(t.classes);
                  const firstClass = classEntries[0];
                  const classCode = firstClass ? firstClass[0] : 'CC';
                  const availableSeats = firstClass ? firstClass[1]?.availableSeats : 0;
                  const fare = firstClass ? firstClass[1]?.fare : 0;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-blue-900">{t.number}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{t.name}</td>
                      <td className="py-3 px-3 text-slate-600 truncate max-w-[130px]">{t.from}</td>
                      <td className="py-3 px-3 text-slate-600 truncate max-w-[130px]">{t.to}</td>
                      <td className="py-3 px-3 font-mono">{t.departureTime}</td>
                      <td className="py-3 px-3 font-mono">{t.arrivalTime}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                          {classCode}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">{availableSeats}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{fare}</td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Edit Train"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrainToDelete(t)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Train"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">PNR</th>
                <th className="py-3 px-3">Primary Passenger</th>
                <th className="py-3 px-3">Train</th>
                <th className="py-3 px-3">Journey Date</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Passengers</th>
                <th className="py-3 px-3">Total Fare</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">{b.pnr}</td>
                  <td className="py-3 px-3 font-bold">{b.userName}</td>
                  <td className="py-3 px-3">{b.trainName} ({b.trainNumber})</td>
                  <td className="py-3 px-3 font-mono">{b.journeyDate}</td>
                  <td className="py-3 px-3">{b.travelClass}</td>
                  <td className="py-3 px-3">{b.passengers.length}</td>
                  <td className="py-3 px-3 font-mono font-bold">₹{b.totalFare}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Manage Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-3 font-mono">{u.email}</td>
                  <td className="py-3 px-3 font-mono">{u.phone}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{u.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Train Modal */}
      {isTrainModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-left shadow-2xl relative my-8">
            <button
              onClick={() => setIsTrainModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {editingTrain ? 'Edit Train Schedule' : 'Add New Train to System'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter train information, origin/destination, class allocation, and fare structure.
            </p>

            {formError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-800">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveTrain} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Train Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. 12951"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Train Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Tejas Superfast Express"
                    value={trainName}
                    onChange={(e) => setTrainName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From Station *</label>
                  <input
                    type="text"
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">To Station *</label>
                  <input
                    type="text"
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure</label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arrival</label>
                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 8h 30m"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={primaryClass}
                    onChange={(e) => setPrimaryClass(e.target.value as ClassCode)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="CC">AC Chair Car (CC)</option>
                    <option value="1A">AC First Class (1A)</option>
                    <option value="2A">AC 2 Tier (2A)</option>
                    <option value="3A">AC 3 Tier (3A)</option>
                    <option value="SL">Sleeper Class (SL)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={seatsCount}
                    onChange={(e) => setSeatsCount(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fare (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={fareAmount}
                    onChange={(e) => setFareAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsTrainModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {editingTrain ? 'Save Changes' : 'Create Train'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {trainToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-left shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Train {trainToDelete.number}?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently remove {trainToDelete.name} from the timetable? This action cannot be undone.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Delete Train
              </button>
              <button
                type="button"
                onClick={() => setTrainToDelete(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
