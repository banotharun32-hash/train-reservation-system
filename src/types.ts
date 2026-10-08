export type ClassCode = '1A' | '2A' | '3A' | 'CC' | 'SL';

export interface ClassDetail {
  code: ClassCode;
  name: string;
  totalSeats: number;
  availableSeats: number;
  fare: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  type: 'Vande Bharat' | 'Rajdhani Superfast' | 'Shatabdi Express' | 'Superfast Express' | 'Express';
  runsOn: string[];
  platform: string;
  classes: {
    [key in ClassCode]?: ClassDetail;
  };
  intermediateStops?: string[];
  status: 'Active' | 'Delayed' | 'On Time';
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatNumber?: string;
  coach?: string;
  berthPreference?: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Window';
}

export interface Booking {
  id: string;
  pnr: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: ClassCode;
  className: string;
  passengers: Passenger[];
  totalFare: number;
  status: 'Confirmed' | 'Cancelled';
  bookingDate: string;
  paymentMethod: 'Card' | 'UPI';
  cancellationDate?: string;
  refundAmount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export type ViewType = 
  | 'home' 
  | 'search' 
  | 'booking' 
  | 'my-bookings' 
  | 'cancel' 
  | 'ticket' 
  | 'login' 
  | 'register' 
  | 'admin';
