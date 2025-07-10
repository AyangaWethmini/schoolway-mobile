import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Spacer from '../components/Spacer';
import { useTheme } from "../theme/ThemeContext";



const PaymentHistory = ({ navigation }) => {

  const { theme } = useTheme();

  const handleBack = () => {
    navigation.goBack();
  };

  const [paymentHistory, setPaymentHistory] = useState([
      {
        id: 1,
        childName: 'Ayanga',
        amount: 150,
        date: '2025-06-15',
        status: 'successful',
        vanService: 'Sunshine Express',
        transactionId: 'TXN001234'
      },
      {
        id: 2,
        childName: 'Lehan',
        amount: 120,
        date: '2025-06-18',
        status: 'successful',
        vanService: 'Safe Journey Kids',
        transactionId: 'TXN001235'
      },
      {
        id: 3,
        childName: 'Ayanga',
        amount: 150,
        date: '2025-05-15',
        status: 'failed',
        vanService: 'Sunshine Express',
        transactionId: 'TXN001236'
      }
    ])

    const getStatusColor = (status) => {
      switch(status) {
        case 'successful': return '#4CAF50'
        case 'failed': return '#F44336'
        case 'pending': return '#FF9800'
        default: return '#757575'
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={[styles.header, { backgroundColor : theme.colors.primary } ]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment History</Text>
        </View>

        <Spacer height={50}/>

        <View style={styles.section}>
        {paymentHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No payment history yet</Text>
          </View>
        ) : (
          paymentHistory.map(payment => (
            <View key={payment.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyChildName}>{payment.childName}</Text>
                  <Text style={styles.historyVanService}>{payment.vanService}</Text>
                </View>
                <View style={styles.historyAmount}>
                  <Text style={styles.historyAmountText}>Rs. {payment.amount}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
                    <Text style={styles.statusText}>{payment.status}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.historyFooter}>
                <Text style={styles.historyDate}>{formatDate(payment.date)}</Text>
                <Text style={styles.transactionId}>ID: {payment.transactionId}</Text>
              </View>
            </View>
          ))
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight:'bold',
    color: '#000',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
   historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  historyInfo: {
    flex: 1,
  },
  historyChildName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  historyVanService: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  historyAmount: {
    alignItems: 'flex-end',
  },
  historyAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionId: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default PaymentHistory;