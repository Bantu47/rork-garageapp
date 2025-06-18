import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Reminder } from '@/types/vehicle';
import { formatDate, getDaysRemaining, getStatusColor } from '@/utils/imageGenerator';
import { useVehicleStore } from '@/store/vehicleStore';
import colors from '@/constants/colors';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react-native';

interface ReminderCardProps {
  reminder: Reminder;
}

export default function ReminderCard({ reminder }: ReminderCardProps) {
  const router = useRouter();
  const { getVehicleById, completeReminder } = useVehicleStore();
  
  const vehicle = getVehicleById(reminder.vehicleId);
  const daysRemaining = getDaysRemaining(reminder.dueDate);
  const statusColor = getStatusColor(daysRemaining);
  
  const handlePress = () => {
    router.push(`/vehicle/${reminder.vehicleId}`);
  };
  
  const handleComplete = () => {
    completeReminder(reminder.id);
  };

  if (!vehicle) return null;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            {reminder.type === 'license' ? (
              <Calendar size={18} color={statusColor} />
            ) : (
              <AlertCircle size={18} color={statusColor} />
            )}
            <Text style={[styles.type, { color: statusColor }]}>
              {reminder.type === 'license' ? 'License Renewal' : 'Service Due'}
            </Text>
          </View>
          
          {!reminder.isCompleted && (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleComplete}
            >
              <CheckCircle size={20} color={colors.success} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.title}>{reminder.title}</Text>
          <Text style={styles.vehicle}>{vehicle.make} {vehicle.model} • {vehicle.licensePlate}</Text>
          <Text style={styles.description}>{reminder.description}</Text>
          
          <View style={styles.dateContainer}>
            <Text style={[styles.date, { color: statusColor }]}>
              Due: {formatDate(reminder.dueDate)}
              {daysRemaining > 0 
                ? ` (${daysRemaining} days remaining)` 
                : ' (Overdue)'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {reminder.isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  completeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  vehicle: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  dateContainer: {
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  completedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});