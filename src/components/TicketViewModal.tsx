import React from 'react';
import { Booking } from '../types';
import { Printer, Download, X, Train, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';

interface TicketViewModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const TicketViewModal: React.FC<TicketViewModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const isConfirmed = booking.status === 'Confirmed';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const ticketSummary = `
=============================================================
         RAILWAY RESERVATION SYSTEM - E-TICKET
=============================================================
PNR / BOOKING ID : ${booking.pnr}
BOOKING STATUS   : ${booking.status.toUpperCase()}
BOOKING DATE     : ${booking.bookingDate}

TRAIN DETAILS:
Train Number     : ${booking.trainNumber}
Train Name       : ${booking.trainName}
Class            : ${booking.className} (${booking.travelClass})
From Station     : ${booking.from} (Dept: ${booking.departureTime})
To Station       : ${booking.to} (Arr: ${booking.arrivalTime})
Journey Date     : ${booking.journeyDate}

PASSENGER DETAILS:
${booking.passengers
  .map(
    (p, i) =>
      `[${i + 1}] ${p.name.padEnd(20)} | Age: ${p.age} | ${p.gender.padEnd(6)} | Coach: ${p.coach || 'C3'} | Seat: ${p.seatNumber || '22'}`
  )
  .join('\n')}

FARE DETAILS:
Total Passengers : ${booking.passengers.length}
Total Fare Paid  : ₹${booking.totalFare}
Payment Mode     : ${booking.paymentMethod}
Contact Phone    : ${booking.userPhone}
Contact Email    : ${booking.userEmail}

INSTRUCTIONS:
1. Carry valid Government Original Photo Identity Card.
2. Arrive at least 20 minutes before train departure.
=============================================================
    Thank you for choosing Railway Reservation System.
=============================================================
`;

    const blob = new Blob([ticketSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Railway_Ticket_${booking.pnr}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl relative my-8 overflow-hidden text-left">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-800 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Train className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold tracking-tight">E-Ticket Voucher: {booking.pnr}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ticket</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div id="printable-ticket" className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center font-black">
                <Train className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  Railway Reservation System
                </h1>
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                  Electronic Reservation Slip (ERS) / Boarding Pass
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border border-slate-400 bg-slate-50 px-3 py-1 rounded">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">PNR Number</span>
                <span className="font-mono text-base font-black text-blue-900 tracking-wider block">
                  {booking.pnr}
                </span>
              </div>
              <div className="mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Train & Journey Matrix */}
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-100 divide-x divide-slate-300 border-b border-slate-300 p-2.5 font-semibold">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Train No & Name</span>
                <span className="font-bold text-slate-900">{booking.trainNumber} - {booking.trainName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Journey Date</span>
                <span className="font-mono font-bold text-slate-900">{booking.journeyDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Travel Class</span>
                <span className="font-bold text-blue-900">{booking.className} ({booking.travelClass})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Quota</span>
                <span className="font-bold text-slate-900">General Quota (GN)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 p-3 bg-white">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">From (Origin Station)</span>
                <p className="font-bold text-sm text-slate-900">{booking.from}</p>
                <p className="font-mono text-slate-700">Scheduled Departure: <strong>{booking.departureTime} HRS</strong></p>
              </div>

              <div className="space-y-1 pt-2 sm:pt-0 sm:pl-3">
                <span className="text-[10px] text-slate-500 uppercase font-bold">To (Destination Station)</span>
                <p className="font-bold text-sm text-slate-900">{booking.to}</p>
                <p className="font-mono text-slate-700">Scheduled Arrival: <strong>{booking.arrivalTime} HRS</strong></p>
              </div>
            </div>
          </div>

          {/* Passenger Details Table */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Passenger Information & Seat Allocation
            </h2>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-3 border-r border-slate-300">S.No</th>
                    <th className="py-2 px-3 border-r border-slate-300">Passenger Name</th>
                    <th className="py-2 px-3 border-r border-slate-300">Age</th>
                    <th className="py-2 px-3 border-r border-slate-300">Gender</th>
                    <th className="py-2 px-3 border-r border-slate-300">Booking Status</th>
                    <th className="py-2 px-3 border-r border-slate-300">Coach</th>
                    <th className="py-2 px-3">Seat / Berth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-slate-900 font-medium">
                  {booking.passengers.map((p, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-2.5 px-3 border-r border-slate-300 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 border-r border-slate-300 font-bold">{p.name}</td>
                      <td className="py-2.5 px-3 border-r border-slate-300 font-mono">{p.age}</td>
                      <td className="py-2.5 px-3 border-r border-slate-300">{p.gender}</td>
                      <td className="py-2.5 px-3 border-r border-slate-300">
                        <span className="font-bold text-emerald-700">{booking.status.toUpperCase()}</span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-300 font-mono font-bold text-blue-900">
                        {p.coach || 'C3'}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">
                        Seat {p.seatNumber || '24'} ({p.berthPreference || 'Window'})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment & Fare Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-300 rounded-lg p-4 text-xs bg-slate-50/50">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Payment Transaction</span>
              <p className="text-slate-700">Mode: <strong>{booking.paymentMethod}</strong> (Online Authorization)</p>
              <p className="text-slate-700">Passenger Contact: <strong>{booking.userPhone}</strong></p>
              <p className="text-slate-700">Registered Email: <strong>{booking.userEmail}</strong></p>
              <p className="text-slate-500 text-[11px]">Booking Timestamp: {booking.bookingDate}</p>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Fare Breakdown</span>
              <div className="flex justify-between sm:justify-end sm:space-x-4 text-slate-600">
                <span>Total Passengers:</span>
                <span className="font-mono font-semibold">{booking.passengers.length}</span>
              </div>
              <div className="flex justify-between sm:justify-end sm:space-x-4 text-slate-600">
                <span>Inclusive of GST & Surcharges:</span>
                <span className="font-mono font-semibold">Yes</span>
              </div>
              <div className="flex justify-between sm:justify-end sm:space-x-4 border-t border-slate-300 pt-1 text-sm font-black text-slate-900">
                <span>Total Fare Paid:</span>
                <span className="font-mono text-base text-blue-900">₹{booking.totalFare}</span>
              </div>
            </div>
          </div>

          {/* Simulated QR & Barcode Section */}
          <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 border border-slate-300 rounded bg-white font-mono text-[9px] flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="text-[11px] text-slate-500">
                <p className="font-bold text-slate-800">DIGITALLY SIGNED E-TICKET</p>
                <p>Scan barcode for Ticket Checking Staff (TTE) verification</p>
                <p className="font-mono text-[10px] text-slate-400">AUTH-{booking.pnr}-VERIFIED</p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400 font-mono">
              [|||||| |||| |||||||| ||||| |||||||]
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 uppercase">Important Travel Guidelines:</p>
            <p>1. One of the passengers booked on this ticket must produce an original identity card (Aadhaar / Voter ID / Passport / Driving License).</p>
            <p>2. Arrive at least 20 minutes prior to scheduled departure. Passengers without valid ID may be treated as traveling without ticket.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
