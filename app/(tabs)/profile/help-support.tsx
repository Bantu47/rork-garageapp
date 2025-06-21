import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Modal
} from 'react-native';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelpCircle, FileText, ExternalLink, ChevronRight, X, ChevronDown } from 'lucide-react-native';

// FAQ data
const faqData = [
  {
    question: "How do I add a new vehicle?",
    answer: "To add a new vehicle, tap on the 'Add' tab in the bottom navigation bar. Fill in the required details about your vehicle including make, model, year, color, license plate, and service information. You can also add a photo of your vehicle. After completing the form, tap 'Add Vehicle' to save it to your garage."
  },
  {
    question: "How do I set up reminders?",
    answer: "Reminders are automatically created when you add a vehicle. Two reminders are created by default: one for license renewal based on the expiry date you enter, and another for vehicle service based on the next service date. You can view all your reminders in the 'Reminders' tab and mark them as completed when done."
  },
  {
    question: "How do I track service history?",
    answer: "You can track service history by viewing the 'Service' tab on your vehicle's detail page. To add a service record, open your vehicle details, tap on the 'Service' tab, and then tap 'Add Service'. Enter the service details including date, type, mileage, cost, and any notes. Your service history will be displayed in chronological order."
  },
  {
    question: "What is the subscription model?",
    answer: "The app allows you to add up to 2 vehicles for free. After that, you'll need to subscribe for R10 per month to add unlimited vehicles to your garage. The subscription is billed monthly and can be canceled at any time. You'll maintain access until the end of your billing period."
  },
  {
    question: "How do I change my password?",
    answer: "To change your password, go to the 'Profile' tab, then tap on 'Privacy & Security'. On this screen, you'll find the 'Change Password' option. Tap on it, enter your current password followed by your new password, and confirm the new password. Tap 'Save' to update your password."
  }
];

