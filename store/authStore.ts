import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials & { rememberMe?: boolean }) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateTwoFactorStatus: (enabled: boolean) => void;
}

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
    twoFactorEnabled: false,
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials & { rememberMe?: boolean }) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user by email
          const user = MOCK_USERS.find(u => u.email === credentials.email);
          
          // In a real app, you would verify the password here
          // For demo, we'll just check if the email exists and password is "password"
          if (user && credentials.password === 'password') {
            // Check if 2FA is enabled
            if (user.twoFactorEnabled) {
              // In a real app, this would trigger a 2FA verification flow
              // For demo, we'll just simulate it with a delay
              await new Promise(resolve => setTimeout(resolve, 1000));
              console.log('2FA verification would happen here');
            }
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            });
            
            // If rememberMe is false, we would handle that differently in a real app
            // For this demo, we'll just log it
            console.log(`User logged in with remember me: ${credentials.rememberMe ? 'enabled' : 'disabled'}`);
          } else {
            // If no user found or password incorrect
            set({ 
              isLoading: false, 
              error: 'Invalid email or password' 
            });
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: 'An error occurred during login' 
          });
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validate passwords match
          if (credentials.password !== credentials.confirmPassword) {
            set({ 
              isLoading: false, 
              error: 'Passwords do not match' 
            });
            return;
          }
          
          // Check if email already exists
          const existingUser = MOCK_USERS.find(u => u.email === credentials.email);
          if (existingUser) {
            set({ 
              isLoading: false, 
              error: 'Email already in use' 
            });
            return;
          }
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create new user
          const newUser: User = {
            id: (MOCK_USERS.length + 1).toString(),
            email: credentials.email,
            name: credentials.name,
            createdAt: new Date().toISOString(),
            twoFactorEnabled: false,
          };
          
          // Add to mock users (in a real app, this would be an API call)
          MOCK_USERS.push(newUser);
          
          // Set as current user
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: 'An error occurred during registration' 
          });
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      clearError: () => {
        set({ error: null });
      },
      
      updateTwoFactorStatus: (enabled: boolean) => {
        const { user } = get();
        
        if (user) {
          // Update the user in the store
          set({ 
            user: { 
              ...user, 
              twoFactorEnabled: enabled 
            } 
          });
          
          // Also update the user in the mock database
          const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            MOCK_USERS[userIndex].twoFactorEnabled = enabled;
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);