import React, { useState } from 'react';
import { Booking, Train } from '../types';
import { getBookings, cancelBooking } from '../utils/storage';
import { 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Train as TrainIcon, 
  User as UserIcon, 
  Calendar, 
  Ticket,
  ArrowRight,
  ShieldCheck,
  Printer
} from 'lucide-react';

interface CancelTicketViewProps {
  onRefreshBookings: () => void;
  onViewTicket: (booking: Booking) => void;
}

export const CancelTicketView: React.FC<CancelTicketViewProps> = ({
  onRefreshBookings,
  onViewTicket,
}) => {
  const [pnrInput, setPnrInput] = useState('');
  const [passengerNameInput, setPassengerNameInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cancelledBooking, setCancelledBooking] = useState<Booking | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearchBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSearchedBooking(null);
    setCancelledBooking(null);
    setSuccessMessage('');

    if (!pnrInput.trim()) {
      setSearchError('Please enter a valid Booking ID / PNR.');
      return;
    }

    const bookings = getBookings();
    const cleanPnr = pnrInput.trim().toUpperCase();

    const found = bookings.find(b => b.pnr.toUpperCase().replace(/\s+/g, '') === cleanPnr.replace(/\s+/g, ''));

    if (!found) {
      setSearchError(`No reservation found matching PNR: ${pnrInput}. Please double check the 10-digit number.`);
      return;
    }

    if (passengerNameInput.trim()) {
      const nameMatch = found.passengers.some(p => 
        p.name.toLowerCase().includes(passengerNameInput.trim().toLowerCase())
      );
      if (!nameMatch) {
        setSearchError(`Booking found, but passenger name "${passengerNameInput}" does not match the reservation.`);
        return;
      }
    }

    setSearchedBooking(found);
  };

  const handleConfirmCancellation = () => {
    if (!searchedBooking) return;

    const result = cancelBooking(searchedBooking.pnr);
    if (result.success && result.booking) {
      setCancelledBooking(result.booking);
      setSuccessMessage(result.message);
      setSearchedBooking(result.booking);
      onRefreshBookings();
    } else {
      setSearchError(result.message);
    }
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cancel Railway Ticket
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search your booking using your 10-digit PNR and passenger name to process an instant cancellation and refund.
        </p>
      </div>

      {/* Cancellation Search Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleSearchBooking} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Booking ID / PNR Number *
              </label>
              <div className="relative">
                <Ticket className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. PNR-8429103857"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Found at top of your ticket voucher</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Passenger Name (Optional)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={passengerNameInput}
                  onChange={(e) => setPassengerNameInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Verify primary passenger on reservation</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-slate-500">
              Cancellation is permitted up to 4 hours prior to train departure.
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Booking</span>
            </button>
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {searchError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center space-x-3 text-xs text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Success Cancellation Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-emerald-950">Ticket Successfully Cancelled</h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">{successMessage}</p>
        </div>
      )}

      {/* Display Booking Details Card */}
      {searchedBooking && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-blue-900 font-mono">{searchedBooking.pnr}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  searchedBooking.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {searchedBooking.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Booked by {searchedBooking.userName} ({searchedBooking.userEmail})
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Fare</span>
              <span className="text-xl font-black text-slate-900 font-mono">₹{searchedBooking.totalFare}</span>
            </div>
          </div>

          {/* Train Route Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">TRAIN</span>
              <p className="font-bold text-slate-900">{searchedBooking.trainName} ({searchedBooking.trainNumber})</p>
              <p className="text-slate-600">Class: {searchedBooking.className} ({searchedBooking.travelClass})</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">ROUTE & TIMINGS</span>
              <p className="font-semibold text-slate-800">{searchedBooking.from} &rarr; {searchedBooking.to}</p>
              <p className="text-slate-600 font-mono">{searchedBooking.departureTime} - {searchedBooking.arrivalTime}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-slate-400 block text-[10px]">JOURNEY DATE</span>
              <p className="font-mono font-bold text-slate-900">{searchedBooking.journeyDate}</p>
              <p className="text-slate-500">{searchedBooking.passengers.length} passenger(s)</p>
            </div>
          </div>

          {/* Passengers Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Booked Passengers</h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Age / Gender</th>
                    <th className="py-2 px-3">Coach & Seat</th>
                    <th className="py-2 px-3">Berth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  {searchedBooking.passengers.map((p, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold">{p.name}</td>
                      <td className="py-2.5 px-3">{p.age} Yrs / {p.gender}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{p.coach}-{p.seatNumber}</td>
                      <td className="py-2.5 px-3">{p.berthPreference || 'Window'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cancellation Actions */}
          <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => onViewTicket(searchedBooking)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>View Ticket</span>
            </button>

            {searchedBooking.status === 'Confirmed' ? (
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(true)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-2 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cancel Ticket</span>
              </button>
            ) : (
              <div className="text-xs text-rose-700 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                This ticket has already been cancelled.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {isConfirmModalOpen && searchedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Are you sure you want to cancel this ticket?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This action is irreversible. Berths will be released immediately back to general quota.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-slate-900">{searchedBooking.pnr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Original Fare:</span>
                <span className="font-mono font-bold text-slate-900">₹{searchedBooking.totalFare}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Cancellation Deduction (10%):</span>
                <span className="font-mono font-bold">-₹{Math.round(searchedBooking.totalFare * 0.10)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-700">
                <span>Refund Initiated to Original Account:</span>
                <span className="font-mono text-sm">₹{Math.round(searchedBooking.totalFare * 0.90)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Ticket Cancellation
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
