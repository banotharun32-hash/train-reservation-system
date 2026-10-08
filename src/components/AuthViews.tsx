import React, { useState } from 'react';
import { User, ViewType } from '../types';
import { getUsers, saveUser, setCurrentUser } from '../utils/storage';
import { 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Train, 
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (view: ViewType) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigate }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotPasswordMessage('');

    if (!identifier.trim()) {
      setError('Please enter your registered email or username.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const users = getUsers();
    const foundUser = users.find(
      (u) =>
        (u.email.toLowerCase() === identifier.trim().toLowerCase() ||
          u.phone === identifier.trim() ||
          u.name.toLowerCase() === identifier.trim().toLowerCase()) &&
        (u.password === password || !u.password)
    );

    if (!foundUser) {
      setError('Invalid email or password. Please check your credentials or register a new account.');
      return;
    }

    setCurrentUser(foundUser);
    onLoginSuccess(foundUser);
  };

  const handleQuickDemoUser = () => {
    const users = getUsers();
    const demo = users.find(u => u.email === 'rahul.sharma@example.com') || users[1];
    if (demo) {
      setIdentifier(demo.email);
      setPassword(demo.password || 'password123');
      setCurrentUser(demo);
      onLoginSuccess(demo);
    }
  };

  const handleQuickDemoAdmin = () => {
    const users = getUsers();
    const admin = users.find(u => u.role === 'admin') || users[0];
    if (admin) {
      setIdentifier(admin.email);
      setPassword(admin.password || 'admin');
      setCurrentUser(admin);
      onLoginSuccess(admin);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-left space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-md">
          <Train className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Railway Account Login
        </h1>
        <p className="text-xs text-slate-500">
          Enter your credentials to book journeys and manage your PNR reservations.
        </p>
      </div>

      {/* Demo Credentials Quick Switch Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2 text-xs">
        <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
          One-Click Demo Credentials:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleQuickDemoUser}
            className="py-1.5 px-2 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
          >
            Passenger Demo (Rahul)
          </button>
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="py-1.5 px-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
          >
            Admin Portal Demo
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center space-x-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {forgotPasswordMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-800">
          {forgotPasswordMessage}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email / Username / Phone</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. rahul.sharma@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <button
              type="button"
              onClick={() => setForgotPasswordMessage('Demo password reset link has been dispatched to your email address.')}
              className="text-[11px] text-blue-700 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
        >
          <span>Sign In to Account</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-bold text-blue-700 hover:underline cursor-pointer"
          >
            Register Here
          </button>
        </div>
      </form>
    </div>
  );
};

interface RegisterViewProps {
  onRegisterSuccess: (user: User) => void;
  onNavigate: (view: ViewType) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegisterSuccess, onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Required fields check
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError('All fields are required. Please fill in all information.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address (e.g., user@example.com).');
      return;
    }

    // Phone validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please provide a valid 10-digit mobile phone number.');
      return;
    }

    // Password validation
    if (password.length < 4) {
      setError('Password must be at least 4 characters in length.');
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields match exactly.');
      return;
    }

    // Check if email already registered
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setError('This email address is already registered. Please sign in instead.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phoneDigits,
      password,
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    onRegisterSuccess(newUser);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-left space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-md">
          <Train className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Railway Account
        </h1>
        <p className="text-xs text-slate-500">
          Register with Indian Railways Reservation System for priority bookings and instant e-ticket access.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center space-x-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. Anand Mahindra"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="email"
              placeholder="e.g. anand@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (10 Digits) *</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="password"
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
        >
          <span>Complete Registration</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-blue-700 hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </form>
    </div>
  );
};
