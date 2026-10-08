import React, { useState, useEffect } from 'react';
import { ViewType, Train, Booking, User, ClassCode } from './types';
import { 
  initStorage, 
  getTrains, 
  getBookings, 
  getCurrentUser, 
  setCurrentUser,
  setPendingBooking,
  getPendingBooking
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { SearchTrainsView } from './components/SearchTrainsView';
import { BookTicketView } from './components/BookTicketView';
import { MyBookingsView } from './components/MyBookingsView';
import { CancelTicketView } from './components/CancelTicketView';
import { TicketViewModal } from './components/TicketViewModal';
import { LoginView, RegisterView } from './components/AuthViews';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';

export default function App() {
  // Initialize storage once
  useEffect(() => {
    initStorage();
  }, []);

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [currentUser, setCurrentUserState] = useState<User | null>(() => getCurrentUser());
  const [trains, setTrains] = useState<Train[]>(() => getTrains());
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());
  
  // Prefill states
  const [searchPrefill, setSearchPrefill] = useState<{ from?: string; to?: string; date?: string }>({});
  const [bookingPrefill, setBookingPrefill] = useState<{
    train: Train | null;
    travelClass: ClassCode;
    passengersCount: number;
    journeyDate: string;
  }>({
    train: null,
    travelClass: 'CC',
    passengersCount: 1,
    journeyDate: '',
  });

  // Modal ticket view state
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  // Sync with browser URL hash for friendly URLs (#/search, #/booking, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const validViews: ViewType[] = [
        'home', 'search', 'booking', 'my-bookings', 'cancel', 'ticket', 'login', 'register', 'admin'
      ];
      if (validViews.includes(hash as ViewType)) {
        setCurrentView(hash as ViewType);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    window.location.hash = `#/${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshData = () => {
    setTrains(getTrains());
    setBookings(getBookings());
    setCurrentUserState(getCurrentUser());
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    handleNavigate('home');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUserState(user);
    // Check if there is a pending booking intent
    const pending = getPendingBooking();
    if (pending) {
      setPendingBooking(null);
      handleNavigate('booking');
    } else {
      handleNavigate('home');
    }
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUserState(user);
    const pending = getPendingBooking();
    if (pending) {
      setPendingBooking(null);
      handleNavigate('booking');
    } else {
      handleNavigate('home');
    }
  };

  // Quick search from Hero section
  const handleQuickSearch = (from: string, to: string, date: string) => {
    setSearchPrefill({ from, to, date });
    handleNavigate('search');
  };

  // Selecting a train from search results to book
  const handleSelectTrainForBooking = (
    train: Train,
    selectedClass: ClassCode,
    passengerCount: number,
    journeyDate: string
  ) => {
    setBookingPrefill({
      train,
      travelClass: selectedClass,
      passengersCount: passengerCount,
      journeyDate,
    });
    handleNavigate('booking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Universal Top Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onQuickSearch={handleQuickSearch}
          />
        )}

        {currentView === 'search' && (
          <SearchTrainsView
            trains={trains}
            initialFrom={searchPrefill.from}
            initialTo={searchPrefill.to}
            initialDate={searchPrefill.date}
            onSelectTrainForBooking={handleSelectTrainForBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'booking' && (
          <BookTicketView
            trains={trains}
            currentUser={currentUser}
            prefilledTrain={bookingPrefill.train}
            prefilledClass={bookingPrefill.travelClass}
            prefilledDate={bookingPrefill.journeyDate}
            prefilledPassengerCount={bookingPrefill.passengersCount}
            onNavigate={handleNavigate}
            onViewTicket={(b) => setSelectedTicket(b)}
            onSavePendingBooking={(pending) => setPendingBooking(pending)}
          />
        )}

        {currentView === 'my-bookings' && (
          <MyBookingsView
            bookings={bookings}
            currentUser={currentUser}
            onRefreshBookings={handleRefreshData}
            onViewTicket={(b) => setSelectedTicket(b)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'cancel' && (
          <CancelTicketView
            onRefreshBookings={handleRefreshData}
            onViewTicket={(b) => setSelectedTicket(b)}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'register' && (
          <RegisterView
            onRegisterSuccess={handleRegisterSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            trains={trains}
            bookings={bookings}
            currentUser={currentUser}
            onRefreshData={handleRefreshData}
          />
        )}
      </main>

      {/* Ticket Printable Modal */}
      <TicketViewModal
        booking={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
