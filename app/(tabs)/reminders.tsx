import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useVehicleStore } from '@/store/vehicleStore';
import ReminderCard from '@/components/ReminderCard';
import EmptyState from '@/components/EmptyState';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RemindersScreen() {
  const { reminders, vehicles } = useVehicleStore();
  const [showCompleted, setShowCompleted] = useState(false);
  
  const filteredReminders = reminders.filter(reminder => 
    showCompleted ? true : !reminder.isCompleted
  );

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  if (vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <EmptyState
          title="No vehicles added"
          message="Add your first vehicle to start tracking reminders."
          actionLabel="Add Vehicle"
          actionRoute="/add-vehicle"
        />
      </SafeAreaView>
    );
  }

  if (filteredReminders.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <EmptyState
          title={showCompleted ? "No reminders" : "No active reminders"}
          message={showCompleted 
            ? "You don't have any reminders yet." 
            : "You don't have any active reminders. Toggle to show completed ones."}
          actionLabel={null}
          actionRoute={null}
        />
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={toggleShowCompleted}
        >
          <Text style={styles.toggleButtonText}>
            {showCompleted ? "Hide Completed" : "Show Completed"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {showCompleted ? "All Reminders" : "Active Reminders"}
        </Text>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={toggleShowCompleted}
        >
          <Text style={styles.toggleButtonText}>
            {showCompleted ? "Hide Completed" : "Show Completed"}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredReminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReminderCard reminder={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  toggleButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
});