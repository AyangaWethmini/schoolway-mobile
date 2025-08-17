import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import GradientBackground from '../../components/GradientBackground';
import SWText from '../../components/SWText';
import { useTheme } from '../../theme/ThemeContext';
const WithVanDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter(); // Fixed: renamed from 'route' to 'router'

  return (
    <View style={styles.container}>
      
      <SWText style={[styles.welcomeText, { color: theme.primary }]} lg uberBold>
        Good Morning, {user?.firstname || 'Ranjith'}!
      </SWText>
      
      <View style={[styles.card]}>
        <SWText style={[styles.cardTitle, { color: theme.colors.primary }]} md uberBold>
          Plan for today
        </SWText>
        <View style={styles.routeInfo}>
          <SWText style={styles.routeSchool} md uberBold>
            Kaluthara - Colombo 13
          </SWText>
          <SWText style={[styles.routeTime]} sm>
            Start: 6:30 AM
          </SWText>
          <SWText style={[styles.routeTime]} sm>
            End: 7:25 AM
          </SWText>
          <SWText style={[styles.routeStudents]} sm>
            Pick up : 12 students
          </SWText>
        </View>
        {/* <TouchableOpacity
          style={{
            marginTop: 15,
            // backgroundColor: '#2B3674',
            backgroundColor: theme.colors.primaryFade,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={() => router.push('./DriverComponents/travelPage')} // Fixed navigation path
        >
          <SWText style={{ color: 'white' }} md uberBold>
            Start School Trip
          </SWText>
        </TouchableOpacity> */}
        <GradientBackground
          style={{
            marginTop: 15,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{ width: '100%', alignItems: 'center' }}
            onPress={() => router.push('./DriverComponents/travelPage')} // Fixed navigation path
          >
            <SWText style={{ color: 'white' }} md uberBold>
              Start School Trip
            </SWText>
          </TouchableOpacity>
        </GradientBackground>
      </View>
      
      <View style={[styles.card]}>
        <SWText style={[styles.cardTitle, { color: theme.colors.primary }]} md uberBold>
          Vehicle Status
        </SWText>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <SWText style={[styles.statusValue]} sm uberBold>
              Toyota Hiace
            </SWText>
            <SWText style={[styles.statusLabel, { color: theme.colors.textSecondary }]} xs>
              Vehicle
            </SWText>
          </View>
          <View style={styles.statusItem}>
            <SWText style={[styles.statusValue]} sm uberBold>
              ABC-1234
            </SWText>
            <SWText style={[styles.statusLabel, { color: theme.colors.textSecondary }]} xs>
              License
            </SWText>
          </View>
          <View style={styles.statusItem}>
            <SWText style={[styles.statusValue]} sm uberBold>
              Active
            </SWText>
            <SWText style={[styles.statusLabel, { color: theme.textSecondary }]} xs>
              Status
            </SWText>
          </View>
        </View>
      </View>
      
      <View style={[styles.card]}>
        <SWText style={[styles.cardTitle, { color: theme.primary }]} md uberBold>
          Recent Activity
        </SWText>
        <View style={styles.activityItem}>
          <SWText style={[styles.activityDate, { color: theme.colors.textgreydark }]} xs>
            Today, 7:30 AM
          </SWText>
          <SWText style={styles.activityDesc} sm uberBold>
            School drop-off completed
          </SWText>
        </View>
        <View style={styles.activityItem}>
          <SWText style={[styles.activityDate, { color: theme.colors.textgreydark }]} xs>
            Today, 6:45 AM
          </SWText>
          <SWText style={styles.activityDesc} sm uberBold>
            Started morning route
          </SWText>
        </View>
        <View style={styles.activityItem}>
          <SWText style={[styles.activityDate, { color: theme.colors.textgreydark }]} xs>
            Yesterday, 5:00 PM
          </SWText>
          <SWText style={styles.activityDesc} sm uberBold>
            Evening drop-off completed
          </SWText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    minHeight: '100%',
    padding: 20,
  },
  welcomeText: {
    // fontSize: 24,
    // fontWeight: 'bold',
    // color: '#2B3674',
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
    // fontSize: 16,
    // fontWeight: 'bold',
    // color: '#2B3674',
    marginBottom: 15,
  },
  routeInfo: {
    marginTop: 5,
  },
  routeSchool: {
    // fontSize: 16,
    // fontWeight: '600',
    marginBottom: 8,
  },
  routeTime: {
    // fontSize: 14,
    // color: '#666',
    marginBottom: 4,
  },
  routeStudents: {
    // fontSize: 14,
    // color: '#666',
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
    // fontSize: 14,
    // fontWeight: 'bold',
    // color: '#2B3674',
    marginBottom: 5,
  },
  statusLabel: {
    // fontSize: 12,
    // color: '#666',
  },
  activityItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  activityDate: {
    // fontSize: 12,
    // color: '#666',
    marginBottom: 3,
  },
  activityDesc: {
    // fontSize: 14,
    // fontWeight: '500',
  },
});

export default WithVanDashboard;