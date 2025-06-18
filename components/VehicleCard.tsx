import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Vehicle } from '@/types/vehicle';
import { formatDate, getDaysRemaining, getStatusColor } from '@/utils/imageGenerator';
import colors from '@/constants/colors';
import { Calendar, Clock } from 'lucide-react-native';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter();
  
  const licenseRemainingDays = getDaysRemaining(vehicle.licenseExpiry);
  const serviceRemainingDays = getDaysRemaining(vehicle.nextService);
  
  const licenseStatusColor = getStatusColor(licenseRemainingDays);
  const serviceStatusColor = getStatusColor(serviceRemainingDays);

  const handlePress = () => {
    router.push(`/vehicle/${vehicle.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: vehicle.imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
        <Text style={styles.subtitle}>{vehicle.year} • {vehicle.color}</Text>
        <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
        
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Calendar size={16} color={licenseStatusColor} />
            <Text style={[styles.statusText, { color: licenseStatusColor }]}>
              License: {formatDate(vehicle.licenseExpiry)}
              {licenseRemainingDays > 0 
                ? ` (${licenseRemainingDays} days)` 
                : ' (Expired)'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Clock size={16} color={serviceStatusColor} />
            <Text style={[styles.statusText, { color: serviceStatusColor }]}>
              Service: {formatDate(vehicle.nextService)}
              {serviceRemainingDays > 0 
                ? ` (${serviceRemainingDays} days)` 
                : ' (Overdue)'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  licensePlate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 8,
  },
});