export default function HelpSupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  
  const toggleFAQ = (index: number) => {
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(index);
    }
  };
  
  const openPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
  };
  
  const openTermsOfService = () => {
    setShowTermsOfService(true);
  };
  
  const renderPrivacyPolicyModal = () => {
    return (
      <Modal
        visible={showPrivacyPolicy}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPrivacyPolicy(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity 
                onPress={() => setShowPrivacyPolicy(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.legalTitle}>Garage App Privacy Policy</Text>
              <Text style={styles.legalDate}>Last Updated: June 3, 2025</Text>
              
              <Text style={styles.legalSectionTitle}>1. Information We Collect</Text>
              <Text style={styles.legalText}>
                We collect information you provide directly to us when you create an account, add vehicles, 
                set reminders, or use other features of our service. This may include your name, email address, 
                vehicle information (make, model, year, license plate, etc.), and service records.
              </Text>
              
              <Text style={styles.legalSectionTitle}>2. How We Use Your Information</Text>
              <Text style={styles.legalText}>
                We use the information we collect to provide, maintain, and improve our services, 
                including to process transactions, send notifications about your vehicles (such as service 
                reminders), and communicate with you about our services.
              </Text>
              
              <Text style={styles.legalSectionTitle}>3. Data Storage and Security</Text>
              <Text style={styles.legalText}>
                Your data is stored securely on our servers. We implement appropriate security measures 
                to protect against unauthorized access, alteration, disclosure, or destruction of your 
                personal information.
              </Text>
              
              <Text style={styles.legalSectionTitle}>4. Sharing of Information</Text>
              <Text style={styles.legalText}>
                We do not sell, trade, or otherwise transfer your personally identifiable information to 
                outside parties. This does not include trusted third parties who assist us in operating our 
                service, conducting our business, or servicing you, so long as those parties agree to keep 
                this information confidential.
              </Text>
              
              <Text style={styles.legalSectionTitle}>5. Your Choices</Text>
              <Text style={styles.legalText}>
                You can access and update certain information about you from within the app. You may also 
                opt out of receiving promotional communications from us by following the instructions in 
                those communications.
              </Text>
              
              <Text style={styles.legalSectionTitle}>6. Changes to This Policy</Text>
              <Text style={styles.legalText}>
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new privacy policy on this page and updating the "Last Updated" date.
              </Text>
              
              <Text style={styles.legalSectionTitle}>7. Contact Us</Text>
              <Text style={styles.legalText}>
                If you have any questions about this privacy policy, please contact us at privacy@garageapp.com.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  
  const renderTermsOfServiceModal = () => {
    return (
      <Modal
        visible={showTermsOfService}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTermsOfService(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms of Service</Text>
              <TouchableOpacity 
                onPress={() => setShowTermsOfService(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.legalTitle}>Garage App Terms of Service</Text>
              <Text style={styles.legalDate}>Last Updated: June 3, 2025</Text>
              
              <Text style={styles.legalSectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.legalText}>
                By accessing or using the Garage App, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </Text>
              
              <Text style={styles.legalSectionTitle}>2. Description of Service</Text>
              <Text style={styles.legalText}>
                Garage App provides a platform for users to track and manage their vehicles, including 
                service records, license information, and reminders. The app offers both free and premium 
                subscription features.
              </Text>
              
              <Text style={styles.legalSectionTitle}>3. User Accounts</Text>
              <Text style={styles.legalText}>
                To use certain features of the service, you must create an account. You are responsible for 
                maintaining the confidentiality of your account information and for all activities that occur 
                under your account.
              </Text>
              
              <Text style={styles.legalSectionTitle}>4. Subscription and Payments</Text>
              <Text style={styles.legalText}>
                The free version of Garage App allows users to add up to 2 vehicles. For additional vehicles, 
                users must subscribe to our premium service at a cost of R10 per month. Subscriptions are 
                automatically renewed unless cancelled. Payments are processed securely through Stripe.
              </Text>
              
              <Text style={styles.legalSectionTitle}>5. Cancellation and Refunds</Text>
              <Text style={styles.legalText}>
                You may cancel your subscription at any time through the app. Upon cancellation, you will 
                continue to have access to premium features until the end of your current billing period. 
                We do not provide refunds for partial subscription periods.
              </Text>
              
              <Text style={styles.legalSectionTitle}>6. User Content</Text>
              <Text style={styles.legalText}>
                You retain all rights to the content you upload to the service, including vehicle information 
                and images. By uploading content, you grant us a license to use, store, and display that content 
                in connection with providing the service.
              </Text>
              
              <Text style={styles.legalSectionTitle}>7. Prohibited Conduct</Text>
              <Text style={styles.legalText}>
                You agree not to use the service for any unlawful purpose or in any way that could damage, 
                disable, overburden, or impair the service. You may not attempt to gain unauthorized access 
                to any part of the service or any systems or networks connected to the service.
              </Text>
              
              <Text style={styles.legalSectionTitle}>8. Termination</Text>
              <Text style={styles.legalText}>
                We reserve the right to terminate or suspend your account and access to the service at our 
                sole discretion, without notice, for conduct that we believe violates these Terms of Service 
                or is harmful to other users, us, or third parties, or for any other reason.
              </Text>
              
              <Text style={styles.legalSectionTitle}>9. Changes to Terms</Text>
              <Text style={styles.legalText}>
                We may modify these Terms of Service at any time. We will notify you of any changes by 
                posting the new terms on this page and updating the "Last Updated" date.
              </Text>
              
              <Text style={styles.legalSectionTitle}>10. Contact Us</Text>
              <Text style={styles.legalText}>
                If you have any questions about these Terms of Service, please contact us at terms@garageapp.com.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            {faqData.map((faq, index) => (
              <View key={index} style={styles.faqContainer}>
                <TouchableOpacity 
                  style={styles.faqItem}
                  onPress={() => toggleFAQ(index)}
                >
                  <HelpCircle size={20} color={colors.primary} style={styles.faqIcon} />
                  <Text style={styles.faqText}>{faq.question}</Text>
                  {expandedFAQ === index ? (
                    <ChevronDown size={16} color={colors.textLight} />
                  ) : (
                    <ChevronRight size={16} color={colors.textLight} />
                  )}
                </TouchableOpacity>
                
                {expandedFAQ === index && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal Information</Text>
            
            <TouchableOpacity 
              style={styles.legalItem}
              onPress={openPrivacyPolicy}
            >
              <FileText size={20} color={colors.primary} style={styles.legalIcon} />
              <Text style={styles.legalItemText}>Privacy Policy</Text>
              <ExternalLink size={16} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.legalItem}
              onPress={openTermsOfService}
            >
              <FileText size={20} color={colors.primary} style={styles.legalIcon} />
              <Text style={styles.legalItemText}>Terms of Service</Text>
              <ExternalLink size={16} color={colors.textLight} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.appInfoContainer}>
            <Text style={styles.appName}>Garage</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
      
      {renderPrivacyPolicyModal()}
      {renderTermsOfServiceModal()}
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
    marginBottom: 16,
  },
  faqContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.inputBackground,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  faqIcon: {
    marginRight: 12,
  },
  faqText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  faqAnswerContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: colors.inputBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legalIcon: {
    marginRight: 12,
  },
  legalItemText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  appInfoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    padding: 16,
  },
  legalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  legalDate: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 24,
  },
  legalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  legalText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  }
});