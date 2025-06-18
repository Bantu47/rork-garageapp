import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { usePaymentStore } from '@/store/paymentStore';
import colors from '@/constants/colors';
import { CreditCard, X, Calendar, Lock, CheckCircle } from 'lucide-react-native';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Payment flow steps
enum PaymentStep {
  DETAILS,
  PROCESSING,
  CONFIRMATION
}

export default function PaymentModal({ visible, onClose, onSuccess }: PaymentModalProps) {
  const { subscribeMonthly } = usePaymentStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>(PaymentStep.DETAILS);
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  
  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const limit = 16;
    const formatted = cleaned.substring(0, limit).replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };
  
  // Format card expiry as MM/YY
  const formatCardExpiry = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    
    setCardExpiry(formatted);
  };
  
  // Validate card details
  const validateCardDetails = () => {
    if (cardNumber.replace(/\s+/g, '').length < 16) {
      Alert.alert('Invalid Card', 'Please enter a valid card number');
      return false;
    }
    
    if (cardExpiry.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (cardCvc.length < 3) {
      Alert.alert('Invalid CVC', 'Please enter a valid CVC code');
      return false;
    }
    
    if (!cardName.trim()) {
      Alert.alert('Missing Name', 'Please enter the name on your card');
      return false;
    }
    
    return true;
  };
  
  const handlePayment = async () => {
    if (!validateCardDetails()) return;
    
    setPaymentStep(PaymentStep.PROCESSING);
    setIsProcessing(true);
    
    try {
      // Simulate API call to Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process the subscription
      const result = await subscribeMonthly();
      
      if (result.success) {
        setPaymentStep(PaymentStep.CONFIRMATION);
      } else {
        Alert.alert("Payment Failed", result.message);
        setPaymentStep(PaymentStep.DETAILS);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setPaymentStep(PaymentStep.DETAILS);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleClose = () => {
    // Reset state
    setPaymentStep(PaymentStep.DETAILS);
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setCardName('');
    onClose();
  };
  
  const handleSuccess = () => {
    handleClose();
    onSuccess();
  };
  
  const renderPaymentDetails = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <CreditCard size={48} color={colors.primary} />
          </View>
          
          <Text style={styles.description}>
            Subscribe for R10/month to add unlimited vehicles to your garage.
          </Text>
          
          <View style={styles.subscriptionDetails}>
            <View style={styles.detailRow}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.detailText}>Monthly billing</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Cancel anytime</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Unlimited vehicle slots</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Monthly fee:</Text>
            <Text style={styles.price}>R10.00</Text>
          </View>
          
          <View style={styles.paymentForm}>
            <Text style={styles.formLabel}>Card Information</Text>
            
            <View style={styles.cardNumberContainer}>
              <TextInput
                style={styles.cardNumberInput}
                placeholder="Card number"
                placeholderTextColor={colors.textLight}
                value={cardNumber}
                onChangeText={formatCardNumber}
                keyboardType="number-pad"
                maxLength={19} // 16 digits + 3 spaces
              />
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png' }} 
                style={styles.cardBrandIcon} 
                resizeMode="contain"
              />
            </View>
            
            <View style={styles.cardDetailsRow}>
              <View style={styles.cardExpiryContainer}>
                <TextInput
                  style={styles.cardExpiryInput}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textLight}
                  value={cardExpiry}
                  onChangeText={formatCardExpiry}
                  keyboardType="number-pad"
                  maxLength={5} // MM/YY
                />
              </View>
              
              <View style={styles.cardCvcContainer}>
                <TextInput
                  style={styles.cardCvcInput}
                  placeholder="CVC"
                  placeholderTextColor={colors.textLight}
                  value={cardCvc}
                  onChangeText={setCardCvc}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
            
            <View style={styles.cardNameContainer}>
              <TextInput
                style={styles.cardNameInput}
                placeholder="Name on card"
                placeholderTextColor={colors.textLight}
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.saveCardContainer}>
              <TouchableOpacity 
                style={styles.saveCardCheckbox}
                onPress={() => setSaveCard(!saveCard)}
              >
                {saveCard ? (
                  <CheckCircle size={20} color={colors.primary} />
                ) : (
                  <View style={styles.uncheckedBox} />
                )}
              </TouchableOpacity>
              <Text style={styles.saveCardText}>Save card for future payments</Text>
            </View>
          </View>
          
          <View style={styles.securePaymentContainer}>
            <Lock size={16} color={colors.textLight} />
            <Text style={styles.securePaymentText}>
              Payments are secure and encrypted
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.payButton}
            onPress={handlePayment}
          >
            <Text style={styles.payButtonText}>Pay R10.00</Text>
          </TouchableOpacity>
          
          <View style={styles.stripeContainer}>
            <Text style={styles.poweredByText}>Powered by</Text>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png' }} 
              style={styles.stripeLogo} 
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.disclaimer}>
            This is a demo app. No actual payment will be processed.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
  
  const renderProcessing = () => (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.processingText}>Processing your payment...</Text>
      <Text style={styles.processingSubtext}>Please do not close this screen</Text>
    </View>
  );
  
  const renderConfirmation = () => (
    <View style={styles.confirmationContainer}>
      <View style={styles.successIconContainer}>
        <CheckCircle size={64} color={colors.success} />
      </View>
      
      <Text style={styles.confirmationTitle}>Payment Successful!</Text>
      <Text style={styles.confirmationText}>
        Your subscription has been activated. You can now add unlimited vehicles to your garage.
      </Text>
      
      <View style={styles.receiptContainer}>
        <Text style={styles.receiptTitle}>Receipt</Text>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Plan:</Text>
          <Text style={styles.receiptValue}>Monthly Subscription</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Amount:</Text>
          <Text style={styles.receiptValue}>R10.00</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Date:</Text>
          <Text style={styles.receiptValue}>{new Date().toLocaleDateString()}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Payment Method:</Text>
          <Text style={styles.receiptValue}>•••• {cardNumber.slice(-4)}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.doneButton}
        onPress={handleSuccess}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          paymentStep === PaymentStep.DETAILS && styles.detailsContainer
        ]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {paymentStep === PaymentStep.DETAILS && "Subscription Payment"}
              {paymentStep === PaymentStep.PROCESSING && "Processing"}
              {paymentStep === PaymentStep.CONFIRMATION && "Payment Complete"}
            </Text>
            {paymentStep !== PaymentStep.PROCESSING && (
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
          
          {paymentStep === PaymentStep.DETAILS && renderPaymentDetails()}
          {paymentStep === PaymentStep.PROCESSING && renderProcessing()}
          {paymentStep === PaymentStep.CONFIRMATION && renderConfirmation()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '90%',
  },
  detailsContainer: {
    maxHeight: '80%',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  subscriptionDetails: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.text,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  paymentForm: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: colors.inputBackground,
  },
  cardNumberInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  cardBrandIcon: {
    width: 40,
    height: 25,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardExpiryContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: colors.inputBackground,
  },
  cardExpiryInput: {
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  cardCvcContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
    backgroundColor: colors.inputBackground,
  },
  cardCvcInput: {
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  cardNameContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: colors.inputBackground,
  },
  cardNameInput: {
    height: 50,
    fontSize: 16,
    color: colors.text,
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveCardCheckbox: {
    marginRight: 8,
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
  },
  saveCardText: {
    fontSize: 14,
    color: colors.text,
  },
  securePaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  securePaymentText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stripeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  poweredByText: {
    fontSize: 12,
    color: colors.textLight,
    marginRight: 4,
  },
  stripeLogo: {
    width: 60,
    height: 25,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  processingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  processingSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  confirmationContainer: {
    padding: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  receiptContainer: {
    width: '100%',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  receiptValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});