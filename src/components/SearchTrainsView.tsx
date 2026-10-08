import React, { useState, useMemo } from 'react';
import { Train, ClassCode, ViewType } from '../types';
import { POPULAR_STATIONS } from '../data/sampleData';
import { 
  Search, 
  ArrowRightLeft, 
  Clock, 
  Calendar, 
  Users, 
  Filter, 
  Info, 
  Ticket, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  X,
  ChevronRight,
  Sparkles,
  Train as TrainIcon
} from 'lucide-react';

interface SearchTrainsViewProps {
  trains: Train[];
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string;
  onSelectTrainForBooking: (train: Train, selectedClass: ClassCode, passengerCount: number, journeyDate: string) => void;
  onNavigate: (view: ViewType) => void;
}

export const SearchTrainsView: React.FC<SearchTrainsViewProps> = ({
  trains,
  initialFrom,
  initialTo,
  initialDate,
  onSelectTrainForBooking,
  onNavigate,
}) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Search form state
  const [fromStation, setFromStation] = useState(initialFrom || 'New Delhi (NDLS)');
  const [toStation, setToStation] = useState(initialTo || 'Mumbai Central (MMCT)');
  const [journeyDate, setJourneyDate] = useState(initialDate || tomorrow);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  // Filters state
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(5500);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [departureSlot, setDepartureSlot] = useState<string>('ALL');

  // Details Modal State
  const [detailModalTrain, setDetailModalTrain] = useState<Train | null>(null);

  // Swap Stations
  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleResetFilters = () => {
    setFilterType('ALL');
    setFilterClass('ALL');
    setMaxPrice(5500);
    setOnlyAvailable(false);
    setDepartureSlot('ALL');
  };

  // Filtered Trains Logic
  const filteredTrains = useMemo(() => {
    return trains.filter((train) => {
      // Station matching: either exact match or route matches if search form is filled
      if (fromStation && toStation && fromStation !== toStation) {
        const matchesOrigin = train.from.toLowerCase().includes(fromStation.split('(')[0].trim().toLowerCase());
        const matchesDest = train.to.toLowerCase().includes(toStation.split('(')[0].trim().toLowerCase());
        // If neither matches origin/dest, keep general or check intermediate stops
        if (!matchesOrigin && !matchesDest) {
          // If search is specific, allow general match or show all if nothing found
          const isRelevant = train.from === fromStation || train.to === toStation;
          if (!isRelevant) return false;
        }
      }

      // Train Type Filter
      if (filterType !== 'ALL' && train.type !== filterType) {
        return false;
      }

      // Class Filter
      if (filterClass !== 'ALL') {
        if (!train.classes[filterClass as ClassCode]) return false;
      }

      // Price Filter
      const trainFares = Object.values(train.classes).map(c => c?.fare || 9999);
      const minTrainFare = Math.min(...trainFares);
      if (minTrainFare > maxPrice) {
        return false;
      }

      // Availability Filter
      if (onlyAvailable) {
        const hasSeats = Object.values(train.classes).some(c => (c?.availableSeats || 0) >= passengersCount);
        if (!hasSeats) return false;
      }

      // Departure Time Slot Filter
      if (departureSlot !== 'ALL') {
        const depHour = parseInt(train.departureTime.split(':')[0], 10);
        if (departureSlot === 'EARLY' && (depHour < 0 || depHour >= 6)) return false;
        if (departureSlot === 'MORNING' && (depHour < 6 || depHour >= 12)) return false;
        if (departureSlot === 'AFTERNOON' && (depHour < 12 || depHour >= 18)) return false;
        if (departureSlot === 'NIGHT' && (depHour < 18 || depHour > 24)) return false;
      }

      return true;
    });
  }, [trains, fromStation, toStation, filterType, filterClass, maxPrice, onlyAvailable, departureSlot, passengersCount]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-left border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Search & Reserve Trains
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Check live train schedules, real-time seat vacancies, and book your tickets instantly.
        </p>
      </div>

      {/* Main Search Form Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 sm:p-6 text-left">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* From Station */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">From Station</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  {POPULAR_STATIONS.map((st) => (
                    <option key={`from-${st}`} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-5">
              <button
                type="button"
                onClick={handleSwapStations}
                title="Swap origin and destination"
                className="p-2 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Station */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">To Station</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  {POPULAR_STATIONS.map((st) => (
                    <option key={`to-${st}`} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Journey Date */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Journey Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Class */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              >
                <option value="ALL">All Classes</option>
                <option value="1A">AC First Class (1A)</option>
                <option value="2A">AC 2 Tier (2A)</option>
                <option value="3A">AC 3 Tier (3A)</option>
                <option value="CC">AC Chair Car (CC)</option>
                <option value="SL">Sleeper Class (SL)</option>
              </select>
            </div>

            {/* Passengers */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">Pass.</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium text-center focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Train</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Layout: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 text-left space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-700 hover:underline font-medium cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Train Type Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Train Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
            >
              <option value="ALL">All Types</option>
              <option value="Vande Bharat">Vande Bharat</option>
              <option value="Rajdhani Superfast">Rajdhani Superfast</option>
              <option value="Shatabdi Express">Shatabdi Express</option>
              <option value="Superfast Express">Superfast Express</option>
              <option value="Express">Express</option>
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Class</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
            >
              <option value="ALL">All Classes</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="CC">AC Chair Car (CC)</option>
              <option value="SL">Sleeper Class (SL)</option>
            </select>
          </div>

          {/* Departure Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Departure Time</label>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[
                { id: 'ALL', label: 'Any Time' },
                { id: 'EARLY', label: 'Early Morning (00:00 - 06:00)' },
                { id: 'MORNING', label: 'Morning (06:00 - 12:00)' },
                { id: 'AFTERNOON', label: 'Afternoon (12:00 - 18:00)' },
                { id: 'NIGHT', label: 'Night (18:00 - 24:00)' },
              ].map((slot) => (
                <label key={slot.id} className="flex items-center space-x-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="departureSlot"
                    checked={departureSlot === slot.id}
                    onChange={() => setDepartureSlot(slot.id)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{slot.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Max Fare</label>
              <span className="text-xs font-mono font-bold text-blue-700">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="400"
              max="5500"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-blue-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹400</span>
              <span>₹5500</span>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Available Seats Only</span>
            </label>
          </div>
        </aside>

        {/* Results Container */}
        <main className="lg:col-span-9 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              Showing <span className="font-bold text-slate-900 font-mono">{filteredTrains.length}</span> trains for your route
            </p>
            <span className="text-xs text-slate-500">
              Journey Date: <strong className="text-slate-800 font-mono">{journeyDate}</strong>
            </span>
          </div>

          {filteredTrains.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No trains found matching criteria</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try widening your price range, clearing filters, or searching across major junction stations like New Delhi or Mumbai Central.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredTrains.map((train) => {
              const availableClasses = Object.entries(train.classes) as [ClassCode, any][];

              return (
                <div
                  key={train.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all overflow-hidden"
                >
                  {/* Top Bar of the Train Card */}
                  <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <TrainIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-bold text-blue-900">{train.number}</span>
                          <span className="text-sm font-bold text-slate-900">{train.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                          <span className="text-blue-700 font-semibold">{train.type}</span>
                          <span>·</span>
                          <span>Runs on: {train.runsOn.join(', ')}</span>
                          <span>·</span>
                          <span>Platform {train.platform}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setDetailModalTrain(train)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Schedule Details Row */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Departure */}
                    <div className="md:col-span-3 text-left">
                      <span className="text-xl font-extrabold text-slate-900 font-mono">{train.departureTime}</span>
                      <p className="text-xs font-bold text-slate-700 truncate">{train.from}</p>
                      <span className="text-[11px] text-slate-400">Origin Departure</span>
                    </div>

                    {/* Duration Graphic */}
                    <div className="md:col-span-3 text-center px-2">
                      <span className="text-xs font-semibold text-slate-500 font-mono">{train.duration}</span>
                      <div className="relative flex items-center justify-center my-1">
                        <div className="h-0.5 w-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-blue-600 absolute" />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold">{train.status}</span>
                    </div>

                    {/* Arrival */}
                    <div className="md:col-span-3 text-left md:text-right">
                      <span className="text-xl font-extrabold text-slate-900 font-mono">{train.arrivalTime}</span>
                      <p className="text-xs font-bold text-slate-700 truncate">{train.to}</p>
                      <span className="text-[11px] text-slate-400">Destination Arrival</span>
                    </div>

                    {/* Fast summary fare */}
                    <div className="md:col-span-3 text-left md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                      <span className="text-[11px] text-slate-500 block">Starting from</span>
                      <span className="text-lg font-bold text-slate-900 font-mono">
                        ₹{Math.min(...availableClasses.map(([_, c]) => c.fare))}
                      </span>
                      <span className="text-[10px] text-slate-400 block">per passenger</span>
                    </div>
                  </div>

                  {/* Classes & Seat Availability Cards Grid */}
                  <div className="px-5 pb-5 pt-1">
                    <div className="text-xs font-bold text-slate-700 mb-2">Select Class & Book:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {availableClasses.map(([code, classInfo]) => {
                        const isAvailable = classInfo.availableSeats > 0;
                        return (
                          <div
                            key={code}
                            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                              isAvailable
                                ? 'border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs'
                                : 'border-rose-200 bg-rose-50/40 opacity-75'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-xs text-slate-900">{code}</span>
                                <span className="text-xs font-bold text-slate-900 font-mono">₹{classInfo.fare}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">{classInfo.name}</p>
                              
                              <div className="mt-2 text-[11px] font-semibold">
                                {isAvailable ? (
                                  <span className="text-emerald-700 flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                    <span>AVAILABLE - {classInfo.availableSeats}</span>
                                  </span>
                                ) : (
                                  <span className="text-rose-600 flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                                    <span>REGRET / 0</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              disabled={!isAvailable}
                              onClick={() => onSelectTrainForBooking(train, code, passengersCount, journeyDate)}
                              className={`mt-3 w-full py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                                isAvailable
                                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {isAvailable ? 'Book Now' : 'No Seats'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* Train Details Modal */}
      {detailModalTrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setDetailModalTrain(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <TrainIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{detailModalTrain.name}</h3>
                <p className="text-xs text-slate-500 font-mono">Train No: {detailModalTrain.number} | {detailModalTrain.type}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 mb-5 border border-slate-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">From:</span>
                <span className="font-semibold text-slate-800">{detailModalTrain.from} ({detailModalTrain.departureTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">To:</span>
                <span className="font-semibold text-slate-800">{detailModalTrain.to} ({detailModalTrain.arrivalTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Duration:</span>
                <span className="font-semibold text-slate-800 font-mono">{detailModalTrain.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operating Days:</span>
                <span className="font-semibold text-slate-800">{detailModalTrain.runsOn.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Platform:</span>
                <span className="font-semibold text-blue-700">Platform {detailModalTrain.platform}</span>
              </div>
              {detailModalTrain.intermediateStops && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-1">Major Intermediate Stoppages:</span>
                  <div className="flex flex-wrap gap-1">
                    {detailModalTrain.intermediateStops.map((stop, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                const firstAvailableClass = Object.keys(detailModalTrain.classes)[0] as ClassCode;
                onSelectTrainForBooking(detailModalTrain, firstAvailableClass, passengersCount, journeyDate);
                setDetailModalTrain(null);
              }}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Proceed to Book This Train
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
