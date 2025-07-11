import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Spacer from '../../components/Spacer';
import Button from '../../components/button';
import { useTheme } from "../../theme/ThemeContext";

const Payments = () => {

  const { theme } = useTheme();
  
  const router = useRouter();  
  
  const [refreshing, setRefreshing] = useState(false)
  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'Ayanga',
      grade: 'Grade 5',
      vanService: 'Sunshine Express',
      route: 'Route A - Downtown',
      monthlyFee: 4500,
      isPaid: true,
      dueDate: '2025-07-15',
      avatar: 'person-outline'
    },
    {
      id: 2,
      name: 'Lehan',
      grade: 'Grade 3',
      vanService: 'Safe Journey Kids',
      route: 'Route B - Suburbs',
      monthlyFee: 5200,
      isPaid: false,
      dueDate: '2025-07-20',
      avatar: 'person-outline'
    }
  ])

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

  const handlePayment = (child) => {
    Alert.alert(
      'Confirm Payment',
      `Pay Rs.Rs.{child.monthlyFee} for Rs.{child.name}'s van service (Rs.{child.vanService})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pay Now', 
          onPress: () => processPayment(child),
          style: 'default'
        }
      ]
    )
  }

  const processPayment = (child) => {
    // Simulate payment processing
    const updatedChildren = children.map(c => 
      c.id === child.id ? { ...c, isPaid: true } : c
    )
    setChildren(updatedChildren)

    // Add to payment history
    const newPayment = {
      id: paymentHistory.length + 1,
      childName: child.name,
      amount: child.monthlyFee,
      date: new Date().toISOString().split('T')[0],
      status: 'successful',
      vanService: child.vanService,
      transactionId: `TXNRs.{Date.now()}`
    }
    setPaymentHistory([newPayment, ...paymentHistory])

    Alert.alert('Payment Successful', `Payment of Rs.Rs.{child.monthlyFee} for Rs.{child.name} has been processed successfully.`)
  }

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const getTotalDue = () => {
    return children.filter(child => !child.isPaid).reduce((sum, child) => sum + child.monthlyFee, 0)
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
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Spacer/>
      
      <View style={styles.summaryCard}>        
        <View style={styles.summaryRow}>
          <TouchableOpacity style={styles.summaryItem} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="payments" size={20} color="#E74C3C" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.summaryLabel}>Total Due</Text>
              <Text style={styles.summaryValue}>Rs.{getTotalDue()}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.summaryItem} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={20} style={{color : theme.colors.primary}} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.summaryLabel}>Children</Text>
              <Text style={styles.summaryValue}>{children.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.gradientButton}
        onPress={() => {
           router.push('/parent/paymentHistory')
        }}
        activeOpacity={0.8}
      >
        <View style={styles.gradientButtonContent}>
          <MaterialIcons name="receipt-long" size={24} color="#FFFFFF" />
          <Text style={styles.gradientButtonText}>Transaction History</Text>
          <MaterialIcons name="chevron-right" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <Spacer/>


      <View style={styles.section}>
        {children.map(child => (
          <View key={child.id} style={styles.childCard}>
            <View style={styles.childHeader}>
              <View style={styles.childAvatar}>
                <Ionicons name={child.avatar} size={24} color="#666" />
              </View>
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childGrade}>{child.grade}</Text>
              </View>
              <View style={styles.paymentStatus}>
                {child.isPaid ? (
                  <View style={styles.paidBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.paidText}>Paid</Text>
                  </View>
                ) : (
                  <View style={styles.dueBadge}>
                    <Ionicons name="time-outline" size={16} color="#FF9800" />
                    <Text style={styles.dueText}>Due</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.vanDetails}>
              <View style={styles.vanInfo}>
                <Ionicons name="bus-outline" size={16} color="#666" />
                <Text style={styles.vanServiceName}>{child.vanService}</Text>
              </View>
              <Text style={styles.routeInfo}>{child.route}</Text>
            </View>

            <View style={styles.paymentSection}>
              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Monthly Fee</Text>
                <Text style={styles.amount}>Rs.{child.monthlyFee}</Text>
              </View>
              {!child.isPaid && (
                <View>
                  <Button
                    title="Pay"
                    varient="secondary"
                  />
                </View>
                )}
            </View>
            
            {!child.isPaid && (
              <View style={styles.dueDateSection}>
                <Ionicons name="calendar-outline" size={14} color="#FF9800" />
                <Text style={styles.dueDateText}>Due: {formatDate(child.dueDate)}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
      
    </ScrollView>
  )
}

export default Payments

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
 summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  textContainer: {
    flex: 1,
  },
  
  summaryLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 8,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  childCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  childGrade: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  paymentStatus: {
    alignItems: 'flex-end',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dueText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: '500',
  },
  vanDetails: {
    marginBottom: 16,
  },
  vanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  vanServiceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 6,
  },
  routeInfo: {
    fontSize: 12,
    color: '#666',
    marginLeft: 22,
  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountSection: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  payButtonTextDisabled: {
    color: '#999',
  },
  dueDateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dueDateText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: '500',
  },
  gradientButton: {
    backgroundColor: 'black',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  
  gradientButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  gradientButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginLeft: 8,
  },
})