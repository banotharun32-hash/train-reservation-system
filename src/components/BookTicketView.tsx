import React, { useState, useEffect } from 'react';
import { Train, User, ClassCode, Booking, Passenger, ViewType } from '../types';
import { createBooking } from '../utils/storage';
import { 
  Ticket, 
  User as UserIcon, 
  CreditCard, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  Calendar, 
  Train as TrainIcon, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Smartphone, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface BookTicketViewProps {
  trains: Train[];
  currentUser: User | null;
  prefilledTrain?: Train | null;
  prefilledClass?: ClassCode;
  prefilledDate?: string;
  prefilledPassengerCount?: number;
  onNavigate: (view: ViewType) => void;
  onViewTicket: (booking: Booking) => void;
  onSavePendingBooking: (pending: any) => void;
}

export const BookTicketView: React.FC<BookTicketViewProps> = ({
  trains,
  currentUser,
  prefilledTrain,
  prefilledClass,
  prefilledDate,
  prefilledPassengerCount = 1,
  onNavigate,
  onViewTicket,
  onSavePendingBooking,
}) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Selected Train & Journey
  const [selectedTrainId, setSelectedTrainId] = useState<string>(
    prefilledTrain ? prefilledTrain.id : (trains[0]?.id || '')
  );
  const activeTrain = trains.find(t => t.id === selectedTrainId) || trains[0];

  const availableClassesForTrain = activeTrain ? Object.keys(activeTrain.classes) as ClassCode[] : [];
  const [selectedClass, setSelectedClass] = useState<ClassCode>(
    prefilledClass && activeTrain?.classes[prefilledClass] 
      ? prefilledClass 
      : (availableClassesForTrain[0] || 'CC')
  );

  const [journeyDate, setJourneyDate] = useState<string>(prefilledDate || tomorrow);

  // Contact info
  const [contactPhone, setContactPhone] = useState<string>(currentUser?.phone || '9876543210');
  const [contactEmail, setContactEmail] = useState<string>(currentUser?.email || 'traveler@example.com');

  // Passengers list
  const [passengers, setPassengers] = useState<Array<{ name: string; age: number; gender: 'Male' | 'Female' | 'Other'; berth: string }>>([
    { name: currentUser?.name || 'Rahul Sharma', age: 28, gender: 'Male', berth: 'Window' }
  ]);

  // Adjust passengers if prefilled count changed
  useEffect(() => {
    if (prefilledPassengerCount > passengers.length) {
      const extraCount = prefilledPassengerCount - passengers.length;
      const additional = Array.from({ length: extraCount }).map((_, i) => ({
        name: `Passenger ${passengers.length + i + 1}`,
        age: 25,
        gender: 'Female' as const,
        berth: 'Window'
      }));
      setPassengers(prev => [...prev, ...additional]);
    }
  }, [prefilledPassengerCount]);

  // Modals & Confirmation States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'UPI'>('Card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Payment mock input states
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardName, setCardName] = useState(currentUser?.name || 'Rahul Sharma');
  const [upiId, setUpiId] = useState('user@okhdfcbank');

  // Current class details & Seat calculations
  const classDetail = activeTrain?.classes[selectedClass];
  const availableSeats = classDetail?.availableSeats ?? 0;
  const farePerPassenger = classDetail?.fare ?? 0;
  const isSoldOut = availableSeats <= 0;
  const hasInsufficientSeats = availableSeats < passengers.length;

  const baseFare = farePerPassenger * passengers.length;
  const reservationFee = 40;
  const gstTax = Math.round(baseFare * 0.05);
  const totalFare = baseFare + reservationFee + gstTax;

  // Passenger management
  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      setErrorMessage('Maximum 6 passengers allowed per booking.');
      return;
    }
    setPassengers(prev => [
      ...prev,
      { name: '', age: 25, gender: 'Male', berth: 'Window' }
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length === 1) return;
    setPassengers(prev => prev.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index: number, field: string, value: any) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleClear = () => {
    setPassengers([{ name: '', age: 25, gender: 'Male', berth: 'Window' }]);
    setErrorMessage('');
  };

  const handleInitiateBooking = () => {
    setErrorMessage('');

    // Check login
    if (!currentUser) {
      // Save pending booking state so user can resume after login
      onSavePendingBooking({
        trainId: activeTrain.id,
        travelClass: selectedClass,
        journeyDate,
        passengers,
        phone: contactPhone,
        email: contactEmail,
      });
      onNavigate('login');
      return;
    }

    // Validation
    if (isSoldOut || hasInsufficientSeats) {
      setErrorMessage('No seats available for this selection.');
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setErrorMessage(`Please enter the name for Passenger #${i + 1}`);
        return;
      }
      if (passengers[i].age < 1 || passengers[i].age > 120) {
        setErrorMessage(`Please enter a valid age for Passenger #${i + 1}`);
        return;
      }
    }

    if (!contactPhone || contactPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!contactEmail || !contactEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      // Create booking in database
      const formattedPassengers: Passenger[] = passengers.map((p, idx) => ({
        id: `p-${Date.now()}-${idx}`,
        name: p.name.trim(),
        age: p.age,
        gender: p.gender,
        berthPreference: p.berth as any,
      }));

      const newBooking = createBooking({
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || passengers[0].name,
        userEmail: contactEmail,
        userPhone: contactPhone,
        trainNumber: activeTrain.number,
        trainName: activeTrain.name,
        from: activeTrain.from,
        to: activeTrain.to,
        journeyDate,
        departureTime: activeTrain.departureTime,
        arrivalTime: activeTrain.arrivalTime,
        travelClass: selectedClass,
        className: classDetail?.name || selectedClass,
        passengers: formattedPassengers,
        totalFare,
        paymentMethod,
      });

      setConfirmedBooking(newBooking);
    }, 1200);
  };

  // If a booking was successfully confirmed, show the Booking Confirmation Screen
  if (confirmedBooking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-left">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
            Booking Confirmed Successfully!
          </h1>
          <p className="text-emerald-800 text-sm max-w-lg mx-auto">
            Your e-ticket has been generated and seats have been allocated. Keep your PNR handy for journey verification.
          </p>

          <div className="inline-block bg-white border border-emerald-300 rounded-xl px-6 py-3 mt-3 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Your Booking Reference</span>
            <span className="text-2xl font-black text-blue-900 font-mono tracking-widest block">{confirmedBooking.pnr}</span>
          </div>
        </div>

        {/* Confirmation Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Journey Itinerary</span>
              <h2 className="text-xl font-bold text-slate-900">{confirmedBooking.trainName} ({confirmedBooking.trainNumber})</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Travel Date</span>
              <span className="text-base font-bold text-slate-900 font-mono">{confirmedBooking.journeyDate}</span>
            </div>
          </div>

          {/* Route Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Departure</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{confirmedBooking.departureTime}</span>
              <p className="font-semibold text-slate-700">{confirmedBooking.from}</p>
            </div>
            <div className="text-center sm:border-x border-slate-200 sm:px-4 flex flex-col justify-center">
              <span className="text-slate-500 block">Class & Quota</span>
              <span className="font-bold text-blue-800 text-sm">{confirmedBooking.className} ({confirmedBooking.travelClass})</span>
              <span className="text-slate-500 text-[11px]">General Quota</span>
            </div>
            <div className="sm:text-right">
              <span className="text-slate-500 block">Arrival</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{confirmedBooking.arrivalTime}</span>
              <p className="font-semibold text-slate-700">{confirmedBooking.to}</p>
            </div>
          </div>

          {/* Passenger Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-blue-600" />
              <span>Confirmed Passengers & Seat Numbers</span>
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">#</th>
                    <th className="py-2.5 px-4">Passenger Name</th>
                    <th className="py-2.5 px-4">Age / Gender</th>
                    <th className="py-2.5 px-4">Coach</th>
                    <th className="py-2.5 px-4">Seat / Berth</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  {confirmedBooking.passengers.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4">{p.age} Yrs / {p.gender}</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{p.coach}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">Seat {p.seatNumber}</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          CONFIRMED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fare Summary */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-200 pt-4 text-xs">
            <div>
              <span className="text-slate-500">Paid via {confirmedBooking.paymentMethod} • Contact: {confirmedBooking.userPhone}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 mr-2">Total Amount Paid:</span>
              <span className="text-xl font-black text-slate-900 font-mono">₹{confirmedBooking.totalFare}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={() => onViewTicket(confirmedBooking)}
              className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Ticket</span>
            </button>
            <button
              onClick={() => onNavigate('my-bookings')}
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-left border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Book Train Ticket
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete passenger details, choose coach class, and confirm your railway reservation.
        </p>
      </div>

      {/* Guest Warning if not logged in */}
      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-left">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900">
              <strong className="font-bold">You are currently browsing as a guest.</strong> Please log in or register to complete your ticket booking.
            </div>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Login Now
          </button>
        </div>
      )}

      {/* Error alert if any */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center space-x-3 text-left">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs font-semibold text-rose-800">{errorMessage}</p>
        </div>
      )}

      {/* Two Column Layout: Booking Form (Left) + Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Section 1: Train & Journey Selection */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <TrainIcon className="w-4 h-4 text-blue-600" />
              <span>1. Journey & Train Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Select Train */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Train</label>
                <select
                  value={selectedTrainId}
                  onChange={(e) => {
                    setSelectedTrainId(e.target.value);
                    const train = trains.find(t => t.id === e.target.value);
                    if (train) {
                      const firstClass = Object.keys(train.classes)[0] as ClassCode;
                      setSelectedClass(firstClass);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  {trains.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.number} - {t.name} ({t.from} &rarr; {t.to})
                    </option>
                  ))}
                </select>
              </div>

              {/* Journey Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Journey Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Class Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Travel Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value as ClassCode)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  {availableClassesForTrain.map((code) => {
                    const c = activeTrain?.classes[code];
                    return (
                      <option key={code} value={code}>
                        {code} - {c?.name} (₹{c?.fare})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Live Seat Availability Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isSoldOut 
                ? 'bg-rose-50 border-rose-200 text-rose-900' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center space-x-3">
                {isSoldOut ? (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                <div>
                  <p className="text-xs font-bold">
                    {isSoldOut ? 'No seats available.' : `Seats Available: ${availableSeats} berths`}
                  </p>
                  <p className="text-[11px] opacity-80">
                    {activeTrain?.name} ({activeTrain?.number}) • Dept: {activeTrain?.departureTime} • Arr: {activeTrain?.arrivalTime}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold">₹{farePerPassenger}</span>
                <span className="block text-[10px] text-slate-500">per person</span>
              </div>
            </div>
          </div>

          {/* Section 2: Passenger Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-blue-600" />
                <span>2. Passenger Details ({passengers.length} traveler{passengers.length > 1 ? 's' : ''})</span>
              </h2>

              <button
                type="button"
                onClick={handleAddPassenger}
                disabled={passengers.length >= 6}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Passenger</span>
              </button>
            </div>

            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700">Passenger #{index + 1}</span>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePassenger(index)}
                        className="text-rose-600 hover:text-rose-800 p-1 text-xs font-medium cursor-pointer"
                        title="Remove passenger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Age *</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium text-center focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender *</label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Berth Preference</label>
                      <select
                        value={passenger.berth}
                        onChange={(e) => handlePassengerChange(index, 'berth', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      >
                        <option value="Window">Window Seat</option>
                        <option value="Lower">Lower Berth</option>
                        <option value="Middle">Middle Berth</option>
                        <option value="Upper">Upper Berth</option>
                        <option value="Side Lower">Side Lower</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Contact Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>3. Contact & Ticket Delivery Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (for SMS PNR) *</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (for E-Ticket PDF) *</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleInitiateBooking}
              disabled={isSoldOut || hasInsufficientSeats}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer ${
                isSoldOut || hasInsufficientSeats
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Confirm Booking (₹{totalFare})</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <aside className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-left space-y-5 sticky top-24">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Booking Summary</span>
            <span className="text-[11px] text-blue-700 font-semibold">Live Quote</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Train</span>
              <p className="font-bold text-slate-900">{activeTrain?.name} ({activeTrain?.number})</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">From</span>
                <p className="font-semibold text-slate-800">{activeTrain?.from}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">To</span>
                <p className="font-semibold text-slate-800">{activeTrain?.to}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Journey Date</span>
                <p className="font-mono font-semibold text-slate-800">{journeyDate}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Class</span>
                <p className="font-semibold text-blue-700">{classDetail?.name} ({selectedClass})</p>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-slate-400 block text-[10px]">Passengers</span>
              <p className="font-bold text-slate-800">{passengers.length} Person(s)</p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Price per passenger</span>
              <span className="font-mono font-semibold">₹{farePerPassenger}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Number of passengers</span>
              <span className="font-mono font-semibold">x {passengers.length}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Base Ticket Fare</span>
              <span className="font-mono font-semibold">₹{baseFare}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Reservation Charge</span>
              <span className="font-mono font-semibold">₹{reservationFee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST & Surcharges (5%)</span>
              <span className="font-mono font-semibold">₹{gstTax}</span>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-900">Total Fare:</span>
              <span className="font-black text-blue-900 font-mono text-xl">₹{totalFare}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="flex items-center space-x-1.5 text-slate-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free cancellation up to 4 hrs before chart prep</span>
            </p>
            <p>Berth confirmation and seat assignment are guaranteed at checkout.</p>
          </div>
        </aside>
      </div>

      {/* Simulated Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Complete Railway Payment</h3>
                <p className="text-xs text-slate-500">Secure simulated transaction gateway</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Amount</span>
                <span className="text-lg font-black text-blue-900 font-mono">₹{totalFare}</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1.5 ${
                  paymentMethod === 'Card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Credit / Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1.5 ${
                  paymentMethod === 'UPI' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Instant UPI</span>
              </button>
            </div>

            {/* Method Content */}
            {paymentMethod === 'Card' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Virtual Payment Address (VPA) / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block mb-1">Simulated UPI QR Payment</span>
                  <div className="w-24 h-24 bg-white border border-slate-300 rounded mx-auto flex items-center justify-center font-mono text-[9px] text-slate-500">
                    [MOCK QR CODE]
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Scan with any UPI App or click Pay Now</span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmPayment}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <span>Processing Payment...</span>
                ) : (
                  <span>Pay ₹{totalFare} & Generate Ticket</span>
                )}
              </button>

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
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
