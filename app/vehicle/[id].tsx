import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useVehicleStore } from '@/store/vehicleStore';
import { formatDate, getDaysRemaining, getStatusColor } from '@/utils/imageGenerator';
import ServiceRecordItem from '@/components/ServiceRecordItem';
import ReminderCard from '@/components/ReminderCard';
import colors from '@/constants/colors';
import { Calendar, Clock, Wrench, Trash2, Plus, ArrowLeft, Camera, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { 
    getVehicleById, 
    getServiceRecordsByVehicleId, 
    getRemindersByVehicleId,
    deleteVehicle,
    updateVehicleImage
  } = useVehicleStore();
  
  const [activeTab, setActiveTab] = useState<'info' | 'service' | 'reminders'>('info');
  
  const vehicle = getVehicleById(id);
  const serviceRecords = getServiceRecordsByVehicleId(id);
  const reminders = getRemindersByVehicleId(id);
  
  if (!vehicle) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Vehicle not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="white" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const licenseRemainingDays = getDaysRemaining(vehicle.licenseExpiry);
  const serviceRemainingDays = getDaysRemaining(vehicle.nextService);
  
  const licenseStatusColor = getStatusColor(licenseRemainingDays);
  const serviceStatusColor = getStatusColor(serviceRemainingDays);
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Vehicle",
      `Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteVehicle(id);
            router.replace('/');
          }
        }
      ]
    );
  };
  
  const handleAddService = () => {
    // In a real app, navigate to add service screen
    Alert.alert(
      "Add Service Record",
      "This feature would navigate to a form to add a new service record.",
      [{ text: "OK" }]
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      updateVehicleImage(id, result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      updateVehicleImage(id, result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Update Vehicle Image",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Gallery", onPress: pickImage }
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: `${vehicle.make} ${vehicle.model}`,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Trash2 size={20} color={colors.danger} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={showImageOptions} activeOpacity={0.9}>
          <Image 
            source={{ uri: vehicle.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Camera size={24} color="white" />
            <Text style={styles.imageOverlayText}>Change Image</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
              Info
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'service' && styles.activeTab]}
            onPress={() => setActiveTab('service')}
          >
            <Text style={[styles.tabText, activeTab === 'service' && styles.activeTabText]}>
              Service
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reminders' && styles.activeTab]}
            onPress={() => setActiveTab('reminders')}
          >
            <Text style={[styles.tabText, activeTab === 'reminders' && styles.activeTabText]}>
              Reminders
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'info' && (
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
              <Text style={styles.subtitle}>{vehicle.year} • {vehicle.color}</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>License Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>License Plate:</Text>
                <Text style={styles.infoValue}>{vehicle.licensePlate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Expiry Date:</Text>
                <Text style={[styles.infoValue, { color: licenseStatusColor }]}>
                  {formatDate(vehicle.licenseExpiry)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <View style={styles.statusContainer}>
                  <Calendar size={16} color={licenseStatusColor} />
                  <Text style={[styles.statusText, { color: licenseStatusColor }]}>
                    {licenseRemainingDays > 0 
                      ? `${licenseRemainingDays} days remaining` 
                      : 'Expired'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Service Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current Mileage:</Text>
                <Text style={styles.infoValue}>{vehicle.mileage.toLocaleString()} km</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Service:</Text>
                <Text style={styles.infoValue}>{formatDate(vehicle.lastService)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Next Service:</Text>
                <Text style={[styles.infoValue, { color: serviceStatusColor }]}>
                  {formatDate(vehicle.nextService)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <View style={styles.statusContainer}>
                  <Clock size={16} color={serviceStatusColor} />
                  <Text style={[styles.statusText, { color: serviceStatusColor }]}>
                    {serviceRemainingDays > 0 
                      ? `${serviceRemainingDays} days remaining` 
                      : 'Overdue'}
                  </Text>
                </View>
              </View>
            </View>
            
            {vehicle.notes && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Notes</Text>
                <Text style={styles.notes}>{vehicle.notes}</Text>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'service' && (
          <View style={styles.serviceContainer}>
            <View style={styles.serviceHeader}>
              <Text style={styles.sectionTitle}>Service History</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddService}
              >
                <Plus size={16} color="white" />
                <Text style={styles.addButtonText}>Add Service</Text>
              </TouchableOpacity>
            </View>
            
            {serviceRecords.length === 0 ? (
              <View style={styles.emptyState}>
                <Wrench size={40} color={colors.textLight} />
                <Text style={styles.emptyStateTitle}>No service records</Text>
                <Text style={styles.emptyStateMessage}>
                  Add your first service record to start tracking maintenance history.
                </Text>
              </View>
            ) : (
              serviceRecords.map((record) => (
                <ServiceRecordItem key={record.id} record={record} />
              ))
            )}
          </View>
        )}
        
        {activeTab === 'reminders' && (
          <View style={styles.remindersContainer}>
            <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
            
            {reminders.length === 0 ? (
              <View style={styles.emptyState}>
                <Calendar size={40} color={colors.textLight} />
                <Text style={styles.emptyStateTitle}>No reminders</Text>
                <Text style={styles.emptyStateMessage}>
                  There are no reminders for this vehicle.
                </Text>
              </View>
            ) : (
              reminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#e0e0e0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  imageOverlayText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
  },
  infoHeader: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  serviceContainer: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  remindersContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerButton: {
    padding: 8,
  },
});