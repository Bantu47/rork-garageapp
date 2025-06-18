import { Stack } from 'expo-router';
import colors from '@/constants/colors';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Profile",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="account-settings" 
        options={{ 
          title: "Account Settings",
        }} 
      />
      <Stack.Screen 
        name="notification-preferences" 
        options={{ 
          title: "Notification Preferences",
        }} 
      />
      <Stack.Screen 
        name="privacy-security" 
        options={{ 
          title: "Privacy & Security",
        }} 
      />
      <Stack.Screen 
        name="help-support" 
        options={{ 
          title: "Help & Support",
        }} 
      />
      <Stack.Screen 
        name="subscription" 
        options={{ 
          title: "Subscription & Payment",
        }} 
      />
    </Stack>
  );
}