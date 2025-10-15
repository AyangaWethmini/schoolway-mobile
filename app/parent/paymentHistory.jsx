import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Spacer from '../components/Spacer';
import SWText from '../components/SWText';
import { useTheme } from "../theme/ThemeContext";


const API_URL = Constants.expoConfig?.extra?.apiUrl;

const PaymentHistory = ({ navigation }) => {

  const { theme } = useTheme();
  const router = useRouter();  

  const handleBack = () => {
    router.back();
  };

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchPaymentHistory = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (!session) throw new Error('No session found');

      const user = JSON.parse(session);
      const parentId = user.user.id;

      const response = await fetch(`${API_URL}/payments/history/${parentId}`);
      if (!response.ok) throw new Error('Failed to fetch payment history');

      const data = await response.json();

      // Format data to match your UI
      const formatted = data.map((p) => ({
        id: p.id,
        childName: p.child?.name || 'Unknown',
        amount: p.amount,
        date: p.paidAt || p.createdAt,
        status: p.status === 'PAID' ? 'successful' : 
                p.status === 'FAILED' ? 'failed' : 
                'pending',
        vanService: p.van?.makeAndModel || 'N/A',
        transactionId: `TX${String(p.id).padStart(6, '0')}`,
      }));

      setPaymentHistory(formatted);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

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
    color: 'white',
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
    loadingBackgroundContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textgreydark,
  },
});

  if (loading) {
    return (
      <View style={styles.loadingBackgroundContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <SWText style={styles.loadingText}>Loading...</SWText>
        </View>
      </View>
    ); 
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}
      >

        <View style={[styles.header, { backgroundColor : theme.colors.primary } ]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <SWText uberBold style={styles.headerTitle}>Payment History</SWText>
        </View>

        <Spacer height={50}/>


        {paymentHistory.length === 0 ? (
          <View style={styles.loadingBackgroundContainer}>
            <View style={styles.loadingContainer}>
              <Ionicons name="document-text-outline" size={48} color="#ccc" />
              <SWText style={styles.emptyStateText}>No payment history yet</SWText>
            </View>
          </View>
        ) : (
          paymentHistory.map((payment) => (
              <View key={payment.id} style={styles.section}>
                <View style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyInfo}>
                      <SWText style={styles.historyChildName}>{payment.childName}</SWText>
                      <SWText style={styles.historyVanService}>{payment.vanService}</SWText>
                    </View>
                    <View style={styles.historyAmount}>
                      <SWText uberBold style={styles.historyAmountText}>
                        Rs. {payment.amount}
                      </SWText>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(payment.status) },
                        ]}
                      >
                        <SWText style={styles.statusText}>{payment.status}</SWText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.historyFooter}>
                    <SWText style={styles.historyDate}>{formatDate(payment.date)}</SWText>
                    <SWText style={styles.transactionId}>
                      ID: {payment.transactionId}
                    </SWText>
                  </View>
                </View>
              </View>
            ))
        )}
   
      </ScrollView>
    </SafeAreaView>
  );

  
};


export default PaymentHistory;