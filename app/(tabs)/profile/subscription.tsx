import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Alert,
  Image
} from 'react-native';
import { usePaymentStore } from '@/store/paymentStore';
import { useVehicleStore } from '@/store/vehicleStore';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Shield, Star } from 'lucide-react-native';
import { formatDate } from '@/utils/imageGenerator';
import PaymentModal from '@/components/PaymentModal';
import { Transaction } from '@/types/payment';

export default function SubscriptionScreen() {
  const { 
    isPremium, 
    freeVehiclesRemaining, 
    subscriptionActive,
    subscriptionRenewalDate,
    transactionHistory,
    cancelSubscription,
    subscribeMonthly
  } = usePaymentStore();
  const { vehicles } = useVehicleStore();
  const [paymentModalVisible, setPaymentModalVisible] = React.useState(false);
  
  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.transactionAmount}>R{item.amount.toFixed(2)}</Text>
    </View>
  );
  
  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription? You'll still have access until the end of your billing period.",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: () => {
            cancelSubscription();
            Alert.alert(
              "Subscription Cancelled",
              "Your subscription has been cancelled. You'll have access until the end of your current billing period."
            );
          }
        }
      ]
    );
  };

  const handleSubscribe = () => {
    setPaymentModalVisible(true);
  };
  
  const handlePaymentSuccess = async () => {
    try {
      await subscribeMonthly();
      Alert.alert(
        "Subscription Activated",
        "Your subscription has been activated successfully. You can now add unlimited vehicles."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error processing your subscription. Please try again."
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {subscriptionActive && (
            <View style={styles.premiumBadge}>
              <Star size={20} color="#FFD700" fill="#FFD700" />
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          )}
          
          <View style={styles.subscriptionCard}>
            <Text style={styles.subscriptionTitle}>Garage Premium</Text>
            <Text style={styles.subscriptionDescription}>
              Unlock unlimited vehicle storage and premium features
            </Text>
            
            <View style={styles.pricingContainer}>
              <Text style={styles.price}>R10</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <CreditCard size={20} color={colors.primary} />
                <Text style={styles.featureText}>Unlimited vehicles</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Shield size={20} color={colors.primary} />
                <Text style={styles.featureText}>Premium support</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Car size={20} color={colors.primary} />
                <Text style={styles.featureText}>Advanced vehicle tracking</Text>
              </View>
            </View>
            
            {subscriptionActive ? (
              <View style={styles.activeSubscriptionContainer}>
                <Text style={styles.activeSubscriptionText}>
                  Your subscription is active
                </Text>
                {subscriptionRenewalDate && (
                  <Text style={styles.renewalDateText}>
                    Next billing date: {formatDate(subscriptionRenewalDate)}
                  </Text>
                )}
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelSubscription}
                >
                  <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity 
                  style={styles.subscribeButton}
                  onPress={handleSubscribe}
                >
                  <Text style={styles.subscribeButtonText}>Subscribe</Text>
                </TouchableOpacity>
                
                <View style={styles.payfastLogoContainer}>
                  <Image 
                    source={{ uri: 'https://www.payfast.co.za/assets/images/payfast-logo.svg' }} 
                    style={styles.payfastLogo} 
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.freeVehiclesCard}>
            <Text style={styles.freeVehiclesTitle}>Free Plan</Text>
            <Text style={styles.freeVehiclesDescription}>
              You can add up to 2 vehicles with the free plan
            </Text>
            <View style={styles.freeVehiclesStatus}>
              <Text style={styles.freeVehiclesText}>
                {vehicles.length} of 2 vehicles used
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${Math.min((vehicles.length / 2) * 100, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.freeVehiclesRemaining}>
                {Math.max(2 - vehicles.length, 0)} free slots remaining
              </Text>
            </View>
          </View>
          
          {transactionHistory.length > 0 && (
            <View style={styles.transactionsCard}>
              <Text style={styles.transactionsTitle}>Transaction History</Text>
              
              <FlatList
                data={transactionHistory}
                renderItem={renderTransactionItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
      
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSuccess={handlePaymentSuccess}
      />
    </SafeAreaView>
  );
}

// Import Car icon from lucide-react-native
import { Car } from 'lucide-react-native';

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
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  premiumText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  subscriptionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subscriptionDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pricePeriod: {
    fontSize: 16,
    color: colors.textLight,
    marginLeft: 4,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  activeSubscriptionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  activeSubscriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 8,
  },
  renewalDateText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  payfastLogoContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  payfastLogo: {
    width: 120,
    height: 30,
  },
  freeVehiclesCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  freeVehiclesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  freeVehiclesDescription: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  freeVehiclesStatus: {
    width: '100%',
  },
  freeVehiclesText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  freeVehiclesRemaining: {
    fontSize: 14,
    color: colors.textLight,
  },
  transactionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});