import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import SWText from '../components/SWText';


const PrivateHirePaymentDetails: React.FC = () => {
  const params = useLocalSearchParams();
  console.log(params);
  let finalFare = 0;
  if (typeof params.finalFare === 'string') {
        finalFare = parseInt(params.finalFare, 10); 
        if (isNaN(finalFare)) finalFare = 0; 
      } else if (typeof params.finalFare === 'number') { 
    finalFare = params.finalFare;
  }
  const serviceFee = Math.round(finalFare * 0.05);
  const totalAmount = finalFare + serviceFee;

  // Pay Now handler
  const handlePayNow = async () => {
    try {
      // Get userId from AsyncStorage
      const sessionStr = await AsyncStorage.getItem('user_session');
      let userId = null;
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        userId = session?.user?.id;
      }
      // Get ownerId from params
      const ownerId = params.ownerId || null;
      // Prepare payload
      const payload = {
        tripId: params.tripId,
        userId,
        ownerId,
        tripFare: finalFare,
        serviceFee,
      };
      console.log('Payment payload:', payload);
      // Example API call
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/private-hire/payment/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Payment failed');
      }
      const result = await response.json();
      // Handle success (show confirmation, navigate, etc.)
      alert('Payment successful!');
    } catch (err) {
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <SWText uberBold style={styles.headerTitle}>Payment Details</SWText>
      </View>
      {/* Trip Details Summary */}
      <View style={styles.tripSummary}>
        <SWText style={styles.summaryTitle}>Trip Summary</SWText>
        <SWText style={styles.summaryItem}><SWText style={styles.summaryLabel}>Destination:</SWText> {params.destination}</SWText>
        <SWText style={styles.summaryItem}><SWText style={styles.summaryLabel}>Pickup Location:</SWText> {params.pickupLocation}</SWText>
        <SWText style={styles.summaryItem}><SWText style={styles.summaryLabel}>Departure Date:</SWText> {params.departureDate}</SWText>
        <SWText style={styles.summaryItem}><SWText style={styles.summaryLabel}>Return Date:</SWText> {params.returnDate}</SWText>
        <SWText style={styles.summaryItem}><SWText style={styles.summaryLabel}>Passengers:</SWText> {params.passengers}</SWText>
        <SWText style={styles.summaryItem}><SWText style={styles.summaryLabel}>Notes:</SWText> {params.notes}</SWText>
        <SWText style={styles.summaryItem}><SWText style={styles.summaryLabel}>Status:</SWText> {params.status}</SWText>
      </View>
      {/* Payment Breakdown Card */}
      <View style={styles.container}>
        <SWText style={styles.label}>Final Fare</SWText>
        <SWText style={styles.value}>Rs. {finalFare.toLocaleString()}</SWText>
        <View style={styles.divider} />
        <SWText style={styles.label}>Service Fee (5%)</SWText>
        <SWText style={styles.value}>Rs. {serviceFee.toLocaleString()}</SWText>
        <View style={styles.divider} />
        <SWText style={styles.totalLabel}>Total Amount to Pay</SWText>
        <SWText style={styles.totalValue}>Rs. {totalAmount.toLocaleString()}</SWText>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  tripSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 24,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryItem: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontWeight: '600',
    color: '#008080',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#0099cc',
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'flex-start',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    color: '#008080',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 17,
    color: '#333',
    fontWeight: '600',
    marginTop: 8,
  },
  totalValue: {
    fontSize: 22,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  payButton: {
    backgroundColor: '#0099cc',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default PrivateHirePaymentDetails;
