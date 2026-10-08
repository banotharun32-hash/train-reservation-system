/**
 * RAILWAY RESERVATION SYSTEM - VANILLA JAVASCRIPT LOGIC & STORAGE ENGINE
 * Fulfills B.Tech Project requirements for standalone script.js
 */

const STORAGE_KEYS = {
  TRAINS: 'rrs_trains',
  USERS: 'rrs_users',
  BOOKINGS: 'rrs_bookings',
  CURRENT_USER: 'rrs_currentUser'
};

// Initialize system with pre-seeded data if empty
function initializeRailwaySystem() {
  if (!localStorage.getItem(STORAGE_KEYS.TRAINS)) {
    const defaultTrains = [
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
        platform: '16',
        status: 'On Time',
        classes: {
          'CC': { code: 'CC', name: 'AC Chair Car', totalSeats: 78, availableSeats: 42, fare: 1750 },
          '1A': { code: '1A', name: 'Executive AC', totalSeats: 52, availableSeats: 16, fare: 3300 }
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
        platform: '03',
        status: 'On Time',
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
        platform: '01',
        status: 'On Time',
        classes: {
          'CC': { code: 'CC', name: 'AC Chair Car', totalSeats: 120, availableSeats: 35, fare: 1490 }
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
        platform: '05',
        status: 'On Time',
        classes: {
          '3A': { code: '3A', name: 'AC 3 Tier', totalSeats: 190, availableSeats: 48, fare: 2540 },
          'SL': { code: 'SL', name: 'Sleeper Class', totalSeats: 320, availableSeats: 112, fare: 980 }
        }
      }
    ];
    localStorage.setItem(STORAGE_KEYS.TRAINS, JSON.stringify(defaultTrains));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      { id: 'user-admin', name: 'Admin Official', email: 'admin@railway.gov', phone: '9876543210', password: 'admin', role: 'admin' },
      { id: 'user-demo', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '9812345678', password: 'password123', role: 'user' }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    const defaultBookings = [
      {
        id: 'bk-1001',
        pnr: 'PNR-8429103857',
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
          { name: 'Rahul Sharma', age: 29, gender: 'Male', coach: 'C4', seatNumber: '32' }
        ],
        totalFare: 1750,
        status: 'Confirmed',
        bookingDate: '2026-10-05',
        paymentMethod: 'UPI'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(defaultBookings));
  }
}

// Global accessor functions
function getTrainsFromStorage() {
  initializeRailwaySystem();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAINS) || '[]');
}

function getBookingsFromStorage() {
  initializeRailwaySystem();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
}

function getCurrentUserFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
}

function logoutRailwayUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  window.location.href = 'index.html#/home';
}

// Auto-run initialization
initializeRailwaySystem();
