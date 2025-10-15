import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import CurvedHeader from '../components/CurvedHeader';
import SWText from '../components/SWText';
import { useTheme } from '../theme/ThemeContext';

export default function Payments() {
  const { theme } = useTheme();

  return (
    <>
    <CurvedHeader 
          title="Payments" 
          theme={theme}
        />
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
          {/* Update Info Button (not working yet) */}
          <Ionicons name="create-outline" size={24} color="#2B3674" />
        </View>
        <View style={styles.infoRow}>
          <SWText style={styles.infoLabel} ellipsizeMode='' sm>Account Name:</SWText>
          <SWText style={styles.infoValue} md>Saman Weerasinghe</SWText>
        </View>
        <View style={styles.infoRow}>
          <SWText style={styles.infoLabel} ellipsizeMode='' sm>Account Number:</SWText>
          <SWText style={styles.infoValue} md>8307881234</SWText>
        </View>
        <View style={styles.infoRow}>
          <SWText style={styles.infoLabel} ellipsizeMode='' sm>Bank:</SWText>
          <SWText style={styles.infoValue} md>BOC Bank</SWText>
        </View>
        <View style={styles.infoRow}>
          <SWText style={styles.infoLabel} ellipsizeMode='' sm>Base Salary:</SWText>
          <SWText style={styles.infoValue} md>Rs. 45,000</SWText>
        </View>
        <View style={styles.infoRow}>
          <SWText style={styles.infoLabel} ellipsizeMode='' sm>Payment Status:</SWText>
          <SWText style={[styles.infoValue, styles.statusPaid]} md>Paid</SWText>
        </View>
      </View>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF8F8',
  },
  title: {
    // fontSize: 20,
    // fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20,
    color: '#2B3674',
    SWtextAlign: 'center',
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
  }
})