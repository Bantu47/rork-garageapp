import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { usePaymentStore } from '@/store/paymentStore';
import { useVehicleStore } from '@/store/vehicleStore';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, CreditCard, Star } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { isPremium, subscriptionActive } = usePaymentStore();
  const { vehicles } = useVehicleStore();
  const router = useRouter();
  
  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          onPress: logout,
          style: "destructive"
        }
      ]
    );
  };
  
  const navigateTo = (route: string) => {
    router.push(route);
  };
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Modern garage image with black cabinets and checkered floor
  const garageImage = "https://images.unsplash.com/photo-1562141960-c9a8707ef752?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        
        <View style={styles.offerCard}>
          <ImageBackground
            source={{ uri: garageImage }}
            style={styles.offerBackground}
            resizeMode="cover"
          >
            <View style={styles.offerContent}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitials}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                  {subscriptionActive && (
                    <View style={styles.starBadge}>
                      <Star size={16} color="#FFD700" fill="#FFD700" />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        
        {/* Show subscription banner only if not subscribed */}
        {!subscriptionActive && (
          <TouchableOpacity 
            style={styles.subscriptionBanner}
            onPress={() => navigateTo('/profile/subscription')}
          >
            <View style={styles.subscriptionContent}>
              <CreditCard size={24} color="white" />
              <View style={styles.subscriptionTextContainer}>
                <Text style={styles.subscriptionTitle}>Subscribe</Text>
                <Text style={styles.subscriptionDescription}>
                  Add unlimited vehicles for just R10/month
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color="white" />
          </TouchableOpacity>
        )}
        
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/profile/account-settings')}
          >
            <Text style={styles.menuTitle}>My Account</Text>
            <ChevronRight size={24} color="#666666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/profile/notification-preferences')}
          >
            <Text style={styles.menuTitle}>Preferences</Text>
            <ChevronRight size={24} color="#666666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/profile/subscription')}
          >
            <Text style={styles.menuTitle}>
              {subscriptionActive ? "Manage Subscription" : "Subscription & Payment"}
            </Text>
            <ChevronRight size={24} color="#666666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/profile/privacy-security')}
          >
            <Text style={styles.menuTitle}>About The App</Text>
            <ChevronRight size={24} color="#666666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/profile/help-support')}
          >
            <Text style={styles.menuTitle}>Get Support</Text>
            <ChevronRight size={24} color="#666666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfoContainer}>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleLogout}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  offerCard: {
    width: '100%',
    height: 280,
    marginBottom: 16,
    borderRadius: 0,
    overflow: 'hidden',
  },
  offerBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  offerContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    position: 'relative',
  },
  profileInitials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  starBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  subscriptionBanner: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionTextContainer: {
    marginLeft: 12,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  subscriptionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 0,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuTitle: {
    fontSize: 18,
    color: colors.text,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textLight,
  },
  signOutButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  signOutButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});