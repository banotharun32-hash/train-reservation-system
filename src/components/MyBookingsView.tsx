import React, { useState } from 'react';
import { Booking, User, ViewType } from '../types';
import { cancelBooking } from '../utils/storage';
import { 
  BookmarkCheck, 
  Ticket, 
  RotateCcw, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  Train as TrainIcon, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight,
  User as UserIcon,
  Search,
  Filter
} from 'lucide-react';

interface MyBookingsViewProps {
  bookings: Booking[];
  currentUser: User | null;
  onRefreshBookings: () => void;
  onViewTicket: (booking: Booking) => void;
  onNavigate: (view: ViewType) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  currentUser,
  onRefreshBookings,
  onViewTicket,
  onNavigate,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Confirmed' | 'Cancelled'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cancel confirmation modal state
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancellationMessage, setCancellationMessage] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState(false);

  // If user is logged in, filter bookings by this user or show all if admin
  const userBookings = bookings.filter((b) => {
    if (!currentUser) return true; // Show sample/demo bookings for testing
    if (currentUser.role === 'admin') return true;
    return b.userId === currentUser.id || b.userEmail === currentUser.email;
  });

  const displayedBookings = userBookings.filter((b) => {
    if (filterStatus !== 'ALL' && b.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesPnr = b.pnr.toLowerCase().includes(term);
      const matchesTrain = b.trainName.toLowerCase().includes(term) || b.trainNumber.includes(term);
      const matchesPassenger = b.passengers.some(p => p.name.toLowerCase().includes(term));
      if (!matchesPnr && !matchesTrain && !matchesPassenger) return false;
    }
    return true;
  });

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);

    const result = cancelBooking(bookingToCancel.pnr);
    setIsCancelling(false);

    if (result.success) {
      setCancellationMessage(result.message);
      onRefreshBookings();
    } else {
      setCancellationMessage(result.message);
    }
    setBookingToCancel(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Train Bookings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View booking status, seat allocations, print official e-tickets, or process cancellations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('booking')}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Ticket className="w-4 h-4" />
          <span>Book New Journey</span>
        </button>
      </div>

      {/* Guest Notice if not logged in */}
      {!currentUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="text-xs text-blue-900">
            <strong>Viewing demo booking records.</strong> Sign in to link bookings directly to your verified account.
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="px-3 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-md hover:bg-blue-800"
          >
            Log In
          </button>
        </div>
      )}

      {/* Cancellation Notice Banner */}
      {cancellationMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{cancellationMessage}</span>
          </div>
          <button
            onClick={() => setCancellationMessage('')}
            className="text-emerald-700 hover:underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Bookings ({userBookings.length})
          </button>
          <button
            onClick={() => setFilterStatus('Confirmed')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterStatus === 'Confirmed' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Confirmed ({userBookings.filter(b => b.status === 'Confirmed').length})
          </button>
          <button
            onClick={() => setFilterStatus('Cancelled')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filterStatus === 'Cancelled' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Cancelled ({userBookings.filter(b => b.status === 'Cancelled').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by PNR or Train..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Bookings List */}
      {displayedBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No railway bookings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any bookings matching this filter. Search for trains and book your next journey today.
          </p>
          <button
            onClick={() => onNavigate('search')}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Search Trains
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map((booking) => {
            const isConfirmed = booking.status === 'Confirmed';
            const primaryPassenger = booking.passengers[0];
            const seatSummary = booking.passengers
              .map(p => `${p.coach || 'C3'}-${p.seatNumber || '22'}`)
              .join(', ');

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <TrainIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-black text-blue-900">{booking.pnr}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isConfirmed 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Booked on {booking.bookingDate} • {booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewTicket(booking)}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => setBookingToCancel(booking)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Cancel Ticket</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Journey & Train Info */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                  {/* Train info */}
                  <div className="md:col-span-4 space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Train & Route</span>
                    <p className="text-sm font-bold text-slate-900">{booking.trainName} ({booking.trainNumber})</p>
                    <p className="text-slate-600 font-medium">{booking.from} &rarr; {booking.to}</p>
                  </div>

                  {/* Date & Timings */}
                  <div className="md:col-span-3 space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Schedule</span>
                    <p className="font-mono font-bold text-slate-900 text-xs">Journey Date: {booking.journeyDate}</p>
                    <p className="text-slate-600 font-mono">
                      {booking.departureTime} &rarr; {booking.arrivalTime}
                    </p>
                  </div>

                  {/* Class & Seats */}
                  <div className="md:col-span-3 space-y-1">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Class & Berths</span>
                    <p className="font-bold text-blue-800">{booking.className} ({booking.travelClass})</p>
                    <p className="font-mono text-slate-800 font-semibold">Seat: {seatSummary}</p>
                  </div>

                  {/* Total Fare */}
                  <div className="md:col-span-2 text-left md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-3 space-y-0.5">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Fare</span>
                    <p className="text-lg font-black text-slate-900 font-mono">₹{booking.totalFare}</p>
                    <span className="text-[10px] text-slate-500 block">Paid via {booking.paymentMethod}</span>
                  </div>
                </div>

                {/* Passenger Breakdown Row */}
                <div className="px-5 pb-4 pt-1 bg-slate-50/30 border-t border-slate-100 text-[11px] text-slate-600 flex flex-wrap gap-x-6 gap-y-1">
                  <span className="font-bold text-slate-700">Passenger(s):</span>
                  {booking.passengers.map((p, i) => (
                    <span key={i} className="flex items-center space-x-1">
                      <span className="font-semibold text-slate-800">{p.name}</span>
                      <span className="text-slate-400">({p.age}y, {p.gender})</span>
                      <span className="text-blue-700 font-mono font-semibold">[{p.coach}-{p.seatNumber}]</span>
                      {i < booking.passengers.length - 1 && <span className="text-slate-300">·</span>}
                    </span>
                  ))}
                </div>

                {/* Cancellation Refund Info (if cancelled) */}
                {!isConfirmed && booking.refundAmount && (
                  <div className="px-5 py-2.5 bg-rose-50/50 border-t border-rose-100 text-xs text-rose-800 flex items-center justify-between">
                    <span>Cancelled on {booking.cancellationDate || 'Recently'}</span>
                    <span className="font-bold font-mono">Refund of ₹{booking.refundAmount} processed</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Ticket Cancellation?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel PNR <strong>{bookingToCancel.pnr}</strong> for <strong>{bookingToCancel.trainName}</strong>?
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Fare Paid:</span>
                <span className="font-mono font-bold text-slate-900">₹{bookingToCancel.totalFare}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Cancellation Charges (10%):</span>
                <span className="font-mono font-bold">-₹{Math.round(bookingToCancel.totalFare * 0.10)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-700">
                <span>Net Estimated Refund (90%):</span>
                <span className="font-mono text-sm">₹{Math.round(bookingToCancel.totalFare * 0.90)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Your booked berths will be immediately released back to the train inventory.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isCancelling ? 'Processing...' : 'Yes, Cancel My Ticket'}
              </button>
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
