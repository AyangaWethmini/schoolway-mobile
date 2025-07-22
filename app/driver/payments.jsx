import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

export default function Payments() {
  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Payments</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>June 2024</Text>
          <Text style={styles.paymentAmount}>Rs. 45,000</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>May 2024</Text>
          <Text style={styles.paymentAmount}>Rs. 45,000</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>April 2024</Text>
          <Text style={styles.paymentAmount}>Rs. 45,000</Text>
        </View>
      </View>

      <Text style={styles.title}>Your Payment Information</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.cardTitle}>Salary Details</Text>
          {/* Update Info Button (not working yet) */}
          <Ionicons name="create-outline" size={24} color="#2B3674" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Name:</Text>
          <Text style={styles.infoValue}>Saman Weerasinghe</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Number:</Text>
          <Text style={styles.infoValue}>8307881234</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bank:</Text>
          <Text style={styles.infoValue}>BOC Bank</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Base Salary:</Text>
          <Text style={styles.infoValue}>Rs. 45,000</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Status:</Text>
          <Text style={[styles.infoValue, styles.statusPaid]}>Paid</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF8F8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
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
    fontSize: 14,
    color: '#666',
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B3674',
  }
})