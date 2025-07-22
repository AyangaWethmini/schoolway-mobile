import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';

const TravelPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // Sample data - replace with actual data from your API
  const [studentsToPickup, setStudentsToPickup] = useState([
    {
      id: '1',
      name: 'Sasmitha Silva',
      pickupLocation: 'Kaluthara Junction',
      pickupTime: '6:45 AM',
      parentContact: '+94 77 123 4567',
      profileImage: 'https://i.pravatar.cc/150?img=1',
      reminderSent: true
    },
    {
      id: '2',
      name: 'Duleepa Anjana',
      pickupLocation: 'Panadura Station',
      pickupTime: '6:55 AM',
      parentContact: '+94 71 234 5678',
      profileImage: 'https://i.pravatar.cc/150?img=2',
      reminderSent: false
    },
    {
      id: '3',
      name: 'Sahan Fernando',
      pickupLocation: 'Moratuwa Bus Stand',
      pickupTime: '7:05 AM',
      parentContact: '+94 76 345 6789',
      profileImage: 'https://i.pravatar.cc/150?img=3',
      reminderSent: true
    }
  ]);

  const [pickedUpStudents, setPickedUpStudents] = useState([
    {
      id: '4',
      name: 'Kavindi Jayawardena',
      pickupLocation: 'Dehiwala Station',
      pickupTime: '6:35 AM',
      actualPickupTime: '6:37 AM',
      profileImage: 'https://i.pravatar.cc/150?img=4',
      status: 'picked_up'
    }
  ]);

  const attendanceReasons = [
    { id: 'picked_up', label: 'Student Picked Up', icon: 'checkmark-circle', color: '#28a745' },
    { id: 'not_present', label: 'Student Not Present', icon: 'close-circle', color: '#dc3545' },
    { id: 'cancelled_parent', label: 'Cancelled by Parent', icon: 'ban', color: '#ffc107' },
    { id: 'cancelled_driver', label: 'Cancelled by Driver', icon: 'warning', color: '#fd7e14' }
  ];

  const handleMarkAttendance = (studentId, studentName) => {
    Alert.alert(
      'Mark Attendance',
      `Select status for ${studentName}:`,
      [
        ...attendanceReasons.map(reason => ({
          text: reason.label,
          onPress: () => markStudentAttendance(studentId, reason)
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const markStudentAttendance = (studentId, reason) => {
    const student = studentsToPickup.find(s => s.id === studentId);
    if (student) {
      const updatedStudent = {
        ...student,
        actualPickupTime: new Date().toLocaleTimeString(),
        status: reason.id,
        statusLabel: reason.label
      };
      
      setPickedUpStudents(prev => [...prev, updatedStudent]);
      setStudentsToPickup(prev => prev.filter(s => s.id !== studentId));
    }
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
            console.log(`Scanning QR for student ${studentId}`);
          }
        }
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

  const getStatusIcon = (status) => {
    const reason = attendanceReasons.find(r => r.id === status);
    return reason || attendanceReasons[0];
  };

  const StudentCard = ({ student, isPickedUp = false }) => (
    <View style={[styles.studentCard, isPickedUp && styles.pickedUpCard]}>
      {/* Top Row: Profile Picture, Name, Location */}
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

      {/* Bottom Row: Time and Contact */}
      <View style={styles.bottomRow}>
        <View style={styles.timeContact}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.infoText}>
              Scheduled: {student.pickupTime}
              {isPickedUp && ` | Actual: ${student.actualPickupTime}`}
            </Text>
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

      {/* Action Buttons for Pickup */}
      {!isPickedUp && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.attendanceButton]}
            onPress={() => handleMarkAttendance(student.id, student.name)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Mark Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.scanButton]}
            onPress={() => handleScanQR(student.id, student.name)}
          >
            <Ionicons name="qr-code-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Scan QR</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Indicator for Picked Up Students */}
      {isPickedUp && (
        <View style={styles.statusIndicator}>
          <View style={styles.statusInfo}>
            {(() => {
              const statusConfig = getStatusIcon(student.status);
              return (
                <>
                  <Ionicons name={statusConfig.icon} size={24} color={statusConfig.color} />
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>
                    {student.statusLabel || statusConfig.label}
                  </Text>
                </>
              );
            })()}
          </View>
        </View>
      )}
    </View>
  );

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Why do you want to cancel this ride?',
      [
        { 
          text: 'Vehicle Breakdown', 
          onPress: () => router.push('./breakdown')
        },
        { 
          text: 'Personal Emergency', 
          onPress: () => showCancelConfirmation('Personal Emergency')
        },
        { 
          text: 'Weather Conditions', 
          onPress: () => showCancelConfirmation('Weather Conditions')
        },
        { 
          text: 'Other Reason', 
          onPress: () => showCancelConfirmation('Other Reason')
        },
        { text: 'Back', style: 'cancel' }
      ]
    );
  };

  const showCancelConfirmation = (reason) => {
    Alert.alert(
      'Confirm Cancellation',
      `Are you sure you want to cancel the ride due to: ${reason}?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            // Handle ride cancellation logic here
            console.log(`Ride cancelled due to: ${reason}`);
            Alert.alert('Ride Cancelled', 'Parents have been notified.');
          }
        }
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
          <Text style={[styles.startTime, { marginTop: 5 }]}>Next pick up in: 8.53 mins est.</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={[styles.tripSummary, { backgroundColor: theme.colors.background, marginBottom: 10, marginTop: 0, paddingTop: 0 }]}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {pickedUpStudents.filter(s => s.status === 'picked_up').length}
              </Text>
              <Text style={styles.statLabel}>Picked Up</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{studentsToPickup.length}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pickedUpStudents.length + studentsToPickup.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Students to Pick Up Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Students to Pick Up ({studentsToPickup.length})
            </Text>
            <Ionicons name="people-outline" size={20} color="#2B3674" />
          </View>
          
          {studentsToPickup.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color="#28a745" />
              <Text style={styles.emptyStateText}>All students processed!</Text>
            </View>
          ) : (
            studentsToPickup.map((student, index) => (
              <View key={student.id}>
                <StudentCard student={student} />
                {index < studentsToPickup.length - 1 && (
                  <View style={styles.routeConnector}>
                    <View style={styles.connectorLine} />
                    <Ionicons name="arrow-down" size={16} color="#ccc" />
                  </View>
                )}
              </View>
            ))
          )
          }
        </View>

        {/* Already Processed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Processed Students ({pickedUpStudents.length})
            </Text>
            <Ionicons name="checkmark-circle-outline" size={20} color="#28a745" />
          </View>
          
          {pickedUpStudents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="hourglass-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No students processed yet</Text>
            </View>
          ) : (
            pickedUpStudents.map((student) => (
              <StudentCard key={student.id} student={student} isPickedUp={true} />
            ))
          )}
        </View>

        {/* add a button to cancel the ride( no need of any functionality) */}
        <View style={styles.cancelButtonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelRide}
          >
            <Ionicons name="close-circle-outline" size={20} color="white" />
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F8',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  startTime: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B3674',
  },
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
  pickedUpCard: {
    backgroundColor: '#f8f9fa',
    borderColor: '#28a745',
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  studentMainInfo: {
    flex: 1,
  },
  nameLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B3674',
    flex: 1,
  },
  reminderIcon: {
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  timeContact: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  reminderButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  attendanceButton: {
    backgroundColor: '#28a745',
  },
  scanButton: {
    backgroundColor: '#2B3674',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusIndicator: {
    marginTop: 8,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  routeConnector: {
    alignItems: 'center',
    marginVertical: 8,
  },
  connectorLine: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },
  tripSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  cancelButtonContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TravelPage;