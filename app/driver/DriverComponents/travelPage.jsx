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

  const [studentsToPickup, setStudentsToPickup] = useState([]);
  const [pickedUpStudents, setPickedUpStudents] = useState([]);
  const [processedStudents, setProcessedStudents] = useState([]);

  // 🔁 Load students from API
  const loadUserData = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (!session) return;

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
              { text: 'Not Present', onPress: () => markStudentAttendance(studentId, 'NOT_PRESENT', 'PICKUP') },
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

  const StudentCard = ({ student, isPickedUp = false }) => (
    <View style={[styles.studentCard, isPickedUp && styles.pickedUpCard]}>
      <View style={styles.topRow}>
        <Image 
          source={{ uri: student.profileImage || 'https://i.pravatar.cc/150?img=5' }}
          style={styles.profileImage}
        />
        <View style={styles.studentMainInfo}>
          <View style={styles.nameLocationRow}>
            <Text style={styles.studentName}>{student.name}</Text>
            {!isPickedUp && student.reminderSent && (
              <View style={styles.reminderIcon}>
                <Ionicons name="notifications" size={16} color="#28a745" />
              </View>
            )}
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.pickupLocation}>{student.pickupLocation}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.timeContact}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.infoText}>Scheduled: {student.pickupTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{student.parentContact}</Text>
          </View>
        </View>

        {!isPickedUp && !student.reminderSent && (
          <TouchableOpacity 
            style={styles.reminderButton}
            onPress={() => sendReminder(student.id, student.name)}
          >
            <MaterialIcons name="notification-add" size={18} color="#2B3674" />
          </TouchableOpacity>
        )}
      </View>
      
      {!isPickedUp && (
        <TouchableOpacity
          style={[styles.actionButton, styles.attendanceButton]}
          onPress={() => handleMarkAttendance(student.id, student.name, "PICKUP")}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Mark Picked Up</Text>
        </TouchableOpacity>
      )}

      {isPickedUp && student.pickupStatus === 'PICKED_UP' && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007bff' }]}
          onPress={() => handleMarkAttendance(student.id, student.name, "DROPOFF")}
        >
          <Ionicons name="location-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Mark Dropped Off</Text>
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
      await AsyncStorage.removeItem('current_session');
      Alert.alert('✅ Session Completed', 'Trip has been completed successfully');
      if(status != 'EMERGENCY'){
        router.push('driver/DriverComponents/WithVanDashboard'); 
      }
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Error', 'Something went wrong');
    }
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Why do you want to Cancel this ride?',
      [
        { text: 'Vehicle Breakdown', onPress: () => {
            handleEndTrip('EMERGENCY');
            router.push('./breakdown'); 
        }},
        { text: 'Personal Emergency', onPress: () => handleEndTrip('CANCELLED') },
        { text: 'Other Reason', onPress: () => handleEndTrip('CANCELLED') },
        { text: 'Back', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Trip in Progress</Text>
          <Text style={styles.subtitle}>Kaluthara - Colombo 13</Text>
          <Text style={styles.startTime}>Started: {new Date().toLocaleTimeString()}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Summary */}
        <View style={[styles.tripSummary, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pickedUpStudents.length}</Text>
              <Text style={styles.statLabel}>Picked Up</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{studentsToPickup.length}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>
        </View>

        {/* Students to Pick Up */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Students to Pick Up ({studentsToPickup.length})
          </Text>
          {studentsToPickup.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666' }}>No students to pick up.</Text>
          ) : (
            studentsToPickup.map(student => (
              <StudentCard key={student.id} student={student} />
            ))
          )}
        </View>

        {/* Students to Drop Off */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Students to Drop Off ({pickedUpStudents.length})
          </Text>
          {pickedUpStudents.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666' }}>No students to drop off.</Text>
          ) : (
            pickedUpStudents.map(student => (
              <StudentCard key={student.id} student={student} isPickedUp={true} />
            ))
          )}
        </View>

                {/* Students to Drop Off */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Processed Students ({processedStudents.length})
          </Text>
          {processedStudents.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666' }}>No students to drop off.</Text>
          ) : (
            processedStudents.map(student => (
              <StudentCard key={student.id} student={student} isPickedUp={true} />
            ))
          )}
        </View>

        {/* Cancel or Complete */}
        {pickedUpStudents.length || studentsToPickup.length ? (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
            <Ionicons name="close-circle-outline" size={20} color="white" />
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleEndTrip('COMPLETED')}>
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.cancelButtonText}>Complete Ride</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F8' },
  header: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2B3674' },
  subtitle: { fontSize: 16, color: '#666' },
  startTime: { fontSize: 14, color: '#666' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  studentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickedUpCard: { borderColor: '#28a745', borderWidth: 1 },
  topRow: { flexDirection: 'row', marginBottom: 12 },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  studentMainInfo: { flex: 1 },
  nameLocationRow: { flexDirection: 'row', justifyContent: 'space-between' },
  studentName: { fontSize: 18, fontWeight: 'bold', color: '#2B3674' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  pickupLocation: { marginLeft: 4, fontSize: 14, color: '#666' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeContact: { flex: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#666', marginLeft: 4 },
  reminderButton: { padding: 8, borderRadius: 8, backgroundColor: '#f0f0f0' },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  attendanceButton: { backgroundColor: '#28a745' },
  buttonText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  cancelButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});

export default TravelPage;
