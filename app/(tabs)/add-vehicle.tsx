import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVehicleStore } from '@/store/vehicleStore';
import { usePaymentStore } from '@/store/paymentStore';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Camera, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import PaymentModal from '@/components/PaymentModal';

export default function AddVehicleScreen() {
  const router = useRouter();
  const { addVehicle } = useVehicleStore();
  const { freeVehiclesRemaining, subscriptionActive } = usePaymentStore();
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [mileage, setMileage] = useState('');
  const [lastService, setLastService] = useState('');
  const [nextService, setNextService] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  
  // Check if user can add more vehicles
  const canAddMoreVehicles = freeVehiclesRemaining > 0 || subscriptionActive;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!make) newErrors.make = 'Make is required';
    if (!model) newErrors.model = 'Model is required';
    if (!year) newErrors.year = 'Year is required';
    else if (!/^\d{4}$/.test(year)) newErrors.year = 'Enter a valid year (YYYY)';
    
    if (!color) newErrors.color = 'Color is required';
    if (!licensePlate) newErrors.licensePlate = 'License plate is required';
    
    if (!licenseExpiry) newErrors.licenseExpiry = 'License expiry date is required';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(licenseExpiry)) {
      newErrors.licenseExpiry = 'Use format YYYY-MM-DD';
    }
    
    if (!mileage) newErrors.mileage = 'Current mileage is required';
    else if (!/^\d+$/.test(mileage)) newErrors.mileage = 'Enter a valid number';
    
    if (lastService && !/^\d{4}-\d{2}-\d{2}$/.test(lastService)) {
      newErrors.lastService = 'Use format YYYY-MM-DD';
    }
    
    if (!nextService) newErrors.nextService = 'Next service date is required';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(nextService)) {
      newErrors.nextService = 'Use format YYYY-MM-DD';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to reset the form
  const resetForm = () => {
    setMake('');
    setModel('');
    setYear('');
    setColor('');
    setLicensePlate('');
    setLicenseExpiry('');
    setMileage('');
    setLastService('');
    setNextService('');
    setNotes('');
    setImage(null);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!canAddMoreVehicles) {
      setPaymentModalVisible(true);
      return;
    }
    
    try {
      const vehicle = await addVehicle({
        make,
        model,
        year: parseInt(year),
        color,
        licensePlate,
        licenseExpiry,
        lastService: lastService || new Date().toISOString().split('T')[0],
        nextService,
        mileage: parseInt(mileage),
        notes,
        customImage: image
      });
      
      if (vehicle) {
        Alert.alert(
          "Success",
          "Vehicle added successfully!",
          [{ 
            text: "OK", 
            onPress: () => {
              resetForm(); // Reset the form after successful addition
              router.push('/');
            }
          }]
        );
      } else {
        // This shouldn't happen since we check for slots before, but just in case
        setPaymentModalVisible(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add vehicle. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    // After successful payment, try to add the vehicle again
    handleSubmit();
  };

  // Reset form when component mounts
  useEffect(() => {
    resetForm();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Add New Vehicle</Text>
          
          {!canAddMoreVehicles && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>
                You've reached the limit of 3 free vehicles. Subscribe for R10/month to add unlimited vehicles.
              </Text>
              <TouchableOpacity 
                style={styles.purchaseButton}
                onPress={() => setPaymentModalVisible(true)}
              >
                <Text style={styles.purchaseButtonText}>Subscribe with Payfast</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.imageSection}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Upload size={40} color={colors.textLight} />
                <Text style={styles.imagePlaceholderText}>Add vehicle image</Text>
              </View>
            )}
            
            <View style={styles.imageButtons}>
              <TouchableOpacity 
                style={styles.imageButton}
                onPress={pickImage}
              >
                <Upload size={18} color="white" />
                <Text style={styles.imageButtonText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imageButton}
                onPress={takePhoto}
              >
                <Camera size={18} color="white" />
                <Text style={styles.imageButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Make</Text>
            <TextInput
              style={[styles.input, errors.make && styles.inputError]}
              value={make}
              onChangeText={setMake}
              placeholder="e.g. Toyota"
              placeholderTextColor={colors.textLight}
            />
            {errors.make && <Text style={styles.errorText}>{errors.make}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={[styles.input, errors.model && styles.inputError]}
              value={model}
              onChangeText={setModel}
              placeholder="e.g. Corolla"
              placeholderTextColor={colors.textLight}
            />
            {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Year</Text>
              <TextInput
                style={[styles.input, errors.year && styles.inputError]}
                value={year}
                onChangeText={setYear}
                placeholder="YYYY"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                maxLength={4}
              />
              {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={[styles.input, errors.color && styles.inputError]}
                value={color}
                onChangeText={setColor}
                placeholder="e.g. Blue"
                placeholderTextColor={colors.textLight}
              />
              {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>License Plate</Text>
            <TextInput
              style={[styles.input, errors.licensePlate && styles.inputError]}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="e.g. ABC123"
              placeholderTextColor={colors.textLight}
              autoCapitalize="characters"
            />
            {errors.licensePlate && <Text style={styles.errorText}>{errors.licensePlate}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>License Expiry Date</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[
                  styles.input, 
                  styles.dateInput, 
                  errors.licenseExpiry && styles.inputError
                ]}
                value={licenseExpiry}
                onChangeText={setLicenseExpiry}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textLight}
              />
              <Calendar size={20} color={colors.textLight} style={styles.dateIcon} />
            </View>
            {errors.licenseExpiry && <Text style={styles.errorText}>{errors.licenseExpiry}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Current Mileage (km)</Text>
            <TextInput
              style={[styles.input, errors.mileage && styles.inputError]}
              value={mileage}
              onChangeText={setMileage}
              placeholder="e.g. 50000"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
            />
            {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Service Date (optional)</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[
                  styles.input, 
                  styles.dateInput, 
                  errors.lastService && styles.inputError
                ]}
                value={lastService}
                onChangeText={setLastService}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textLight}
              />
              <Calendar size={20} color={colors.textLight} style={styles.dateIcon} />
            </View>
            {errors.lastService && <Text style={styles.errorText}>{errors.lastService}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Next Service Date</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[
                  styles.input, 
                  styles.dateInput, 
                  errors.nextService && styles.inputError
                ]}
                value={nextService}
                onChangeText={setNextService}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textLight}
              />
              <Calendar size={20} color={colors.textLight} style={styles.dateIcon} />
            </View>
            {errors.nextService && <Text style={styles.errorText}>{errors.nextService}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional information about your vehicle"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Add Vehicle</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSuccess={handlePaymentSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  warningBanner: {
    backgroundColor: '#332700',
    borderWidth: 1,
    borderColor: '#554400',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  warningText: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 12,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  imageSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: colors.textLight,
    fontSize: 16,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  imageButtonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  dateInputContainer: {
    position: 'relative',
  },
  dateInput: {
    paddingRight: 40,
  },
  dateIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});