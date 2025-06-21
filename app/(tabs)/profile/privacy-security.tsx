import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Switch, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Lock, Eye, Fingerprint, Save } from 'lucide-react-native';
import { isBiometricAvailable, getBiometricType, authenticateWithBiometrics } from '@/utils/biometricAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrivacySecurityScreen() {
  // Privacy settings
  const [locationTracking, setLocationTracking] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  
  // Security settings
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('None');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Check biometric availability
        const available = await isBiometricAvailable();
        setBiometricAvailable(available);
        
        if (available) {
          const type = await getBiometricType();
          setBiometricType(type);
        }
        
        // Load saved settings from AsyncStorage
        const savedSettings = await AsyncStorage.getItem('security-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setLocationTracking(settings.locationTracking || false);
          setDataCollection(settings.dataCollection || true);
          setShareAnalytics(settings.shareAnalytics || true);
          setBiometricLogin(settings.biometricLogin || false);
          setTwoFactorAuth(settings.twoFactorAuth || false);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleSave = async () => {
    try {
      // Save settings to AsyncStorage
      const settings = {
        locationTracking,
        dataCollection,
        shareAnalytics,
        biometricLogin,
        twoFactorAuth
      };
      
      await AsyncStorage.setItem('security-settings', JSON.stringify(settings));
      
      Alert.alert(
        "Settings Saved",
        "Your privacy and security settings have been updated.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to save settings. Please try again.",
        [{ text: "OK" }]
      );
    }
  };
  
  const handleBiometricToggle = async (value: boolean) => {
    if (value && biometricAvailable) {
      // If turning on, authenticate first
      const success = await authenticateWithBiometrics(
        `Authenticate to enable ${biometricType} login`
      );
      
      if (success) {
        setBiometricLogin(true);
        Alert.alert(
          "Biometric Login Enabled",
          `You can now use ${biometricType} to log in to the app.`
        );
      } else {
        // Authentication failed, don't enable
        Alert.alert(
          "Authentication Failed",
          "Biometric authentication failed. Please try again."
        );
      }
    } else {
      // If turning off, just disable
      setBiometricLogin(false);
    }
  };
  
  const handleTwoFactorToggle = async (value: boolean) => {
    if (value) {
      // Simulate 2FA setup
      Alert.alert(
        "Set Up Two-Factor Authentication",
        "In a real app, this would guide you through setting up 2FA with an authenticator app or SMS.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Continue", 
            onPress: () => {
              // Simulate successful setup
              setTimeout(() => {
                setTwoFactorAuth(true);
                Alert.alert(
                  "Two-Factor Authentication Enabled",
                  "Your account is now protected with two-factor authentication."
                );
              }, 1000);
            }
          }
        ]
      );
    } else {
      // Confirm before disabling
      Alert.alert(
        "Disable Two-Factor Authentication",
        "Are you sure you want to disable two-factor authentication? This will make your account less secure.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Disable", 
            style: "destructive",
            onPress: () => setTwoFactorAuth(false)
          }
        ]
      );
    }
  };
  
  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "This would navigate to a change password screen in a real app.",
      [{ text: "OK" }]
    );
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            <Text style={styles.sectionDescription}>
              Control how your data is used within the app
            </Text>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Eye size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>Location Tracking</Text>
                  <Text style={styles.optionDescription}>
                    Allow the app to track your location
                  </Text>
                </View>
              </View>
              <Switch
                value={locationTracking}
                onValueChange={setLocationTracking}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Shield size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>Data Collection</Text>
                  <Text style={styles.optionDescription}>
                    Allow the app to collect usage data
                  </Text>
                </View>
              </View>
              <Switch
                value={dataCollection}
                onValueChange={setDataCollection}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Shield size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>Share Analytics</Text>
                  <Text style={styles.optionDescription}>
                    Share anonymous usage data to improve the app
                  </Text>
                </View>
              </View>
              <Switch
                value={shareAnalytics}
                onValueChange={setShareAnalytics}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            <Text style={styles.sectionDescription}>
              Enhance the security of your account
            </Text>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Fingerprint size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>
                    {biometricType} Login
                    {!biometricAvailable && " (Not Available)"}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {biometricAvailable 
                      ? `Use ${biometricType.toLowerCase()} to log in to the app`
                      : "Your device doesn't support biometric authentication"}
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricLogin}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
                disabled={!biometricAvailable}
              />
            </View>
            
            <View style={styles.optionContainer}>
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIconContainer}>
                  <Lock size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>Two-Factor Authentication</Text>
                  <Text style={styles.optionDescription}>
                    Add an extra layer of security to your account
                  </Text>
                </View>
              </View>
              <Switch
                value={twoFactorAuth}
                onValueChange={handleTwoFactorToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.passwordButton}
              onPress={handleChangePassword}
            >
              <View style={styles.optionIconContainer}>
                <Lock size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.optionLabel}>Change Password</Text>
                <Text style={styles.optionDescription}>
                  Update your account password
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
          
          <View style={styles.dangerZone}>
            <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert(
                  "Delete Account",
                  "Are you sure you want to delete your account? This action cannot be undone.",
                  [
                    { text: "Cancel", style: "cancel" },
                    { 
                      text: "Delete", 
                      style: "destructive",
                      onPress: () => {
                        Alert.alert(
                          "Account Deletion",
                          "In a real app, your account would be scheduled for deletion."
                        );
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
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
  passwordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
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
  dangerZone: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});