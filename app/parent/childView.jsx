import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button } from "../components/button";
import TextInputComponent from '../components/inputs';
import SWText from '../components/SWText';
import { useTheme } from "../theme/ThemeContext";

const { width } = Dimensions.get('window');

const ChildView = ({ navigation, route }) => {
  const { theme } = useTheme();
  const router = useRouter();  
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('');

  // Student data state
  const [studentData, setStudentData] = useState({
    name: 'Duleepa Edirisinghe',
    age: '8',
    grade: 'Grade 3',
    school: 'St. Mary\'s Elementary',
    pickupAddress: '123 Main Street, Colombo 03',
    dropoffAddress: 'St. Mary\'s Elementary, Colombo 05',
    parentContact: '+94 77 123 4567',
    emergencyContact: '+94 71 987 6543',
    specialNotes: 'No known allergies',
    vanNumber: 'VAN-001',
    vanRoute: 'Route A - Morning',
    monthlyFee: 'Rs. 15,000'
  });

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    setIsEditMode(false);
    Alert.alert('Success', 'Student details updated successfully!');
  };

  const handleMarkAttendance = () => {
    setShowAttendanceModal(true);
  };

  const submitAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceHistory(prev => ({
      ...prev,
      [today]: attendanceStatus
    }));
    setShowAttendanceModal(false);
    setAttendanceStatus('');
    Alert.alert('Success', `Attendance marked as ${attendanceStatus}`);
  };

 
  const InfoRow = ({ label, value, field }) => (
    <View style={styles.infoRow}>
      <SWText style={styles.infoLabel}>{label}:</SWText>
      {isEditMode ? (
        <TextInputComponent
          style={styles.editInput}
          value={value}
          onChangeText={(text) => setStudentData(prev => ({ ...prev, [field]: text }))}
          multiline={field === 'pickupAddress' || field === 'dropoffAddress' || field === 'specialNotes'}
        />
      ) : (
        <SWText style={styles.infoValue}>{value}</SWText>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <SWText uberBold style={styles.headerTitle}>Student Details</SWText>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons name={isEditMode ? "close" : "create"} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Student Profile Card - Add pointerEvents="box-none" to allow scroll through */}
        <View style={[styles.profileCard, styles.scrollableCard]} pointerEvents="box-none">
          <View style={styles.avatarContainer} pointerEvents="none">
            <Ionicons name="person-circle" size={80} color={'grey'} />
          </View>
          <SWText h1 style={styles.studentName} pointerEvents="none">{studentData.name}</SWText>
          <SWText style={styles.studentGrade} pointerEvents="none">{studentData.grade} • {studentData.school}</SWText>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleMarkAttendance}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.backgroundLightGreen} />
            <SWText style={styles.actionText}>Mark Attendance</SWText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/parent/childAttendance')}>
            <Ionicons name="calendar" size={24} color={theme.colors.accentblue} />
            <SWText style={styles.actionText}>View Calendar</SWText>
          </TouchableOpacity>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/parent/generateQR')}>
            <Ionicons name="qr-code" size={24} color={theme.colors.accentblue} />
            <SWText style={styles.actionText}>Generate a QR code</SWText>
          </TouchableOpacity>
        </View>

        {/* Student Information - Add pointerEvents="box-none" for scrollable areas */}
        <View style={[styles.infoCard, styles.scrollableCard]} pointerEvents="box-none">
          <SWText style={styles.sectionTitle} pointerEvents="none">Personal Information</SWText>
          <InfoRow label="Full Name" value={studentData.name} field="name" />
          <InfoRow label="Age" value={studentData.age} field="age" />
          <InfoRow label="Grade" value={studentData.grade} field="grade" />
          <InfoRow label="School" value={studentData.school} field="school" />
          <InfoRow label="Special Notes" value={studentData.specialNotes} field="specialNotes" />
        </View>

        {/* Transport Information */}
        <View style={[styles.infoCard, styles.scrollableCard]} pointerEvents="box-none">
          <SWText style={styles.sectionTitle} pointerEvents="none">Transport Information</SWText>
          <InfoRow label="Pickup Address" value={studentData.pickupAddress} field="pickupAddress" />
          <InfoRow label="Drop-off Address" value={studentData.dropoffAddress} field="dropoffAddress" />
          { !(!studentData.vanNumber || studentData.vanNumber.trim() === '') &&
          <>
            <InfoRow label="Van Number" value={studentData.vanNumber} field="vanNumber" />
            <InfoRow label="Van Route" value={studentData.vanRoute} field="vanRoute" />
            <InfoRow label="Monthly Fee" value={studentData.monthlyFee} field="monthlyFee" />
            <View style={[{ flexDirection: 'row',     justifyContent: 'space-between',}]}> 
              <Button
                title="Resign from Van"
                varient="secondary"
                onPress={() => router.push('/parent/vansearch')}
              />
              <Button
                title="Add a Review"
                varient="outlined-primary"
                onPress={() => router.push('/parent/addReview')}
              />
            </View>
          </>
          }
          {   (!studentData.vanNumber || studentData.vanNumber.trim() === '') &&
            <Button
              title="Assign to Van"
              varient="secondary"
              onPress={() => router.push('/parent/vansearch')}
            />
          }
        </View>

        <View style={[styles.infoCard, styles.scrollableCard]} pointerEvents="box-none">
          <SWText style={styles.sectionTitle} pointerEvents="none">Contact Information</SWText>
          <InfoRow label="Parent Contact" value={studentData.parentContact} field="parentContact" />
          <InfoRow label="Emergency Contact" value={studentData.emergencyContact} field="emergencyContact" />
        </View>

        {isEditMode && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <SWText style={styles.saveButtonText}>Save Changes</SWText>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Attendance Modal */}
      <Modal
        visible={showAttendanceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAttendanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SWText style={styles.modalTitle}>Mark Tomorrow's Attendance</SWText>
            <SWText style={styles.modalSubtitle}>for {studentData.name}</SWText>
            
            <View style={styles.attendanceOptions}>
              <TouchableOpacity
                style={[
                  styles.attendanceOption,
                  attendanceStatus === 'present' && styles.selectedOption
                ]}
                onPress={() => setAttendanceStatus('present')}
              >
                <Ionicons name="checkmark-circle" size={30} color={theme.colors.backgroundLightGreen} />
                <SWText style={styles.optionText}>Present</SWText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.attendanceOption,
                  attendanceStatus === 'absent' && styles.selectedOption
                ]}
                onPress={() => setAttendanceStatus('absent')}
              >
                <Ionicons name="close-circle" size={30} color={theme.colors.backgroundLightRed} />
                <SWText style={styles.optionText}>Absent</SWText>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAttendanceModal(false)}
              >
                <SWText style={styles.cancelButtonText}>Cancel</SWText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, {backgroundColor : theme.colors.secondary} ,!attendanceStatus && styles.disabledButton]}
                onPress={submitAttendance}
                disabled={!attendanceStatus}
              >
                <SWText style={styles.confirmButtonText}>Confirm</SWText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  // Add this new style for scrollable cards
  scrollableCard: {
    // Remove any potential touch interference
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginLeft: -29, // Compensate for edit button
  },
  editButton: {
    padding: 5,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  studentName: {
    color: '#333',
    marginBottom: 5,
  },
  studentGrade: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  attendanceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  attendanceOption: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: 5,
  },
  selectedOption: {
    borderColor: '#0351bdff',
    backgroundColor: '#fafdffff',
  },
  optionText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default ChildView;