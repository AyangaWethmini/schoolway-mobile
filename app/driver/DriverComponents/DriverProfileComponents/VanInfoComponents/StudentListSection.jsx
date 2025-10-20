import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../../auth/AuthContext';
import GradientBackground from '../../../../components/GradientBackground';
import SWText from '../../../../components/SWText';
import { useTheme } from '../../../../theme/ThemeContext';
import { vehicleService } from '../services/vehicleService';

const StudentListSection = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showStudentList, setShowStudentList] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleToggle = async () => {
    setShowStudentList(!showStudentList);
    
    if (!showStudentList && !dataLoaded) {
      setLoading(true);
      try {
        const data = await vehicleService.getAssignedStudents(user.id);
        setStudents(data);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCall = async (phoneNumber) => {
    try {
      await Linking.openURL(`tel:${phoneNumber}`);
    } catch (error) {
      console.error('Error making phone call:', error);
    }
  };

  const styles = StyleSheet.create({
    sectionCard: {
      backgroundColor: '#ffffff',
      margin: 16,
      marginTop: 0,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ecf0f1',
    },
    sectionHeaderCollapsed: {
      borderBottomWidth: 0,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    sectionTitleText: {
      color: '#2c3e50',
      marginLeft: 8,
    },
    sectionContent: {
      padding: 20,
    },
    studentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ecf0f1',
    },
    studentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      overflow: 'hidden', // This ensures the image stays within the circular boundary
    },
    studentInitials: {
      color: '#ffffff',
    },
    studentInfo: {
      flex: 1,
    },
    studentName: {
      color: '#2c3e50',
      marginBottom: 2,
    },
    studentDetails: {
      color: '#7f8c8d',
    },
  });

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity 
        style={[styles.sectionHeader, !showStudentList && styles.sectionHeaderCollapsed]}
        onPress={handleToggle}
      >
        <View style={styles.sectionTitle}>
          <FontAwesome name="users" size={18} color={theme.colors.primary} />
          <SWText style={styles.sectionTitleText} md uberBold>
            Assigned Students {dataLoaded && `(${students.length})`}
          </SWText>
        </View>
        <FontAwesome 
          name={showStudentList ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#7f8c8d" 
        />
      </TouchableOpacity>
      
      {showStudentList && (
        <View style={styles.sectionContent}>
          {loading ? (
            <SWText style={styles.studentDetails} sm>Loading students...</SWText>
          ) : students.length > 0 ? (
            students.map((student, index) => (
              <View key={student.id} style={[styles.studentItem, index === students.length - 1 && { borderBottomWidth: 0 }]}>
                {student.profilePic ? (
                  <Image 
                    source={{ uri: student.profilePic }}
                    style={styles.studentAvatar}
                  />
                ) : (
                  <GradientBackground style={styles.studentAvatar}>
                    <SWText style={styles.studentInitials} sm uberBold>
                      {student.name.charAt(0)}
                    </SWText>
                  </GradientBackground>
                )}

                <View style={styles.studentInfo}>
                  <SWText style={styles.studentName} md uberBold>{student.name}</SWText>
                  <SWText style={styles.studentDetails} sm>
                    {student.grade}  •  Pickup: {student.pickupLocation}  •  Dropoff: {student.dropoffLocation}
                  </SWText>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCall(student.parentContact)}
                  style={{ padding: 8 }}
                >
                  <FontAwesome name="phone" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <SWText style={styles.studentDetails} sm>No students assigned to this vehicle.</SWText>
          )}
        </View>
      )}
    </View>
  );
};

export default StudentListSection;