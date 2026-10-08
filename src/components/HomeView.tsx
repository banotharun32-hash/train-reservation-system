import React, { useState } from 'react';
import { ViewType } from '../types';
import { POPULAR_STATIONS } from '../data/sampleData';
import { 
  Search, 
  Ticket, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  RotateCcw, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Compass, 
  Users, 
  TrendingUp, 
  Zap, 
  Shield 
} from 'lucide-react';

// Generated high-fidelity visual assets
import heroTrainImg from '../assets/images/railway_hero_train_1791476577881.jpg';
import scenicViaductImg from '../assets/images/train_scenic_viaduct_1791476589994.jpg';
import interiorImg from '../assets/images/modern_train_interior_1791476607452.jpg';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  onQuickSearch: (from: string, to: string, date: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onQuickSearch }) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [fromStation, setFromStation] = useState(POPULAR_STATIONS[0]);
  const [toStation, setToStation] = useState(POPULAR_STATIONS[1]);
  const [journeyDate, setJourneyDate] = useState(tomorrow);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(fromStation, toStation, journeyDate);
  };

  const featureCards = [
    {
      title: 'Easy Train Search',
      description: 'Search hundreds of intercity, superfast, and Vande Bharat trains across the country with live timetables and route maps.',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      tag: 'Smart Search'
    },
    {
      title: 'Real-Time Seat Availability',
      description: 'Instant seat status across Executive, 1st AC, 2nd AC, 3rd AC, Chair Car, and Sleeper categories with accurate vacancy indicators.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      tag: 'Live Status'
    },
    {
      title: 'Easy Ticket Booking',
      description: 'Streamlined passenger onboarding, smart berth preference allocation, and instant PNR generation with zero wait time.',
      icon: <Ticket className="w-6 h-6 text-indigo-600" />,
      tag: '1-Click Booking'
    },
    {
      title: 'Secure Payment',
      description: 'Simulated multi-channel checkout supporting UPI, Net Banking, and Credit/Debit cards with bank-grade safety verification.',
      icon: <CreditCard className="w-6 h-6 text-amber-600" />,
      tag: 'Encrypted'
    },
    {
      title: 'Ticket Cancellation',
      description: 'Hassle-free 1-step ticket cancellation using your PNR number with instant fare refund calculations and seat release.',
      icon: <RotateCcw className="w-6 h-6 text-rose-600" />,
      tag: 'Instant Refund'
    },
    {
      title: 'Booking History',
      description: 'Comprehensive digital itinerary archive with downloadable PDF-style boarding passes, live status, and journey summaries.',
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      tag: 'Cloud History'
    }
  ];

  const steps = [
    { step: '01', title: 'Search Train', desc: 'Enter origin, destination, and preferred date to check available trains.' },
    { step: '02', title: 'Select Train', desc: 'Choose your desired train, timing, and travel class (1A, 2A, 3A, CC, SL).' },
    { step: '03', title: 'Enter Passenger Details', desc: 'Provide traveler names, age, gender, and berth preferences.' },
    { step: '04', title: 'Make Payment', desc: 'Complete payment securely via mock UPI or Debit/Credit card.' },
    { step: '05', title: 'Get Ticket', desc: 'Instantly receive your 10-digit PNR and printable boarding voucher.' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-700/50 text-blue-200 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Modern Indian Railways Online Ticketing Engine</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Railway Reservation System
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Book your train journey quickly, easily, and securely. Check live seat availability, manage PNR status, and download authentic e-tickets in seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('search')}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Trains</span>
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Ticket</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-blue-800/40 grid grid-cols-3 gap-4 text-xs text-slate-300">
                <div>
                  <p className="font-bold text-white text-base">99.9%</p>
                  <p className="text-slate-400">On-Time Accuracy</p>
                </div>
                <div>
                  <p className="font-bold text-white text-base">Instant</p>
                  <p className="text-slate-400">PNR Generation</p>
                </div>
                <div>
                  <p className="font-bold text-white text-base">100% Secure</p>
                  <p className="text-slate-400">Encrypted Gateway</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image Container */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-800">
                <img
                  src={heroTrainImg}
                  alt="Modern Railway Reservation System High Speed Train"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-left text-white">
                    <span className="text-xs uppercase tracking-wider text-blue-300 font-bold block">Next-Gen Rail Express</span>
                    <p className="text-sm font-semibold">High-Speed Corridor & Executive Class Comfort</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Search Floating Form */}
          <div className="mt-12 bg-white rounded-xl shadow-xl border border-slate-200 p-5 sm:p-6 text-slate-900">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Quick Train Journey Search</span>
            </h2>

            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-4 text-left">
                <label className="block text-xs font-semibold text-slate-600 mb-1">From Station</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    {POPULAR_STATIONS.map((st) => (
                      <option key={`from-${st}`} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="lg:col-span-4 text-left">
                <label className="block text-xs font-semibold text-slate-600 mb-1">To Station</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    {POPULAR_STATIONS.map((st) => (
                      <option key={`to-${st}`} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="lg:col-span-2 text-left">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Journey Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Trains</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Comprehensive Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Engineered for Modern Railway Commuters
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Everything you need for seamless train ticketing, seat tracking, and trip management built directly into one intuitive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow relative text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  {card.icon}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Step-by-Step Guide</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-3">
            How It Works
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mb-12">
            Five simple steps to confirm your train journey and board with confidence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 text-left relative shadow-xs">
                <div className="text-3xl font-black text-blue-700 font-mono mb-3">
                  {item.step}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <span>Start Your Reservation Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Visual Showcase: Scenic Viaduct & Modern Cabin Interior */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Card 1: Scenic Route */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs text-left">
            <div className="h-64 overflow-hidden relative">
              <img
                src={scenicViaductImg}
                alt="Scenic railway route viaduct bridge"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-blue-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                Pan-India Scenic Corridors
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Connect Across Major Metros & Scenic Heritage Lines</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Direct connections spanning Northern plains, coastal tracks, Western Ghats, and high-speed corridors with real-time seat inventory.
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-3 border-t border-slate-100">
                <span>Direct routes to 12+ major junction hubs</span>
                <button
                  onClick={() => onNavigate('search')}
                  className="text-blue-700 font-semibold hover:underline flex items-center"
                >
                  Explore Routes &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Coach Comfort */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs text-left">
            <div className="h-64 overflow-hidden relative">
              <img
                src={interiorImg}
                alt="Modern railway passenger coach interior"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                Premium Ergonomics
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Executive AC, First Class & Sleeper Accommodations</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Choose your favorite berth preference — Window, Lower, or Upper — with guaranteed seat assignments and transparent pricing breakdown.
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-3 border-t border-slate-100">
                <span>Instant coach & seat allocation upon booking</span>
                <button
                  onClick={() => onNavigate('booking')}
                  className="text-blue-700 font-semibold hover:underline flex items-center"
                >
                  Book Seat Now &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-2xl p-8 sm:p-12 text-white text-center shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to reserve your journey?</h2>
            <p className="text-slate-200 text-sm sm:text-base">
              Experience the fastest and cleanest train ticket reservation system today.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('search')}
                className="px-6 py-3 rounded-lg bg-white text-blue-900 font-bold text-sm shadow hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Search Available Trains
              </button>
              <button
                onClick={() => onNavigate('booking')}
                className="px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold text-sm border border-blue-400 hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Book a Ticket Directly
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
