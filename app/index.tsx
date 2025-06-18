import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect based on authentication status
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}