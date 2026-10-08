import React, { useState } from 'react';
import { ViewType, User } from '../types';
import { Train, User as UserIcon, LogOut, Shield, Menu, X, Ticket, Search, BookmarkCheck, Ban } from 'lucide-react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: 'home', label: 'Home', icon: null },
    { view: 'search', label: 'Search Trains', icon: <Search className="w-4 h-4 mr-1.5" /> },
    { view: 'booking', label: 'Book Ticket', icon: <Ticket className="w-4 h-4 mr-1.5" /> },
    { view: 'my-bookings', label: 'My Bookings', icon: <BookmarkCheck className="w-4 h-4 mr-1.5" /> },
    { view: 'cancel', label: 'Cancel Ticket', icon: <Ban className="w-4 h-4 mr-1.5" /> },
    { view: 'admin', label: 'Admin', icon: <Shield className="w-4 h-4 mr-1.5" /> },
  ];

  const handleNavClick = (view: ViewType) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-tight block">
                Railway Reservation System
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                National Rail Ticketing Portal
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleNavClick(link.view)}
                  className={`flex items-center px-3.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions / Authentication */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-md transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors ${
                    currentView === 'login'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-xs transition-colors whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                currentView === link.view
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 text-xs text-red-600 font-medium hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2 text-center text-xs font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full py-2 text-center text-xs font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
