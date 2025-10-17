import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CurvedHeader from '../../components/CurvedHeader';
import { useTheme } from '../../theme/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl;


const ParentMap = () => {
  const { theme } = useTheme();
  const [children, setChildren] = useState([]);
  const [sessions, setSessions] = useState([]);
  const mapTimer = useRef(null);

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
      }
    } catch (err) {
      console.error('Failed to fetch children sessions:', err);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchChildrenSessions();
  }, []);

  // Poll every 2-3 seconds for updates
  useEffect(() => {
    mapTimer.current = setInterval(fetchChildrenSessions, 3000);
    return () => {
      if (mapTimer.current) clearInterval(mapTimer.current);
    };
  }, []);

  const getChildLocation = (child, session) => {
    
    if (!session) {

      if(child.status === 'AT_SCHOOL'){
        return {
          latitude: parseFloat(child.Gate.latitude),
          longitude: parseFloat(child.Gate.longitude),
        };
      }
      else{
          return {
            latitude: parseFloat(child.pickupLat),
            longitude: parseFloat(child.pickupLng),
        };
      }
    
    };

    const studentFirebase = session.firebaseData.students[child.id.toString()];
    if (!studentFirebase) return { latitude: child.pickupLat, longitude: child.pickupLng };

    // If child is in van, show van location
    if (studentFirebase.status === 'picked_up' && session.firebaseData.currentLocation) {
      return {
        latitude: session.firebaseData.currentLocation.latitude,
        longitude: session.firebaseData.currentLocation.longitude,
      };
    }

    // Otherwise show home location
    if(child.status === 'AT_HOME') {
      return {
        latitude: studentFirebase.homeLocation.latitude,
        longitude: studentFirebase.homeLocation.longitude,
      };
    }
    else if(child.status === 'AT_SCHOOL'){
      return {
        latitude: studentFirebase.schoolLocation.latitude,
        longitude: studentFirebase.schoolLocation.longitude,
      };
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
          // Find the session this child belongs to
          const session = sessions.find(s => s.SessionStudent.some(ss => ss.childId === child.id));

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
