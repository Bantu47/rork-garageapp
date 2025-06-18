export interface PaymentState {
  isPremium: boolean;
  freeVehiclesRemaining: number;
  subscriptionActive: boolean;
  subscriptionStartDate: string | null;
  subscriptionRenewalDate: string | null;
  transactionHistory: Transaction[];
}

export interface Transaction {
  id: string;
  date: string; // ISO date string
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'subscription' | 'one-time';
}

export interface PurchaseResult {
  success: boolean;
  message: string;
  transaction?: Transaction;
}