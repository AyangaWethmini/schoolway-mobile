import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Iionicon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';

const Map = () => {
  const { theme } = useTheme();

  // Driver's current location
  const driverLocation = {
    
    latitude: 6.9350,
      longitude: 79.8500,
  };

  // Student pickup locations with demo data
  const studentPickups = [
    {
      id: 1,
      name: "Saman Perera",
      latitude: 6.9271,
    longitude: 79.8612,
      pickupTime: "07:15 AM"
    },
    {
      id: 2,
      name: "Nisha Fernando",
      latitude: 6.9180,
      longitude: 79.8750,
      pickupTime: "07:25 AM"
    },
    {
      id: 3,
      name: "Kamal Silva",
      latitude: 6.9100,
      longitude: 79.8900,
      pickupTime: "07:35 AM"
    },
    {
      id: 4,
      name: "Priya Wickrama",
      latitude: 6.9050,
      longitude: 79.8650,
      pickupTime: "07:45 AM"
    }
  ];

  // Create route coordinates (driver -> student1 -> student2 -> etc.)
  const routeCoordinates = [
    driverLocation,
    ...studentPickups.map(student => ({
      latitude: student.latitude,
      longitude: student.longitude
    }))
  ];

  // Custom marker for students
  const StudentMarker = ({ student }) => (
    <Marker
      coordinate={{ latitude: student.latitude, longitude: student.longitude }}
      title={student.name}
      description={`Pickup: ${student.pickupTime}`}
    >
      <View style={styles.studentMarker}>
        <Iionicon name="person" size={16} color="#fff" />
      </View>
    </Marker>
  );

  // Custom marker for driver
  const DriverMarker = () => (
    <Marker
      coordinate={driverLocation}
      title="Driver Location"
      description="Current position"
    >
      <View style={styles.driverMarker}>
        <Ionicons name="bus" size={13} color="#fff" />
      </View>
    </Marker>
  );

  return (
    <View style={styles.container}>
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
        {/* Route polyline */}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#fcba03"
          strokeWidth={4}
          strokePattern={[1]}
        />

        {/* Driver marker */}
        <DriverMarker />

        {/* Student markers */}
        {studentPickups.map((student) => (
          <StudentMarker key={student.id} student={student} />
        ))}
      </MapView>
      
      {/* Route info panel */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoPanelTitle}>Pickup Route</Text>
        <Text style={styles.infoPanelText}>
          {studentPickups.length} students • Next: {studentPickups[0].name}
        </Text>
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  studentMarker: {
    backgroundColor: '#4CAF50',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoPanel: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoPanelText: {
    fontSize: 14,
    color: '#666',
  },
});