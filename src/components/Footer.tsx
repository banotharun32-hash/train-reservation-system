import React from 'react';
import { ViewType } from '../types';
import { Train, Phone, Mail, ShieldCheck, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="no-print bg-slate-900 text-slate-300 border-t border-slate-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Train className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                Railway Reservation System
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official online train reservation portal. Instant booking, transparent availability, guaranteed berth allocation, and hassle-free cancellation.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>SSL 256-Bit Encrypted Portal</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-white transition-colors cursor-pointer">
                  Search Trains & Timetables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-white transition-colors cursor-pointer">
                  Book Train Ticket
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-bookings')} className="hover:text-white transition-colors cursor-pointer">
                  My Bookings & PNR Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cancel')} className="hover:text-white transition-colors cursor-pointer">
                  Cancel Ticket & Refund
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: System & Admin */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Control & Support</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors cursor-pointer text-blue-400 font-semibold">
                  Admin Dashboard Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors cursor-pointer">
                  User Account Login
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors cursor-pointer">
                  New Traveler Registration
                </button>
              </li>
              <li className="text-slate-400">
                <span>Security & Privacy Policies</span>
              </li>
              <li className="text-slate-400">
                <span>Terms of Service (IRCTC Guidelines)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Railway Helpline */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Passenger Helplines</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Railway General Enquiry: <strong>139</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Security & Medical Helpline: <strong>182</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@railwayreservation.gov</span>
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Rail Bhavan, Raisina Road, New Delhi 110001</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Railway Reservation System. All rights reserved.</p>
          <p>B.Tech Software Engineering Project Demonstration • Built with HTML5, CSS3, JavaScript, React & LocalStorage</p>
        </div>
      </div>
    </footer>
  );
};
