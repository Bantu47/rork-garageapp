import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

/**
 * Check if biometric authentication is available on the device
 */
export const isBiometricAvailable = async (): Promise<boolean> => {
  // On web, biometric authentication is not available
  if (Platform.OS === 'web') {
    return false;
  }
  
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    return hasHardware && isEnrolled;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
};

/**
 * Get the type of biometric authentication available on the device
 */
export const getBiometricType = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    return 'None';
  }
  
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Fingerprint';
    } else {
      return 'None';
    }
  } catch (error) {
    console.error('Error getting biometric type:', error);
    return 'None';
  }
};

/**
 * Authenticate using biometrics
 */
export const authenticateWithBiometrics = async (
  promptMessage: string = 'Authenticate to continue'
): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return false;
  }
  
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use passcode',
      disableDeviceFallback: false,
    });
    
    return result.success;
  } catch (error) {
    console.error('Error during biometric authentication:', error);
    return false;
  }
};