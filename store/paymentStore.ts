import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentState, Transaction, PurchaseResult } from '@/types/payment';

interface PaymentStore extends PaymentState {
  subscribeMonthly: () => Promise<PurchaseResult>;
  cancelSubscription: () => void;
  canAddVehicle: () => boolean;
  resetFreeVehicles: () => void; // For testing purposes
}

const FREE_VEHICLE_LIMIT = 3;
const MONTHLY_SUBSCRIPTION_PRICE = 10; // R10 per month

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      isPremium: false,
      freeVehiclesRemaining: FREE_VEHICLE_LIMIT,
      subscriptionActive: false,
      subscriptionStartDate: null,
      subscriptionRenewalDate: null,
      transactionHistory: [],

      subscribeMonthly: async () => {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const now = new Date();
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        
        // Mock successful payment
        const transaction: Transaction = {
          id: Date.now().toString(),
          date: now.toISOString(),
          amount: MONTHLY_SUBSCRIPTION_PRICE,
          description: "Monthly subscription - Unlimited vehicles",
          status: 'completed',
          type: 'subscription'
        };
        
        set({
          isPremium: true,
          subscriptionActive: true,
          subscriptionStartDate: now.toISOString(),
          subscriptionRenewalDate: renewalDate.toISOString(),
          transactionHistory: [transaction, ...get().transactionHistory]
        });
        
        return {
          success: true,
          message: "Subscription activated! You can now add unlimited vehicles.",
          transaction
        };
      },
      
      cancelSubscription: () => {
        set({
          subscriptionActive: false,
          subscriptionRenewalDate: null
        });
      },
      
      canAddVehicle: () => {
        const state = get();
        
        // If subscription is active, user can add unlimited vehicles
        if (state.subscriptionActive) {
          return true;
        }
        
        // If there are free vehicles remaining, user can add a vehicle
        if (state.freeVehiclesRemaining > 0) {
          set(state => ({
            freeVehiclesRemaining: state.freeVehiclesRemaining - 1
          }));
          return true;
        }
        
        // No free vehicles remaining and no subscription
        return false;
      },
      
      resetFreeVehicles: () => {
        set({
          freeVehiclesRemaining: FREE_VEHICLE_LIMIT
        });
      }
    }),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);