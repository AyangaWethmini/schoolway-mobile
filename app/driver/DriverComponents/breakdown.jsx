import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { getApps } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import SWText from '../../components/SWText';
import Spacer from '../../components/Spacer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const BreakdownPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [driverLocation, setDriverLocation] = useState(null);
  const [availableVans, setAvailableVans] = useState([]);
  const [selectedVans, setSelectedVans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Distance calculator
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch all active vans from Firebase
  useEffect(() => {
    const db = getDatabase(getApps()[0]);
    const sessionRef = ref(db, 'active_sessions');

    const unsubscribe = onValue(sessionRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setAvailableVans([]);
        setLoading(false);
        return;
      }

      const sessionList = Object.values(data);

      // Get current driver from storage (assumes you stored their session)
      const sessionData = await AsyncStorage.getItem('current_session');
      let mySession = null;
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        mySession = sessionList.find((s) => s.driverId === parsed.driverId);
      }

      if (mySession?.currentLocation) {
        setDriverLocation(mySession.currentLocation);
      }

      // Filter other vans
      const otherVans = sessionList.filter(
        (s) => s.driverId !== mySession?.driverId && s.status === 'active'
      );

      const vansWithDistance = otherVans.map((van) => {
        const dist = mySession?.currentLocation
          ? calculateDistance(
              mySession.currentLocation.latitude,
              mySession.currentLocation.longitude,
              van.currentLocation?.latitude,
              van.currentLocation?.longitude
            )
          : 0;

        return {
          id: van.driverId,
          ownerName: van.driverName,
          vehicleModel: van.vanDetails?.makeAndModel || 'Unknown Model',
          vehicleNumber: van.vanDetails?.registrationNumber || 'N/A',
          capacity: van.capacity || 0,
          distance: `${dist.toFixed(2)} km`,
          arrivalTime: `${Math.round((dist / 40) * 60)} mins`, // assume 40km/h
          rating: 4.7,
          pricePerStudent: 150,
          profileImage: 'https://i.pravatar.cc/150?img=11',
          route: van.routeType || 'Unknown Route',
          phoneNumber: van.driverContact || '+94 71 000 0000',
        };
      });

      setAvailableVans(vansWithDistance);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleSelect = (id) => {
    if (selectedVans.includes(id)) {
      setSelectedVans(selectedVans.filter((v) => v !== id));
    } else {
      setSelectedVans([...selectedVans, id]);
    }
  };

  const handleNotify = () => {
    if (selectedVans.length === 0) {
      Alert.alert('Select at least one van', 'Please select a van to notify.');
      return;
    }
    Alert.alert('Success', 'Backup vans have been notified successfully!');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <SWText style={[styles.title, { color: theme.text }]}>Breakdown</SWText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SWText style={[styles.sectionTitle, { color: theme.text }]}>Available Vans</SWText>

        {availableVans.length === 0 ? (
          <SWText style={{ color: theme.muted, marginTop: 20, textAlign: 'center' }}>
            No active vans available nearby.
          </SWText>
        ) : (
          availableVans.map((van) => (
            <TouchableOpacity
              key={van.id}
              style={[
                styles.card,
                {
                  backgroundColor: selectedVans.includes(van.id)
                    ? theme.cardSelected
                    : theme.card,
                },
              ]}
              onPress={() => toggleSelect(van.id)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SWText style={[styles.vanName, { color: theme.text }]}>{van.vehicleModel}</SWText>
                <SWText style={{ color: theme.muted }}>{van.vehicleNumber}</SWText>
              </View>
              <SWText style={{ color: theme.text }}>Driver: {van.ownerName}</SWText>
              <SWText style={{ color: theme.text }}>Distance: {van.distance}</SWText>
              <SWText style={{ color: theme.text }}>ETA: {van.arrivalTime}</SWText>
            </TouchableOpacity>
          ))
        )}

        <Spacer height={20} />

        <TouchableOpacity
          onPress={handleNotify}
          style={[
            styles.notifyButton,
            { backgroundColor: selectedVans.length > 0 ? theme.primary : theme.muted },
          ]}
        >
          <SWText style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Notify Vans</SWText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BreakdownPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  vanName: {
    fontSize: 16,
    fontWeight: '600',
  },
  notifyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
});
