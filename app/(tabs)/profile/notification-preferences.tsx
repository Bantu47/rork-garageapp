import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Switch, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Calendar, Clock, Car, Save } from 'lucide-react-native';

export default function NotificationPreferencesScreen() {
  // Notification settings
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  
  // Notification types
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [serviceNotifications, setServiceNotifications] = useState(true);
  const [licenseNotifications, setLicenseNotifications] = useState(true);
  const [vehicleUpdates, setVehicleUpdates] = useState(false);
  
  const handleSave = () => {
    // In a real app, this would save notification preferences
    Alert.alert(
      "Preferences Saved",
      "Your notification preferences have been updated.",
      [{ text: "OK" }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Methods</Text>
            <Text style={styles.sectionDescription}>
              Choose how you want to receive notifications
            </Text>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <Text style={styles.optionLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <Text style={styles.optionLabel}>Email Notifications</Text>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <Text style={styles.optionLabel}>SMS Notifications</Text>
              </View>
              <Switch
                value={smsEnabled}
                onValueChange={setSmsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Types</Text>
            <Text style={styles.sectionDescription}>
              Select which types of notifications you want to receive
            </Text>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Calendar size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>Reminders</Text>
                  <Text style={styles.optionDescription}>
                    General reminders about your vehicles
                  </Text>
                </View>
              </View>
              <Switch
                value={reminderNotifications}
                onValueChange={setReminderNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Clock size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>Service Due</Text>
                  <Text style={styles.optionDescription}>
                    Notifications about upcoming service dates
                  </Text>
                </View>
              </View>
              <Switch
                value={serviceNotifications}
                onValueChange={setServiceNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Calendar size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>License Renewal</Text>
                  <Text style={styles.optionDescription}>
                    Notifications about license expiration dates
                  </Text>
                </View>
              </View>
              <Switch
                value={licenseNotifications}
                onValueChange={setLicenseNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Car size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>Vehicle Updates</Text>
                  <Text style={styles.optionDescription}>
                    News and updates about your vehicle models
                  </Text>
                </View>
              </View>
              <Switch
                value={vehicleUpdates}
                onValueChange={setVehicleUpdates}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});