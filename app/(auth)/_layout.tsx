import { Stack } from 'expo-router';
import colors from '@/constants/colors';
import { StatusBar } from 'react-native';

export default function AuthLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
          name="login" 
          options={{ 
            title: "Login",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            title: "Create Account",
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}