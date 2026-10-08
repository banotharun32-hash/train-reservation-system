import { Train, User, Booking, ClassCode } from '../types';
import { INITIAL_TRAINS, INITIAL_USERS, INITIAL_BOOKINGS } from '../data/sampleData';

const STORAGE_KEYS = {
  TRAINS: 'rrs_trains',
  USERS: 'rrs_users',
  BOOKINGS: 'rrs_bookings',
  CURRENT_USER: 'rrs_currentUser',
  ACTIVE_SEARCH: 'rrs_activeSearch',
  PENDING_BOOKING: 'rrs_pendingBooking',
};

// Initialize localStorage if keys not present
export function initStorage(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.TRAINS)) {
    localStorage.setItem(STORAGE_KEYS.TRAINS, JSON.stringify(INITIAL_TRAINS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
}

// Trains API
export function getTrains(): Train[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRAINS);
    return data ? JSON.parse(data) : INITIAL_TRAINS;
  } catch {
    return INITIAL_TRAINS;
  }
}

export function saveTrains(trains: Train[]): void {
  localStorage.setItem(STORAGE_KEYS.TRAINS, JSON.stringify(trains));
}

export function addTrain(newTrain: Train): void {
  const trains = getTrains();
  trains.push(newTrain);
  saveTrains(trains);
}

export function updateTrain(updatedTrain: Train): void {
  const trains = getTrains().map(t => t.id === updatedTrain.id ? updatedTrain : t);
  saveTrains(trains);
}

export function deleteTrain(trainId: string): void {
  const trains = getTrains().filter(t => t.id !== trainId);
  saveTrains(trains);
}

// Users API
export function getUsers(): User[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// Bookings API
export function getBookings(): Booking[] {
  initStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : INITIAL_BOOKINGS;
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

export function createBooking(booking: Omit<Booking, 'id' | 'pnr' | 'bookingDate' | 'status'>): Booking {
  const bookings = getBookings();
  const trains = getTrains();

  // Find train and decrease seats
  const trainIndex = trains.findIndex(t => t.number === booking.trainNumber);
  if (trainIndex !== -1) {
    const targetTrain = trains[trainIndex];
    const targetClass = targetTrain.classes[booking.travelClass];
    if (targetClass) {
      targetClass.availableSeats = Math.max(0, targetClass.availableSeats - booking.passengers.length);
      trains[trainIndex] = targetTrain;
      saveTrains(trains);
    }
  }

  // Generate unique PNR: 10 digits
  const randomTenDigits = Math.floor(1000000000 + Math.random() * 9000000000);
  const pnr = `PNR-${randomTenDigits}`;

  // Assign realistic Coach and Berth numbers
  const coachPrefix = booking.travelClass === '1A' ? 'H1' 
    : booking.travelClass === '2A' ? 'A1' 
    : booking.travelClass === '3A' ? 'B2' 
    : booking.travelClass === 'CC' ? 'C3' 
    : 'S4';

  const baseSeat = Math.floor(1 + Math.random() * 60);

  const passengersWithSeats = booking.passengers.map((p, idx) => ({
    ...p,
    coach: p.coach || coachPrefix,
    seatNumber: p.seatNumber || `${baseSeat + idx}`,
  }));

  const newBooking: Booking = {
    ...booking,
    id: `bk-${Date.now()}`,
    pnr,
    passengers: passengersWithSeats,
    status: 'Confirmed',
    bookingDate: new Date().toISOString().split('T')[0],
  };

  bookings.unshift(newBooking);
  saveBookings(bookings);
  return newBooking;
}

export function cancelBooking(pnr: string): { success: boolean; message: string; booking?: Booking } {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.pnr.trim().toUpperCase() === pnr.trim().toUpperCase());

  if (index === -1) {
    return { success: false, message: 'No reservation found with this PNR number.' };
  }

  const booking = bookings[index];
  if (booking.status === 'Cancelled') {
    return { success: false, message: 'This booking is already cancelled.' };
  }

  // Calculate standard railway cancellation refund (90% refund, 10% cancellation charge)
  const refundAmount = Math.round(booking.totalFare * 0.90);

  booking.status = 'Cancelled';
  booking.cancellationDate = new Date().toISOString().split('T')[0];
  booking.refundAmount = refundAmount;

  bookings[index] = booking;
  saveBookings(bookings);

  // Restore available seats back to the train
  const trains = getTrains();
  const trainIndex = trains.findIndex(t => t.number === booking.trainNumber);
  if (trainIndex !== -1) {
    const targetTrain = trains[trainIndex];
    const targetClass = targetTrain.classes[booking.travelClass];
    if (targetClass) {
      targetClass.availableSeats = Math.min(targetClass.totalSeats, targetClass.availableSeats + booking.passengers.length);
      trains[trainIndex] = targetTrain;
      saveTrains(trains);
    }
  }

  return { success: true, message: `Ticket ${pnr} has been successfully cancelled. Refund of ₹${refundAmount} initiated.`, booking };
}

// Active search query cache
export function getStoredSearch() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SEARCH);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredSearch(searchData: any) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SEARCH, JSON.stringify(searchData));
}

// Pending booking intent cache (when user clicks book without being logged in)
export function getPendingBooking() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_BOOKING);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setPendingBooking(bookingData: any) {
  if (bookingData) {
    localStorage.setItem(STORAGE_KEYS.PENDING_BOOKING, JSON.stringify(bookingData));
  } else {
    localStorage.removeItem(STORAGE_KEYS.PENDING_BOOKING);
  }
}
