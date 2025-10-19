import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getApps } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Spacer from '../../components/Spacer';
import { useTheme } from '../../theme/ThemeContext';

const BreakdownPage = () => {
  const router = useRouter();
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

  const fetchDriverAndVanDetails = async (driverId) => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/van-details?driverId=${driverId}`);
      if (!res.ok) throw new Error("Failed to fetch driver/van details");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching details:", error);
      return null;
    }
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

      const sessionList = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      console.log("current sessions", sessionList);

      // Get current driver from storage (assumes you stored their session)
      const sessionData = await AsyncStorage.getItem('current_session');
      const parsed = JSON.parse(sessionData);

      let mySession = null;

      if (parsed) {
        mySession = sessionList.find((s) => s.id === parsed.id);
      }

      console.log("my sessions :: ", mySession);

      if (mySession?.currentLocation) {
        setDriverLocation(mySession.currentLocation);
      }

      // Filter other vans
      const otherVans = sessionList.filter(
        (s) => s.id !== parsed.id && s.status === 'pending'
      );

      const vansWithDistance = await Promise.all(
      otherVans.map(async (van) => {
        const dist = mySession?.currentLocation
          ? calculateDistance(
              mySession.currentLocation.latitude,
              mySession.currentLocation.longitude,
              van.currentLocation?.latitude,
              van.currentLocation?.longitude
            )
          : 0;

        const details = await fetchDriverAndVanDetails(van.driverId);

        return {
          id: van.driverId,
          ownerName: details?.driver?.name || van.driverName,
          vehicleModel: details?.van?.makeAndModel || 'Unknown Model',
          vehicleNumber: details?.van?.registrationNumber || 'N/A',
          capacity: details?.van?.seatingCapacity || 0,
          distance: `${dist.toFixed(2)} km`,
          arrivalTime: `${Math.round((dist / 40) * 60)} mins`,
          rating: details?.driver?.rating || 4.7,
          profileImage: details?.driver?.profilePic || 'https://i.pravatar.cc/150?img=11',
          route: van.routeType || 'Unknown Route',
          phoneNumber: details?.driver?.contact || van.driverContact || '+94 71 000 0000',
        };
      })
    );


      setAvailableVans(vansWithDistance);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroud }]}>
        <View style={[styles.header,{ color: theme.colors.primary }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color={theme.colors.textwhite} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textwhite }]}>Vehicle Breakdown</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accentblue} />
          <Text style={[styles.loadingText, { color: theme.colors.textgreydark }]}>Finding nearby vans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroud }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('driver/dashboard')}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.textwhite} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textwhite }]}>Vehicle Breakdown</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Section Header */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.accentblue }]}>
            Available Backup Vans
          </Text>
          <View style={[styles.selectedBadge, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={[styles.selectedCount, { color: theme.colors.primary }]}>
              {availableVans.length}
            </Text>
          </View>
        </View>

        {availableVans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={48} color={theme.colors.textgreylight} />
            <Text style={[styles.emptyText, { color: theme.colors.textgreydark }]}>
              No active vans available nearby
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textgreylight }]}>
              Please try again in a moment
            </Text>
          </View>
        ) : (
          <View style={styles.vansContainer}>
            {availableVans.map((van) => (
              <View
                key={van.id}
                style={[
                  styles.vanCard,
                  {
                    backgroundColor: theme.colors.textwhite,
                    borderWidth: selectedVans.includes(van.id) ? 2 : 0,
                    borderColor: selectedVans.includes(van.id) ? theme.colors.secondary : 'transparent',
                  },
                ]}
              >
                {/* Selection Indicator */}
                <View style={styles.selectionRow}>
                  <View style={styles.vanInfo}>
                    <Image
                      source={{ uri: van.profileImage }}
                      style={styles.driverAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.driverName, { color: theme.colors.accentblue }]}>
                        {van.ownerName}
                      </Text>
                      <Text style={[styles.vehicleModel, { color: theme.colors.textgreylight }]}>
                        {van.vehicleModel}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Van Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <View style={styles.detail}>
                      <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
                      <Text style={[styles.detailValue, { color: theme.colors.textgreydark }]}>
                        {van.distance}
                      </Text>
                    </View>
                    <View style={styles.detail}>
                      <Ionicons name="time-outline" size={16} color={theme.colors.warning} />
                      <Text style={[styles.detailValue, { color: theme.colors.textgreydark }]}>
                        {van.arrivalTime}
                      </Text>
                    </View>
                    <View style={styles.detail}>
                      <Ionicons name="people-outline" size={16} color={theme.colors.success} />
                      <Text style={[styles.detailValue, { color: theme.colors.textgreydark }]}>
                        {van.capacity} seats
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.colors.backgroud }]} />

                  <View style={styles.contactRow}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFB800" />
                      <Text style={[styles.ratingText, { color: theme.colors.textgreydark }]}>
                        {van.rating}
                      </Text>
                    </View>
                    <TouchableOpacity style={[styles.callButton, { backgroundColor: theme.colors.primary + '15' }]}>
                      <Ionicons name="call-outline" size={14} color={theme.colors.primary} />
                      <Text style={[styles.callButtonText, { color: theme.colors.primary }]}>Call : {van.phoneNumber}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <Spacer height={20} />
      </ScrollView>

    </SafeAreaView>
  );
};

export default BreakdownPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertDesc: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  selectedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  vansContainer: {
    gap: 12,
  },
  vanCard: {
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  vanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
  },
  vehicleModel: {
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  detail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  callButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  notifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});