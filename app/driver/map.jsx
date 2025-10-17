import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getApps } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { startLocationTracking, stopLocationTracking } from '../../services/backgroundLocation';
import CurvedHeader from '../components/CurvedHeader';
import SWText from '../components/SWText';
import { useTheme } from '../theme/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

const DriverMap = () => {
  const { theme } = useTheme();
  const [driverLocation, setDriverLocation] = useState({
    latitude: 6.9350,
    longitude: 79.8500,
  });
  const [students, setStudents] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [driverId, setDriverId] = useState(null);
  const [sessionType, setSessionType] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const routeTimer = useRef(null);

  const fetchSessionData = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      const sessionData = await AsyncStorage.getItem('current_session');
      if (!session || !sessionData) return;

      const parsedUser = JSON.parse(session);
      const parsedSession = JSON.parse(sessionData);

      setDriverId(parsedUser.user.id);
      setSessionId(parsedSession.id);
      setSessionType(parsedSession.routeType);

      const res = await fetch(`${API_URL}/mobile/driver/session/find/${parsedUser.user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        let fetchedStudents = data.session.students;

        if (parsedSession.routeType === 'EVENING_DROPOFF') {
          fetchedStudents = fetchedStudents.map((s) => ({
            ...s,
            pickupLocation: s.dropOffLocation,
            dropOffLocation: s.pickupLocation,
          }));
        }

        setStudents(fetchedStudents);
      }
    } catch (err) {
      console.error('Failed to fetch session:', err);
    }
  };

  // Load once on mount
  useEffect(() => {
    fetchSessionData();
  }, []);

  // ✅ Poll every 2 seconds to refetch student/session data
  useEffect(() => {
    const interval = setInterval(fetchSessionData, 2000); // every 2s
    return () => clearInterval(interval);
  }, []);

  // Start location tracking & Firebase listener
  useEffect(() => {
    if (!sessionId) return;

    const db = getDatabase(getApps()[0]);
    const locationRef = ref(db, `active_sessions/${sessionId}/currentLocation`);

    startLocationTracking(sessionId);

    const unsubscribe = onValue(locationRef, (snapshot) => {
      const loc = snapshot.val();
      if (loc) {
        setDriverLocation({
          latitude: loc.latitude,
          longitude: loc.longitude,
        });
      }
    });

    return () => {
      stopLocationTracking();
      unsubscribe();
    };
  }, [sessionId]);

  // Fetch optimized route (debounced)
  useEffect(() => {
    if (!driverLocation || students.length === 0) return;

    if (routeTimer.current) clearTimeout(routeTimer.current);

    routeTimer.current = setTimeout(() => {
      fetchOptimizedRoute(driverLocation, students);
    }, 2000);
  }, [driverLocation, students]);

  /**
   * Fetch optimized route from Google Directions API
   */
  const fetchOptimizedRoute = async (origin, studentList) => {
    const activeStudents = studentList.filter(
      s => s.pickupStatus === 'PENDING' || s.pickupStatus === 'PICKED_UP'
    );

    if (activeStudents.length === 0) {
      setRouteCoordinates([]);
      return;
    }

    const waypointsArr = activeStudents.map((s) => {
      if (s.pickupStatus === 'PICKED_UP') {
        return `${s.dropOffLocation.latitude},${s.dropOffLocation.longitude}`;
      } else {
        return `${s.pickupLocation.latitude},${s.pickupLocation.longitude}`;
      }
    });

    const waypoints = waypointsArr.join('|');
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${origin.latitude},${origin.longitude}&waypoints=optimize:true|${waypoints}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'OK') {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);

        const order = data.routes[0].waypoint_order;
        const orderedStudents = order.map(i => activeStudents[i]);

        const inactiveStudents = studentList.filter(
          s => s.pickupStatus === 'DROPPED_OFF' || s.pickupStatus === 'ABSENT'
        );

        setStudents([...orderedStudents, ...inactiveStudents]);
      } else {
        console.error('Directions API error:', data.status);
      }
    } catch (err) {
      console.error('Failed to fetch directions:', err);
    }
  };

  const decodePolyline = (t) => {
    let points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < t.length) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const StudentMarker = ({ student }) => {
    let color;
    let coordinate;

    switch (student.pickupStatus) {
      case 'PENDING':
        color = '#4CAF50';
        coordinate = student.pickupLocation;
        break;
      case 'PICKED_UP':
        color = '#2196F3';
        coordinate = student.dropOffLocation;
        break;
      case 'DROPPED_OFF':
        color = '#9E9E9E';
        coordinate = null;
        break;
      case 'ABSENT':
        color = '#F44336';
        coordinate = student.pickupLocation;
        break;
      default:
        color = '#4CAF50';
        coordinate = student.pickupLocation;
    }

    if (!coordinate) return null;

    return (
      <Marker coordinate={coordinate} title={student.name}>
        <View style={[styles.studentMarker, { backgroundColor: color }]}>
          <Ionicons name="person" size={16} color="#fff" />
        </View>
      </Marker>
    );
  };

  const DriverMarker = () => (
    <Marker coordinate={driverLocation} title="Driver Location">
      <View style={styles.driverMarker}>
        <Ionicons name="bus" size={20} color="#fff" />
      </View>
    </Marker>
  );

  const activeRouteStudents = students.filter(
    s => s.pickupStatus === 'PENDING' || s.pickupStatus === 'PICKED_UP'
  );

  return (
    <View style={styles.container}>
      <CurvedHeader title="SchoolWay" theme={theme} />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {routeCoordinates.length > 1 && (
          <Polyline 
            coordinates={routeCoordinates} 
            strokeColor="#fcba03" 
            strokeWidth={4} 
          />
        )}

        <DriverMarker />
        {students.map((s) => (
          <StudentMarker key={s.id} student={s} />
        ))}
      </MapView>

      {/* Info panel */}
      <View style={styles.infoPanel}>
        <SWText style={styles.infoPanelTitle} sm>
          Current Route
        </SWText>
        {activeRouteStudents.length > 0 ? (
          <SWText style={styles.infoPanelText} md uberBold>
            {activeRouteStudents.length} students • Next: {activeRouteStudents[0]?.name || '—'}
          </SWText>
        ) : (
          <SWText style={styles.infoPanelText} md uberBold>
            No students assigned yet
          </SWText>
        )}
      </View>
    </View>
  );
};

export default DriverMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  studentMarker: {
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  driverMarker: {
    backgroundColor: '#FF5722',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  infoPanel: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  infoPanelTitle: { color: '#333', marginBottom: 5 },
  infoPanelText: { color: '#666' },
});
