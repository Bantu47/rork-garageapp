export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  licenseExpiry: string; // ISO date string
  lastService: string; // ISO date string
  nextService: string; // ISO date string
  mileage: number;
  notes: string;
  imageUrl: string;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string; // ISO date string
  type: string;
  mileage: number;
  notes: string;
  cost: number;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  type: 'service' | 'license';
  dueDate: string; // ISO date string
  title: string;
  description: string;
  isCompleted: boolean;
}