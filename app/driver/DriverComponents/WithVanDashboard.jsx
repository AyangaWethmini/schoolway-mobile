import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';

const WithVanDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter(); // Fixed: renamed from 'route' to 'router'

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Good Morning, {user?.firstname || 'Ranjith'}!</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Plan for today</Text>
        <View style={styles.routeInfo}>
          <Text style={styles.routeSchool}>Kaluthara - Colombo 13</Text>
          <Text style={styles.routeTime}>Start: 6:30 AM</Text>
          <Text style={styles.routeTime}>End: 7:25 AM</Text>
          <Text style={styles.routeStudents}>Pick up : 12 students</Text>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 15,
            backgroundColor: '#2B3674',
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={() => router.push('./DriverComponents/travelPage')} // Fixed navigation path
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Start School Trip
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vehicle Status</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>Toyota Hiace</Text>
            <Text style={styles.statusLabel}>Vehicle</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>ABC-1234</Text>
            <Text style={styles.statusLabel}>License</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>Active</Text>
            <Text style={styles.statusLabel}>Status</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityDate}>Today, 7:30 AM</Text>
          <Text style={styles.activityDesc}>School drop-off completed</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityDate}>Today, 6:45 AM</Text>
          <Text style={styles.activityDesc}>Started morning route</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityDate}>Yesterday, 5:00 PM</Text>
          <Text style={styles.activityDesc}>Evening drop-off completed</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B3674',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 15,
  },
  routeInfo: {
    marginTop: 5,
  },
  routeSchool: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  routeTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  routeStudents: {
    fontSize: 14,
    color: '#666',
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 5,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
  },
  activityItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  activityDesc: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WithVanDashboard;