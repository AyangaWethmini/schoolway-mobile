import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import CurvedHeader from '../../components/CurvedHeader';
import { useTheme } from '../../theme/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const ETA_THRESHOLD_MINUTES = 25; // Notify when ETA < 5 mins

const ParentMap = () => {
  const { theme } = useTheme();
  const [children, setChildren] = useState([]);
  const [sessions, setSessions] = useState([]);
  const mapTimer = useRef(null);

  // Keep track of notified children to avoid spamming
  const notifiedChildren = useRef({});

  const fetchChildrenSessions = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (!session) return;
      const parsedUser = JSON.parse(session);

      const res = await fetch(`${API_URL}/parent/children-sessions?parentId=${parsedUser.user.id}`);
      const data = await res.json();
      if (data.success) {
        setChildren(data.children || []);
        setSessions(data.sessions || []);

        // Toast notifications for near ETA
        data.sessions.forEach((session) => {
          if (!session.etaMap) return;

          for (const [childId, eta] of Object.entries(session.etaMap)) {
            if (eta <= ETA_THRESHOLD_MINUTES && !notifiedChildren.current[childId]) {
              const child = data.children.find(c => c.id.toString() === childId);
              if (!child) continue;

              // Show toast
              Toast.show({
                type: 'info',
                text1: `🚌 Van for ${child.name} is almost there!`,
                text2: `ETA: ${eta} minutes`,
                position: 'top',
                visibilityTime: 5000,
              });

              // Mark as notified
              notifiedChildren.current[childId] = true;
            }
          }
        });
      }
    } catch (err) {
      console.error('Failed to fetch children sessions:', err);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchChildrenSessions();
  }, []);

  // Poll every 3 seconds
  useEffect(() => {
    mapTimer.current = setInterval(fetchChildrenSessions, 10000);
    return () => {
      if (mapTimer.current) clearInterval(mapTimer.current);
    };
  }, []);

  const getChildLocation = (child, session) => {
    if (!session) {
      if (child.status === 'AT_SCHOOL') {
        return { latitude: parseFloat(child.Gate?.latitude), longitude: parseFloat(child.Gate?.longitude) };
      } else {
        return { latitude: parseFloat(child.pickupLat), longitude: parseFloat(child.pickupLng) };
      }
    }
    const studentFirebase = session.firebaseData?.students?.[child.id.toString()];
    if (!studentFirebase) return { latitude: parseFloat(child.pickupLat), longitude: parseFloat(child.pickupLng) };

    if (studentFirebase.status === 'picked_up' && session.firebaseData.currentLocation) {
      return {
        latitude: session.firebaseData.currentLocation.latitude,
        longitude: session.firebaseData.currentLocation.longitude,
      };
    }

    if (child.status === 'AT_HOME') {
      return { latitude: studentFirebase.homeLocation.latitude, longitude: studentFirebase.homeLocation.longitude };
    } else if (child.status === 'AT_SCHOOL') {
      return { latitude: studentFirebase.schoolLocation.latitude, longitude: studentFirebase.schoolLocation.longitude };
    }
  };

  return (
    <View style={styles.container}>
      <CurvedHeader title="Map" theme={theme} />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.9271,
          longitude: 79.8612,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {children.map((child) => {

          const session = sessions.find(s => 
            s.sessionStudents?.some(ss => ss.childId === child.id)
          );          
          const loc = getChildLocation(child, session);

          return (
            <Marker key={child.id} coordinate={loc} title={child.name}>
              <View style={[styles.childMarker]}>
                <Ionicons name="person" size={16} color="#fff" />
              </View>
            </Marker>
          );
        })}
      </MapView>
      {/* Add Toast container */}
      <View style={{ zIndex: 9999 }}>
        <Toast />
      </View>
    </View>
  );
};

export default ParentMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  childMarker: {
    backgroundColor: '#4CAF50',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
