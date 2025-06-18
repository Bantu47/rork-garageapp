import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Text, Alert } from 'react-native';
import { useVehicleStore } from '@/store/vehicleStore';
import VehicleCard from '@/components/VehicleCard';
import EmptyState from '@/components/EmptyState';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';

export default function GarageScreen() {
  const { vehicles } = useVehicleStore();
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Test the backend connection
  const { data, error, isLoading, refetch } = trpc.example.hi.useQuery(
    { name: "Garage" },
    { 
      enabled: true,
      retry: 1,
    }
  );

  // Handle error separately with useEffect
  useEffect(() => {
    if (error) {
      console.log("Backend connection error:", error);
      // Don't show alert as it's not critical for app functionality
    }
  }, [error]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // Attempt to refresh backend data
      await refetch();
    } catch (err) {
      console.log("Refresh error:", err);
    } finally {
      // In a real app, you might fetch updated data here
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  }, [refetch]);

  if (vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <EmptyState
          title="Your garage is empty"
          message="Add your first vehicle to start tracking service and license information."
          actionLabel="Add Vehicle"
          actionRoute="/add-vehicle"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
});