import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
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
      name: 'Amara Silva',
      grade: 'Grade 5',
      pickupLocation: 'Kaluthara Junction',
      pickupTime: '6:45 AM',
      parentContact: '+94 77 123 4567'
    },
    {
      id: '2',
      name: 'Nimal Perera',
      grade: 'Grade 7',
      pickupLocation: 'Panadura Station',
      pickupTime: '6:55 AM',
      parentContact: '+94 71 234 5678'
    },
    {
      id: '3',
      name: 'Sahan Fernando',
      grade: 'Grade 6',
      pickupLocation: 'Moratuwa Bus Stand',
      pickupTime: '7:05 AM',
      parentContact: '+94 76 345 6789'
    }
  ]);

  const [pickedUpStudents, setPickedUpStudents] = useState([
    {
      id: '4',
      name: 'Kavindi Jayawardena',
      grade: 'Grade 8',
      pickupLocation: 'Dehiwala Station',
      pickupTime: '6:35 AM',
      actualPickupTime: '6:37 AM'
    }
  ]);

  const handleMarkAttendance = (studentId, studentName) => {
    Alert.alert(
      'Mark Attendance',
      `Mark ${studentName} as picked up?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Move student from pickup list to picked up list
            const student = studentsToPickup.find(s => s.id === studentId);
            if (student) {
              const updatedStudent = {
                ...student,
                actualPickupTime: new Date().toLocaleTimeString()
              };
              
              setPickedUpStudents(prev => [...prev, updatedStudent]);
              setStudentsToPickup(prev => prev.filter(s => s.id !== studentId));
            }
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
            // Navigate to QR scanner or implement QR scanning logic
            console.log(`Scanning QR for student ${studentId}`);
          }
        }
      ]
    );
  };

  const StudentCard = ({ student, isPickedUp = false }) => (
    <View style={[styles.studentCard, isPickedUp && styles.pickedUpCard]}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentGrade}>{student.grade}</Text>
        <Text style={styles.pickupLocation}>
          <Ionicons name="location-outline" size={14} color="#666" />
          {' '}{student.pickupLocation}
        </Text>
        <Text style={styles.pickupTime}>
          <Ionicons name="time-outline" size={14} color="#666" />
          {' '}Scheduled: {student.pickupTime}
          {isPickedUp && ` | Actual: ${student.actualPickupTime}`}
        </Text>
        {!isPickedUp && (
          <Text style={styles.parentContact}>
            <Ionicons name="call-outline" size={14} color="#666" />
            {' '}{student.parentContact}
          </Text>
        )}
      </View>

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

      {isPickedUp && (
        <View style={styles.pickedUpIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#28a745" />
          <Text style={styles.pickedUpText}>Picked Up</Text>
        </View>
      )}
    </View>
  );

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
              <Text style={styles.emptyStateText}>All students picked up!</Text>
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
          )}
        </View>

        {/* Already Picked Up Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Already Picked Up ({pickedUpStudents.length})
            </Text>
            <Ionicons name="checkmark-circle-outline" size={20} color="#28a745" />
          </View>
          
          {pickedUpStudents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="hourglass-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No students picked up yet</Text>
            </View>
          ) : (
            pickedUpStudents.map((student) => (
              <StudentCard key={student.id} student={student} isPickedUp={true} />
            ))
          )}
        </View>

        {/* Trip Summary */}
        <View style={styles.tripSummary}>
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
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pickedUpStudents.length + studentsToPickup.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
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
    paddingTop: 50,
    paddingBottom: 20,
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
  studentInfo: {
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 4,
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pickupLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  parentContact: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
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
  pickedUpIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  pickedUpText: {
    color: '#28a745',
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
});

export default TravelPage;