import React from 'react';
import { Tabs } from 'expo-router';
import colors from '@/constants/colors';
import { Car, Bell, Plus, User } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { usePaymentStore } from '@/store/paymentStore';

export default function TabLayout() {
  const router = useRouter();
  const { subscriptionActive } = usePaymentStore();
  
  const navigateToProfile = () => {
    router.navigate('/(tabs)/profile');
  };
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Garage",
          tabBarIcon: ({ color }) => <Car size={24} color={color} />,
          headerRight: () => (
            <TouchableOpacity 
              onPress={navigateToProfile}
              style={{ marginRight: 16 }}
            >
              <User size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Reminders",
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
          headerRight: () => (
            <TouchableOpacity 
              onPress={navigateToProfile}
              style={{ marginRight: 16 }}
            >
              <User size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      {!subscriptionActive && (
        <Tabs.Screen
          name="add-vehicle"
          options={{
            title: "Add Vehicle",
            tabBarIcon: ({ color }) => <Plus size={24} color={color} />,
            tabBarLabel: "Add",
            headerRight: () => (
              <TouchableOpacity 
                onPress={navigateToProfile}
                style={{ marginRight: 16 }}
              >
                <User size={24} color={colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}