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
import { Shield, Lock, Eye, Fingerprint, Save } from 'lucide-react-native';

export default function PrivacySecurityScreen() {
  // Privacy settings
  const [locationTracking, setLocationTracking] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  
  // Security settings
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  const handleSave = () => {
    // In a real app, this would save privacy and security settings
    Alert.alert(
      "Settings Saved",
      "Your privacy and security settings have been updated.",
      [{ text: "OK" }]
    );
  };
  
  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "This would navigate to a change password screen in a real app.",
      [{ text: "OK" }]
    );
  };
  
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
                  <Text style={styles.optionLabel}>Biometric Login</Text>
                  <Text style={styles.optionDescription}>
                    Use fingerprint or face recognition to login
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricLogin}
                onValueChange={setBiometricLogin}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : 'white'}
                ios_backgroundColor={colors.border}
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
                onValueChange={setTwoFactorAuth}
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