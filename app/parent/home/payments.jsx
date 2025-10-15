import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';

import Button from '../../components/button';
import CurvedHeader from '../../components/CurvedHeader';
import Spacer from '../../components/Spacer';
import SWText from '../../components/SWText';
import { useTheme } from "../../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const Payments = () => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [childrenCount, setChildrenCount] = useState(0);

  const fetchChildrenCount = async (parentId) => {
    try {
      const response = await fetch(`${API_URL}/parent/children-count/${parentId}`);
      if (!response.ok) throw new Error("Failed to fetch children count");

      const data = await response.json();
      setChildrenCount(data.childrenCount);
    } catch (error) {
      console.error("Error fetching children count:", error);
    }
  };


  const fetchDuePayments = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (!session) throw new Error('No session found');

      const user = JSON.parse(session);

      const response = await fetch(`${API_URL}/payments/due/${user.user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error("Failed to fetch payment history");

      const data = await response.json();

      const formatted = data.map((p) => ({
        id: p.id,
        name: p.child?.name || "Unknown",
        grade: p.child?.grade || "N/A",
        vanService: p.van?.makeAndModel || "N/A",
        route: p.van?.registrationNumber || "N/A",
        monthlyFee: p.amount,
        isPaid: p.status === "PAID" || p.status === "successful",
        dueDate: p.dueDate || new Date().toISOString().split("T")[0],
        avatar: "person-outline",
      }));

      setChildren(formatted);

      await fetchChildrenCount(user.user.id);
    } catch (error) {
      console.error("Error fetching payments:", error);
      Alert.alert("Error", "Could not load payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuePayments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDuePayments().finally(() => setRefreshing(false));
  };

  const getTotalDue = () => {
    return children.filter(child => !child.isPaid).reduce((sum, child) => sum + child.monthlyFee, 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handlePayment = (child) => {
    Alert.alert(
      "Confirm Payment",
      `Pay Rs.${child.monthlyFee} for ${child.name}'s van service (${child.vanService})?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Pay Now", onPress: () => processPayment(child) },
      ]
    );
  };

  const processPayment = async (child) => {
    try {
      const response = await fetch(`${API_URL}/payments/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: child.id }),
      });

      if (!response.ok) throw new Error("Failed to create payment session");

      const data = await response.json();

      if (data.url) {
        Linking.openURL(data.url);
      } else {
        Alert.alert("Error", "No payment URL returned.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Could not start payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <SWText style={{ marginTop: theme.spacing.md, fontSize: theme.fontSizes.medium, color: theme.colors.textgreydark }}>Loading...</SWText>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <CurvedHeader title="Payments" theme={theme} />
      <Spacer />
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginHorizontal: 16, marginVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, borderWidth: 1, borderColor: '#F0F0F0' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.7}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <MaterialIcons name="payments" size={20} color="#E74C3C" />
                </View>
                <View>
                  <SWText style={{ fontSize: 12, color: '#7F8C8D', fontWeight: '500', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Due</SWText>
                  <SWText uberBold style={{ fontSize: 18, color: '#2C3E50' }}>Rs.{getTotalDue()}</SWText>
                </View>
              </TouchableOpacity>

              <View style={{ width: 1, height: 40, backgroundColor: '#E8E8E8', marginHorizontal: 8 }} />

              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.7}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Ionicons name="people" size={20} style={{color : theme.colors.primary}} />
                </View>
                <View>
                  <SWText style={{ fontSize: 12, color: '#7F8C8D', fontWeight: '500', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Children</SWText>
                  <SWText uberBold style={{ fontSize: 18, color: '#2C3E50' }}>{childrenCount}</SWText>
                </View>
              </TouchableOpacity>
            </View>
          </View>

        <TouchableOpacity 
          style={{ backgroundColor: theme.colors.accentblue, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, marginHorizontal: 16, marginTop: 12, shadowColor: '#667eea', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 }}
          onPress={() => router.push('/parent/paymentHistory')}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <MaterialIcons name="receipt-long" size={24} color="#FFFFFF" />
            <SWText uberBold style={{ flex: 1, fontSize: 16, color: '#FFFFFF', textAlign: 'center', marginLeft: 8 }}>Transaction History</SWText>
            <MaterialIcons name="chevron-right" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <Spacer />


      {children.length === 0 ? (
        <View style={{ margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' }}>
          <SWText style={{ fontSize: 16, color: '#666' }}>No due payments available.</SWText>
        </View>
      ) : (
        <>
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
            {children.map(child => (
              <View key={child.id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Ionicons name={child.avatar} size={24} color="#666" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SWText uberBold style={{ fontSize: 16, color: '#333' }}>{child.name}</SWText>
                    <SWText style={{ fontSize: 14, color: '#666', marginTop: 2 }}>Grade {child.grade}</SWText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    {child.isPaid ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <SWText style={{ fontSize: 12, color: '#4CAF50', marginLeft: 4, fontWeight: '500' }}>Paid</SWText>
                      </View>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                        <Ionicons name="time-outline" size={16} color="#FF9800" />
                        <SWText style={{ fontSize: 12, color: '#FF9800', marginLeft: 4, fontWeight: '500' }}>Due</SWText>
                      </View>
                    )}
                  </View>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Ionicons name="bus-outline" size={16} color="#666" />
                    <SWText style={{ fontSize: 14, fontWeight: '500', color: '#333', marginLeft: 6 }}>{child.vanService}</SWText>
                  </View>
                  <SWText style={{ fontSize: 12, color: '#666', marginLeft: 22 }}>{child.route}</SWText>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <SWText style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>Monthly Fee</SWText>
                    <SWText uberBold style={{ fontSize: 18, color: '#333' }}>Rs.{child.monthlyFee}</SWText>
                  </View>
                  {!child.isPaid && (
                    <Button title="Pay" varient="secondary" onPress={() => handlePayment(child)} />
                  )}
                </View>

                {!child.isPaid && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Ionicons name="calendar-outline" size={14} color="#FF9800" />
                    <SWText style={{ fontSize: 12, color: '#FF9800', marginLeft: 4, fontWeight: '500' }}>Due: {formatDate(child.dueDate)}</SWText>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Payments;
