import { startLocationTracking, stopLocationTracking } from "@/services/backgroundLocation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import Spacer from '../../components/Spacer';
import SWText from '../../components/SWText';
import { useTheme } from '../../theme/ThemeContext';


const API_URL = Constants.expoConfig?.extra?.apiUrl;

const WithVanDashboard = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardloading, setdashboardLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session'); // get stored user
        if (!session) {
          console.error('No user session found');
          return;
        }

        const parsedUser = JSON.parse(session);
        setUser(parsedUser.user);
        const driverId = parsedUser.user.id;

        const res = await fetch(`${API_URL}/driver/dashboard/${driverId}`);
        const data = await res.json();

        if (data.success) {
          setDashboardData(data);
        } else {
          console.warn("Dashboard load failed:", data.message);
        }


        console.log('👤 Logged in user:', parsedUser.user);
      } catch (error) {
        console.error('Failed to load user from AsyncStorage:', error);
      }
      finally {
      setdashboardLoading(false);
      }
    
    };

    loadUserData();
  }, []);

  const handleEndTrip = async () => {
   stopLocationTracking();
  }

  // ✅ Handle start trip
  const handleStartTrip = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Driver ID missing');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/mobile/driver/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.error || 'Failed to start session');
        setLoading(false);
        return;
      }

      if (data.success) {
        console.log('✅ Trip started successfully:', data);
        if (!data.sessionExists) {
          console.log('🚀 Starting background location tracking for session:', data.session.id);
          await startLocationTracking(data.session.id);
        }

        await AsyncStorage.setItem('current_session', JSON.stringify(data.session));
        router.push('driver/DriverComponents/travelPage');

      } else {
        Alert.alert('Info', data.error || 'Could not start session');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong while starting the trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    <Spacer />
    <SWText style={[styles.welcomeText, { color: theme.primary }]} lg uberBold>
      Good Morning, {user?.name || 'Driver'}!
    </SWText>

    {/* --- Plan for Today --- */}
    <View style={styles.card}>
      <SWText style={[styles.cardTitle, { color: theme.colors.primary }]} md uberBold>
        Plan for today
      </SWText>

      {dashboardloading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : dashboardData ? (
        <View style={styles.routeInfo}>
          <SWText style={styles.routeSchool} md uberBold>
            {dashboardData.plan.route}
          </SWText>
          <SWText style={styles.routeStudents} sm>
           You’ll be picking up {dashboardData.plan.pickupCount} students along the route
          </SWText>
        </View>
      ) : (
        <SWText sm>No plan available</SWText>
      )}

      <GradientBackground
        style={{
          marginTop: 15,
          paddingVertical: 10,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          disabled={loading || dashboardloading || !dashboardData.hasSessionDue}
          style={{ width: '100%', alignItems: 'center', opacity: loading ? 0.7 : 1 }}
          onPress={handleStartTrip}
        >
          {dashboardloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <SWText style={{ color: 'white' }} md uberBold>
              {!dashboardData.hasSessionDue ? "No Trip" : "Start Trip" }
            </SWText>
          )}
        </TouchableOpacity>
      </GradientBackground>
    </View>

    {/* --- Vehicle Status --- */}
    <View style={styles.card}>
      <SWText style={[styles.cardTitle, { color: theme.colors.primary }]} md uberBold>
        Vehicle Status
      </SWText>

      {dashboardloading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : dashboardData ? (
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <SWText style={styles.statusValue} sm uberBold>
              {dashboardData.vehicle.model}
            </SWText>
            <SWText style={[styles.statusLabel, { color: theme.colors.textSecondary }]} xs>
              Vehicle
            </SWText>
          </View>
          <View style={styles.statusItem}>
            <SWText style={styles.statusValue} sm uberBold>
              {dashboardData.vehicle.license}
            </SWText>
            <SWText style={[styles.statusLabel, { color: theme.colors.textSecondary }]} xs>
              License
            </SWText>
          </View>
          <View style={styles.statusItem}>
            <SWText style={styles.statusValue} sm uberBold>
              {dashboardData.vehicle.status}
            </SWText>
            <SWText style={[styles.statusLabel, { color: theme.colors.textSecondary }]} xs>
              Status
            </SWText>
          </View>
        </View>
      ) : (
        <SWText sm>No vehicle info available</SWText>
      )}
    </View>

    {/* --- Recent Activity --- */}
    <View style={styles.card}>
      <SWText style={[styles.cardTitle, { color: theme.colors.primary }]} md uberBold>
        Recent Activity
      </SWText>

      {dashboardloading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : dashboardData ? (
        dashboardData.recentActivity.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <SWText style={[styles.activityDate, { color: theme.colors.textgreydark }]} xs>
              {new Date(activity.time).toLocaleString()}
            </SWText>
            <SWText style={styles.activityDesc} sm uberBold>
              {activity.description}
            </SWText>
          </View>
        ))
      ) : (
        <SWText sm>No activity recorded</SWText>
      )}
    </View>
  </View>

  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    padding: 20,
  },
  welcomeText: {
    marginBottom: 20,
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
    marginBottom: 15,
  },
  routeInfo: {
    marginTop: 5,
  },
  routeSchool: {
    marginBottom: 8,
  },
  routeTime: {
    marginBottom: 4,
  },
  routeStudents: {
    marginTop: 5,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusValue: {
    marginBottom: 5,
  },
  activityItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  activityDate: {
    marginBottom: 3,
  },
});

export default WithVanDashboard;
