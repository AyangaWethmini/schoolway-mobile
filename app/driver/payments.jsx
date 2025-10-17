import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import CurvedHeader from '../components/CurvedHeader';
import SWText from '../components/SWText';
import { useTheme } from '../theme/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const SRI_LANKA_BANKS = [
  "Bank of Ceylon",
  "People's Bank",
  "Commercial Bank",
  "Hatton National Bank",
  "Sampath Bank",
  "Nations Trust Bank",
  "DFCC Bank",
  "National Savings Bank",
  "Seylan Bank",
  "Pan Asia Bank",
];

const BANK_BRANCHES = {
  "Bank of Ceylon": ["Colombo 1", "Colombo 3", "Moratuwa", "Mount Lavinia", "Dehiwala", "Nugegoda", "Maharagama"],
  "People's Bank": ["Colombo 2", "Colombo 7", "Moratuwa", "Panadura", "Ratmalana", "Piliyandala"],
  "Commercial Bank": ["Colombo 1", "Wellawatte", "Moratuwa", "Kalutara", "Kollupitiya", "Bambalapitiya"],
  // Add branches for other banks...
};

export default function Payments() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState(null);
  const [formData, setFormData] = useState({
    accountNo: '',
    accountName: '',
    bankName: '',
    branchName: '',
    branchCode: ''
  });

  // Move styles inside component to access theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FAF8F8',
    },
    title: {
      marginBottom: 5,
      marginTop: 20,
      color: '#2B3674',
      textAlign: 'center',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    cardTitle: {
      // fontSize: 16,
      // fontWeight: 'bold',
      color: '#2B3674',
      marginBottom: 15,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
      // fontSize: 14,
      color: '#666',
    },
    infoValue: {
      // fontSize: 14,
      // fontWeight: 'bold',
      color: '#2B3674',
    },
    statusPaid: {
      color: '#27ae60',
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    paymentLabel: {
      // fontSize: 14,
      color: '#666',
    },
    paymentAmount: {
      // fontSize: 14,
      // fontWeight: 'bold',
      color: '#2B3674',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 20,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      color: '#2B3674',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      padding: 15,
      borderRadius: 8,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.accentblue,
    },
    saveButton: {
      backgroundColor: theme.colors.primary, 
    },
    buttonText: {
      color: 'white',
    },
    setupCard: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 30,
      margin: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    setupTitle: {
      color: '#2B3674',
      marginBottom: 15,
      textAlign: 'center',
    },
    setupDescription: {
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
      paddingHorizontal: 20,
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
      width: '100%',
      color: '#2B3674',
    },
  });

  // Add useEffect to fetch bank account details
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/mobile/driver/payments/bankacc/${user.id}`);
        
        // Handle 404 (Not Found) separately from other errors
        if (response.status === 404) {
          setBankInfo(null);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setBankInfo(data);
      } catch (error) {
        // Only log actual errors, not "not found" cases
        if (error.message !== 'Bank details not found') {
          console.error('Error fetching bank details:', error);
        }
        setBankInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankDetails();
  }, [user.id]);

  // Update handleUpdateBankInfo to use the unified endpoint
  const handleUpdateBankInfo = async () => {
    // Validate required fields
    if (!formData.accountNo || !formData.accountName || !formData.bankName || !formData.branchName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/mobile/driver/payments/bankacc/${user.id}`, {
        method: 'PUT', // Always use PUT since the endpoint handles both create and update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save bank details');
      }

      const updatedData = await response.json();
      setBankInfo(updatedData);
      setShowUpdateModal(false);
      Alert.alert(
        'Success', 
        `Bank details ${bankInfo ? 'updated' : 'created'} successfully. Please wait for verification.`
      );
    } catch (error) {
      console.error('Error with bank details:', error);
      Alert.alert('Error', error.message || 'Failed to save bank details');
    }
  };

  // Add a setup view for initial bank account setup
  const SetupBankView = () => (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <View style={[styles.setupCard, { width: '100%', maxWidth: 400 }]}>
        <Ionicons name="wallet-outline" size={48} color={theme.colors.primary} style={{ marginBottom: 20 }} />
        <SWText style={styles.setupTitle} lg uberBold>Setup Payment Information</SWText>
        <SWText style={styles.setupDescription} sm>
          Please add your bank account details to receive payments
        </SWText>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton, { marginTop: 20, width: '100%' }]}
          onPress={() => setShowUpdateModal(true)}
        >
          <SWText style={styles.buttonText} md uberBold>Add Bank Account</SWText>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <>
        <CurvedHeader title="Payments" theme={theme} />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <SWText md>Loading...</SWText>
        </View>
      </>
    );
  }

  // Render setup view if no bank info exists
  if (!bankInfo) {
    return (
      <>
        <CurvedHeader title="Payments" theme={theme} />
        <SetupBankView />
        <Modal
          visible={showUpdateModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <SWText style={styles.modalTitle} lg uberBold>
                {bankInfo ? 'Update Bank Details' : 'Add Bank Details'}
              </SWText>
              
              <TextInput 
                style={styles.input}
                placeholder="Account Name (as per bank account) *"
                value={formData.accountName}
                onChangeText={(text) => setFormData(prev => ({...prev, accountName: text}))}
              />
              
              <TextInput 
                style={styles.input}
                placeholder="Account Number *"
                value={formData.accountNo}
                keyboardType="numeric"
                onChangeText={(text) => setFormData(prev => ({...prev, accountNo: text}))}
              />
              
              {/* Replace Bank Name input with a dropdown */}
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={formData.bankName}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev, 
                      bankName: value,
                      branchName: '' // Reset branch when bank changes
                    }));
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Bank" value="" />
                  {SRI_LANKA_BANKS.map((bank) => (
                    <Picker.Item key={bank} label={bank} value={bank} />
                  ))}
                </Picker>
              </View>
              
              {/* Replace Branch Name input with a dropdown based on selected bank */}
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={formData.branchName}
                  enabled={!!formData.bankName}
                  onValueChange={(value) => setFormData(prev => ({...prev, branchName: value}))}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Branch" value="" />
                  {formData.bankName && BANK_BRANCHES[formData.bankName]?.map((branch) => (
                    <Picker.Item key={branch} label={branch} value={branch} />
                  ))}
                </Picker>
              </View>
              
              <TextInput 
                style={styles.input}
                placeholder="Branch Code (optional)"
                value={formData.branchCode}
                onChangeText={(text) => setFormData(prev => ({...prev, branchCode: text}))}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton, { flex: 1 }]} 
                  onPress={() => {
                    setShowUpdateModal(false);
                    setFormData({
                      accountNo: bankInfo?.accountNo || '',
                      accountName: bankInfo?.accountName || '',
                      bankName: bankInfo?.bankName || '',
                      branchName: bankInfo?.branchName || '',
                      branchCode: bankInfo?.branchCode || ''
                    });
                  }}
                >
                  <SWText style={styles.buttonText} md>Cancel</SWText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, { flex: 1 }]} 
                  onPress={handleUpdateBankInfo}
                >
                  <SWText style={styles.buttonText} md>Save Changes</SWText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  // Existing return statement for when bank info exists
  return (
    <>
      <CurvedHeader title="Payments" theme={theme} />
      <View style={styles.container}>
        <View style={styles.card}>
          <SWText style={styles.cardTitle} md uberBold>Recent Payments</SWText>
          <View style={styles.paymentRow}>
            <SWText style={styles.paymentLabel} sm uberBold>June 2024</SWText>
            <SWText style={styles.paymentAmount} sm uberBold>Rs. 45,000</SWText>
          </View>
          <View style={styles.paymentRow}>
            <SWText style={styles.paymentLabel} sm uberBold>May 2024</SWText>
            <SWText style={styles.paymentAmount} sm uberBold>Rs. 45,000</SWText>
          </View>
          <View style={styles.paymentRow}>
            <SWText style={styles.paymentLabel} sm uberBold>April 2024</SWText>
            <SWText style={styles.paymentAmount} sm uberBold>Rs. 45,000</SWText>
          </View>
        </View>

        <SWText style={styles.title} lg uberBold>Your Payment Information</SWText>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <SWText style={styles.cardTitle} md uberBold>Salary Details</SWText>
            <TouchableOpacity onPress={() => setShowUpdateModal(true)}>
              <Ionicons name="create-outline" size={24} color="#2B3674" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <SWText style={styles.infoLabel} ellipsizeMode='' sm>Account Name:</SWText>
            <SWText style={styles.infoValue} md>{bankInfo.accountName}</SWText>
          </View>
          <View style={styles.infoRow}>
            <SWText style={styles.infoLabel} ellipsizeMode='' sm>Account Number:</SWText>
            <SWText style={styles.infoValue} md>{bankInfo.accountNo}</SWText>
          </View>
          <View style={styles.infoRow}>
            <SWText style={styles.infoLabel} ellipsizeMode='' sm>Bank:</SWText>
            <SWText style={styles.infoValue} md>{bankInfo.bankName}</SWText>
          </View>
          <View style={styles.infoRow}>
            <SWText style={styles.infoLabel} ellipsizeMode='' sm>Branch:</SWText>
            <SWText style={styles.infoValue} md>{bankInfo.branchName}</SWText>
          </View>
          {bankInfo.branchCode && (
            <View style={styles.infoRow}>
              <SWText style={styles.infoLabel} ellipsizeMode='' sm>Branch Code:</SWText>
              <SWText style={styles.infoValue} md>{bankInfo.branchCode}</SWText>
            </View>
          )}
          <View style={styles.infoRow}>
            <SWText style={styles.infoLabel} ellipsizeMode='' sm>Base Salary:</SWText>
            <SWText style={styles.infoValue} md>Rs. 45,000</SWText>
          </View>
        </View>
      </View>
    </>
  );
}