import { stopLocationTracking } from "@/services/backgroundLocation";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const TravelPage = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [routeType,setRouteType] = useState("MORNING_PICKUP");

  const [studentsToPickup, setStudentsToPickup] = useState([]);
  const [pickedUpStudents, setPickedUpStudents] = useState([]);
  const [processedStudents, setProcessedStudents] = useState([]);

  // 🔁 Load students from API
  const loadUserData = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (!session) return;
      const sessionData = await AsyncStorage.getItem('current_session');
      const parsedSession = JSON.parse(sessionData);

      setRouteType(parsedSession.routeType)

      const parsedUser = JSON.parse(session);
      setUser(parsedUser.user);

      const res = await fetch(`${API_URL}/mobile/driver/session/active/${parsedUser.user.id}`, { method: 'GET' });
      const data = await res.json();

      if (data.success) {
        const students = data.session.students || [];
        setStudentsToPickup(students.filter(s => s.pickupStatus === 'PENDING'));
        setPickedUpStudents(students.filter(s => s.pickupStatus === 'PICKED_UP'));
        setProcessedStudents(students.filter(s => ['DROPPED_OFF', 'ABSENT', 'NOT_PRESENT'].includes(s.pickupStatus)));
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  // 🚀 Initial load
  useEffect(() => {
    loadUserData();
  }, []);

  // 🔁 Auto-refresh UI every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadUserData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 📦 Mark attendance
  const markStudentAttendance = async (studentId, status, type = "PICKUP") => {
    try {
      const sessionData = await AsyncStorage.getItem('current_session');
      const parsedSession = JSON.parse(sessionData);

      const res = await fetch(`${API_URL}/mobile/driver/session/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: parsedSession.id,
          studentId,
          type,
          status,
          sessionType: parsedSession.routeType
        }),
      });

      const data = await res.json();
      if (!data.success) {
        Alert.alert('⚠️ Error', data.message || 'Failed to mark attendance');
        return;
      }

      // ✅ Refresh local UI immediately
      await loadUserData();

      Alert.alert('✅ Success', data.message || 'Status updated');
    } catch (err) {
      console.error('Error marking attendance:', err);
      Alert.alert('❌ Error', 'Something went wrong while marking attendance');
    }
  };

  const handleMarkAttendance = (studentId, studentName, type) => {
    Alert.alert(
      'Mark Attendance',
      `Select status for ${studentName}:`,
      [
        ...(type === "PICKUP"
          ? [
              { text: 'Picked Up', onPress: () => markStudentAttendance(studentId, 'PICKED_UP', 'PICKUP') },
            ]
          : [
              { text: 'Dropped Off', onPress: () => markStudentAttendance(studentId, 'DROPPED_OFF', 'DROPOFF') },
            ]),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const sendReminder = (studentId, studentName) => {
    Alert.alert(
      'Send Reminder',
      `Send pickup reminder for ${studentName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            setStudentsToPickup(prev => 
              prev.map(student => 
                student.id === studentId 
                  ? { ...student, reminderSent: true }
                  : student
              )
            );
          }
        }
      ]
    );
  };

  const handleScanQR = (studentId, studentName) => {
    Alert.alert(
      'Scan QR Code',
      `Opening QR scanner for ${studentName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Scanner', 
          onPress: () => {
            router.push('driver/DriverComponents/QRScannerScreen');
          }
        }
      ]
    );
  };

  const StudentCard = ({ student, isPickedUp = false }) => (
    <View style={[styles.studentCard, { backgroundColor: theme.colors.textwhite }]}>
      <View style={styles.topRow}>
        <Image 
          source={{ uri: student.profileImage || 'https://i.pravatar.cc/150?img=5' }}
          style={styles.profileImage}
        />
        <View style={styles.studentMainInfo}>
          <View style={styles.nameLocationRow}>
            <Text style={[styles.studentName, { color: theme.colors.accentblue }]}>{student.name}</Text>
            {!isPickedUp && student.reminderSent && (
              <View style={[styles.reminderIcon, { backgroundColor: theme.colors.success }]}>
                <Ionicons name="notifications" size={14} color="white" />
              </View>
            )}
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={theme.colors.textgreylight} />
            <Text style={[styles.pickupLocation, { color: theme.colors.textgreylight }]}>{student.pickupLocation}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.timeContact}>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={13} color={theme.colors.textgreylight} />
            <Text style={[styles.infoText, { color: theme.colors.textgreydark }]}>{student.parentContact}</Text>
          </View>
        </View>

        {!isPickedUp && !student.reminderSent && (
          <TouchableOpacity 
            style={[styles.reminderButton, { backgroundColor: theme.colors.primary + '15' }]}
            onPress={() => sendReminder(student.id, student.name)}
          >
            <MaterialIcons name="notification-add" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      {!isPickedUp && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
            onPress={() => handleMarkAttendance(student.id, student.name, "PICKUP")}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color="white" />
            <Text style={styles.buttonText}>Pick Up</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.accentblue }]}
            onPress={() => handleScanQR(student.id, student.name)}
          >
            <Ionicons name="qr-code-outline" size={16} color="white" />
            <Text style={styles.buttonText}>Scan QR</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPickedUp && student.pickupStatus === 'PICKED_UP' && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary, width: '100%', marginTop: 10 }]}
          onPress={() => handleMarkAttendance(student.id, student.name, "DROPOFF")}
        >
          <Ionicons name="location-outline" size={16} color="white" />
          <Text style={styles.buttonText}>Drop Off</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleEndTrip = async (status) => {
    try {
      const sessionData = await AsyncStorage.getItem('current_session');
      const parsedSession = JSON.parse(sessionData);

      const res = await fetch(`${API_URL}/mobile/driver/session/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            sessionId: parsedSession.id , 
            status : status || 'COMPLETED' 
        }),
      });

      const data = await res.json();

      if (!data.success) {
        Alert.alert('❌ Error', data.message || 'Failed to complete session');
        return;
      }

      stopLocationTracking();
      Alert.alert('✅ Session Completed', 'Trip has been completed successfully');
      if(status === 'COMPLETED'){ 
        await AsyncStorage.removeItem('current_session');
        router.push('driver/dashboard'); 
      }
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Error', 'Something went wrong');
    }
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Why do you want to cancel this ride?',
      [
        { text: 'Vehicle Breakdown', onPress: () => {
            handleEndTrip('EMERGENCY');
            router.push('./breakdown'); 
        }},
        { text: 'Other', onPress: () => handleEndTrip('CANCELLED') },
        { text: 'Back',onPress: () => {}, }
      ]
    );
  };

  const handleShowDriverQR = () => {
    router.push('/driver/DriverComponents/driverQRPage'); 
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroud }]}>
      {/* Modern Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.textwhite} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.textwhite }]}>Active Trip</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textwhite }]}>{routeType === 'EVENING_DROPOFF' ? 'Evening Dropoff':  "Morning Pickup"}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Summary Card */}
        <View style={[styles.tripSummary, { backgroundColor: theme.colors.textwhite }]}>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: theme.colors.warning + '15' }]}>
                <Ionicons name="hourglass" size={24} color={theme.colors.warning} />
              </View>
              <Text style={[styles.statNumber, { color: theme.colors.accentblue }]}>{studentsToPickup.length}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textgreylight }]}>Pending</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: theme.colors.success + '15' }]}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              </View>
              <Text style={[styles.statNumber, { color: theme.colors.accentblue }]}>{pickedUpStudents.length}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textgreylight }]}>Picked Up</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: theme.colors.secondary + '15' }]}>
                <Ionicons name="home" size={24} color={theme.colors.secondary} />
              </View>
              <Text style={[styles.statNumber, { color: theme.colors.accentblue }]}>{processedStudents.length}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textgreylight }]}>Dropped Off</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.qrButton, { backgroundColor: theme.colors.accentblue }]}
            onPress={handleShowDriverQR}
            activeOpacity={0.8}
          >
            <Ionicons name="qr-code" size={18} color="white" />
            <Text style={styles.qrButtonText}>Show Driver QR</Text>
          </TouchableOpacity>
        </View>

        {/* Students to Pick Up */}
        {studentsToPickup.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.accentblue }]}>
                Waiting to Pick Up
              </Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.warning + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.warning }]}>{studentsToPickup.length}</Text>
              </View>
            </View>
            {studentsToPickup.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </View>
        )}

        {/* Students to Drop Off */}
        {pickedUpStudents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.accentblue }]}>
                Ready to Drop Off
              </Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.secondary }]}>{pickedUpStudents.length}</Text>
              </View>
            </View>
            {pickedUpStudents.map(student => (
              <StudentCard key={student.id} student={student} isPickedUp={true} />
            ))}
          </View>
        )}

        {/* Processed Students */}
        {processedStudents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.accentblue }]}>
                Completed
              </Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.success + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.success }]}>{processedStudents.length}</Text>
              </View>
            </View>
            {processedStudents.map(student => (
              <StudentCard key={student.id} student={student} isPickedUp={true} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {studentsToPickup.length === 0 && pickedUpStudents.length === 0 && processedStudents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={48} color={theme.colors.success} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textgreydark }]}>No students assigned</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionFooter}>
          {pickedUpStudents.length > 0 || studentsToPickup.length > 0 ? (
            <>
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: theme.colors.error }]}
                onPress={handleCancelRide}
              >
                <Ionicons name="close-circle" size={18} color="white" />
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.completeButton, { backgroundColor: theme.colors.success, width: '100%' }]}
              onPress={() => handleEndTrip('COMPLETED')}
            >
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text style={styles.actionButtonText}>End Trip</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

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
    paddingTop: 12,
  },
  backButton: {
    padding: 4,
  },
  headerContent: { 
    alignItems: 'center',
    flex: 1,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: { 
    fontSize: 13, 
    marginTop: 2,
    fontWeight: '500',
  },
  content: { 
    flex: 1, 
    padding: 16,
  },
  tripSummary: {
    borderRadius: 16,
    marginBottom: 24,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statCircle: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e8e8e8',
    marginHorizontal: 2,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  qrButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  section: { 
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  studentCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: { 
    flexDirection: 'row', 
    marginBottom: 12 
  },
  profileImage: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: 12 
  },
  studentMainInfo: { 
    flex: 1 
  },
  nameLocationRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: { 
    fontSize: 16, 
    fontWeight: '700',
  },
  reminderIcon: {
    padding: 4,
    borderRadius: 6,
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 4,
  },
  pickupLocation: { 
    marginLeft: 4, 
    fontSize: 13,
  },
  bottomRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContact: { 
    flex: 1,
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  infoText: { 
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  reminderButton: { 
    padding: 8, 
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
    marginBottom: 40,
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
});

export default TravelPage;