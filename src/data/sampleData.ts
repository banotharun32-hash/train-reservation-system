import { Train, User, Booking } from '../types';

export const POPULAR_STATIONS = [
  'New Delhi (NDLS)',
  'Mumbai Central (MMCT)',
  'Kolkata Howrah (HWH)',
  'Chennai Central (MAS)',
  'Bengaluru City (SBC)',
  'Hyderabad Deccan (HYB)',
  'Ahmedabad Jn (ADI)',
  'Varanasi Jn (BSB)',
  'Pune Jn (PUNE)',
  'Jaipur Jn (JP)',
  'Lucknow Charbagh (LKO)',
  'Goa Madgaon (MAO)'
];

export const INITIAL_TRAINS: Train[] = [
  {
    id: 'tr-22436',
    number: '22436',
    name: 'Vande Bharat Express',
    from: 'New Delhi (NDLS)',
    to: 'Varanasi Jn (BSB)',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    type: 'Vande Bharat',
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    platform: '16',
    status: 'On Time',
    intermediateStops: ['Kanpur Central', 'Prayagraj Jn'],
    classes: {
      'CC': { code: 'CC', name: 'AC Chair Car', totalSeats: 78, availableSeats: 42, fare: 1750 },
      '1A': { code: '1A', name: 'Executive AC (1A)', totalSeats: 52, availableSeats: 16, fare: 3300 }
    }
  },
  {
    id: 'tr-12952',
    number: '12952',
    name: 'Mumbai Rajdhani Express',
    from: 'New Delhi (NDLS)',
    to: 'Mumbai Central (MMCT)',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    type: 'Rajdhani Superfast',
    runsOn: ['Daily'],
    platform: '03',
    status: 'On Time',
    intermediateStops: ['Kota Jn', 'Vadodara Jn', 'Surat', 'Borivali'],
    classes: {
      '1A': { code: '1A', name: 'AC First Class', totalSeats: 30, availableSeats: 8, fare: 4850 },
      '2A': { code: '2A', name: 'AC 2 Tier', totalSeats: 90, availableSeats: 26, fare: 3120 },
      '3A': { code: '3A', name: 'AC 3 Tier', totalSeats: 240, availableSeats: 64, fare: 2280 }
    }
  },
  {
    id: 'tr-12002',
    number: '12002',
    name: 'Bhopal Shatabdi Express',
    from: 'New Delhi (NDLS)',
    to: 'Bhopal Habibganj (RKMP)',
    departureTime: '06:15',
    arrivalTime: '14:40',
    duration: '8h 25m',
    type: 'Shatabdi Express',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    platform: '01',
    status: 'On Time',
    intermediateStops: ['Mathura Jn', 'Agra Cantt', 'Gwalior Jn', 'Jhansi Jn'],
    classes: {
      'CC': { code: 'CC', name: 'AC Chair Car', totalSeats: 120, availableSeats: 35, fare: 1490 },
      '1A': { code: '1A', name: 'Executive Class', totalSeats: 40, availableSeats: 11, fare: 2620 }
    }
  },
  {
    id: 'tr-12626',
    number: '12626',
    name: 'Kerala Superfast Express',
    from: 'New Delhi (NDLS)',
    to: 'Bengaluru City (SBC)',
    departureTime: '20:10',
    arrivalTime: '06:45',
    duration: '34h 35m',
    type: 'Superfast Express',
    runsOn: ['Daily'],
    platform: '05',
    status: 'On Time',
    intermediateStops: ['Agra Cantt', 'Bhopal Jn', 'Nagpur', 'Vijayawada', 'Renigunta'],
    classes: {
      '2A': { code: '2A', name: 'AC 2 Tier', totalSeats: 72, availableSeats: 14, fare: 3680 },
      '3A': { code: '3A', name: 'AC 3 Tier', totalSeats: 190, availableSeats: 48, fare: 2540 },
      'SL': { code: 'SL', name: 'Sleeper Class', totalSeats: 320, availableSeats: 112, fare: 980 }
    }
  },
  {
    id: 'tr-20608',
    number: '20608',
    name: 'Chennai - Mysuru Vande Bharat',
    from: 'Chennai Central (MAS)',
    to: 'Bengaluru City (SBC)',
    departureTime: '05:50',
    arrivalTime: '10:20',
    duration: '4h 30m',
    type: 'Vande Bharat',
    runsOn: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'],
    platform: '02',
    status: 'On Time',
    intermediateStops: ['Katpadi Jn'],
    classes: {
      'CC': { code: 'CC', name: 'AC Chair Car', totalSeats: 90, availableSeats: 58, fare: 995 },
      '1A': { code: '1A', name: 'Executive AC (1A)', totalSeats: 36, availableSeats: 12, fare: 1980 }
    }
  },
  {
    id: 'tr-12301',
    number: '12301',
    name: 'Howrah Rajdhani Express',
    from: 'Kolkata Howrah (HWH)',
    to: 'New Delhi (NDLS)',
    departureTime: '16:50',
    arrivalTime: '10:05',
    duration: '17h 15m',
    type: 'Rajdhani Superfast',
    runsOn: ['Daily'],
    platform: '09',
    status: 'On Time',
    intermediateStops: ['Asansol Jn', 'Dhanbad Jn', 'Gaya Jn', 'Pt Deen Dayal Upadhyaya Jn', 'Kanpur Central'],
    classes: {
      '1A': { code: '1A', name: 'AC First Class', totalSeats: 28, availableSeats: 6, fare: 4950 },
      '2A': { code: '2A', name: 'AC 2 Tier', totalSeats: 88, availableSeats: 22, fare: 3260 },
      '3A': { code: '3A', name: 'AC 3 Tier', totalSeats: 210, availableSeats: 54, fare: 2390 }
    }
  },
  {
    id: 'tr-12123',
    number: '12123',
    name: 'Deccan Queen Superfast',
    from: 'Mumbai Central (MMCT)',
    to: 'Pune Jn (PUNE)',
    departureTime: '17:10',
    arrivalTime: '20:25',
    duration: '3h 15m',
    type: 'Superfast Express',
    runsOn: ['Daily'],
    platform: '08',
    status: 'On Time',
    intermediateStops: ['Karjat', 'Lonavala', 'Shivajinagar'],
    classes: {
      'CC': { code: 'CC', name: 'AC Chair Car', totalSeats: 140, availableSeats: 62, fare: 480 },
      '2A': { code: '2A', name: 'First Class Non-AC', totalSeats: 80, availableSeats: 24, fare: 320 }
    }
  },
  {
    id: 'tr-12987',
    number: '12987',
    name: 'Ajmer - Sealdah Express',
    from: 'Jaipur Jn (JP)',
    to: 'Kolkata Howrah (HWH)',
    departureTime: '08:15',
    arrivalTime: '12:30',
    duration: '28h 15m',
    type: 'Express',
    runsOn: ['Daily'],
    platform: '04',
    status: 'On Time',
    intermediateStops: ['Bharatpur Jn', 'Agra Fort', 'Kanpur Central', 'Prayagraj Jn', 'Gaya Jn'],
    classes: {
      '2A': { code: '2A', name: 'AC 2 Tier', totalSeats: 64, availableSeats: 18, fare: 2840 },
      '3A': { code: '3A', name: 'AC 3 Tier', totalSeats: 180, availableSeats: 45, fare: 1960 },
      'SL': { code: 'SL', name: 'Sleeper Class', totalSeats: 350, availableSeats: 89, fare: 730 }
    }
  },
  {
    id: 'tr-12727',
    number: '12727',
    name: 'Godavari Superfast Express',
    from: 'Hyderabad Deccan (HYB)',
    to: 'Chennai Central (MAS)',
    departureTime: '17:15',
    arrivalTime: '05:40',
    duration: '12h 25m',
    type: 'Superfast Express',
    runsOn: ['Daily'],
    platform: '06',
    status: 'On Time',
    intermediateStops: ['Secunderabad', 'Kazipet', 'Vijayawada', 'Ongole'],
    classes: {
      '1A': { code: '1A', name: 'AC First Class', totalSeats: 24, availableSeats: 5, fare: 3450 },
      '2A': { code: '2A', name: 'AC 2 Tier', totalSeats: 70, availableSeats: 19, fare: 2180 },
      '3A': { code: '3A', name: 'AC 3 Tier', totalSeats: 190, availableSeats: 52, fare: 1540 },
      'SL': { code: 'SL', name: 'Sleeper Class', totalSeats: 300, availableSeats: 94, fare: 590 }
    }
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Railway Admin Official',
    email: 'admin@railway.gov',
    phone: '9876543210',
    password: 'admin',
    role: 'admin',
    createdAt: '2026-01-01'
  },
  {
    id: 'user-demo',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9812345678',
    password: 'password123',
    role: 'user',
    createdAt: '2026-02-15'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    pnr: 'PNR-8429103857',
    userId: 'user-demo',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.sharma@example.com',
    userPhone: '9812345678',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    from: 'New Delhi (NDLS)',
    to: 'Varanasi Jn (BSB)',
    journeyDate: '2026-10-15',
    departureTime: '06:00',
    arrivalTime: '14:00',
    travelClass: 'CC',
    className: 'AC Chair Car',
    passengers: [
      { id: 'p-1', name: 'Rahul Sharma', age: 29, gender: 'Male', coach: 'C4', seatNumber: '32', berthPreference: 'Window' },
      { id: 'p-2', name: 'Priya Sharma', age: 27, gender: 'Female', coach: 'C4', seatNumber: '33', berthPreference: 'Window' }
    ],
    totalFare: 3500,
    status: 'Confirmed',
    bookingDate: '2026-10-05',
    paymentMethod: 'UPI'
  }
];
