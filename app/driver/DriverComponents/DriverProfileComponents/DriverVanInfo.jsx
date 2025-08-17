import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import SWText from '../../../components/SWText';
import { useTheme } from '../../../theme/ThemeContext';

const VehicleInfo = () => {
  const { theme } = useTheme();
  const [showAssistantInfo, setShowAssistantInfo] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showSchoolsList, setShowSchoolsList] = useState(false);
  
  // Mock data for schools
  const schools = [
    { id: 1, name: 'Royal College', arrivalTime: '6:30 AM', location: 'Colombo 07', studentCount: 8 },
    { id: 2, name: 'Visakha Vidyalaya', arrivalTime: '6:45 AM', location: 'Colombo 05', studentCount: 5 },
    { id: 3, name: 'Ananda College', arrivalTime: '6:55 AM', location: 'Colombo 10', studentCount: 4 },
    { id: 4, name: 'Devi Balika Vidyalaya', arrivalTime: '7:10 AM', location: 'Colombo 08', studentCount: 3 }
  ];

  // Mock data for students
  const students = [
    { id: 1, name: 'Amandi Perera', grade: 'Grade 5', pickupLocation: 'Colombo 7' },
    { id: 2, name: 'Lehan Selaka', grade: 'Grade 3', pickupLocation: 'Colombo 5' },
    { id: 3, name: 'Duleepa Edirisinghe', grade: 'Grade 4', pickupLocation: 'Colombo 6' },
    { id: 4, name: 'Na wikramathnthri', grade: 'Grade 2', pickupLocation: 'Colombo 4' },
  ];
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    vehicleCard: {
      backgroundColor: '#ffffff',
      margin: 16,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    cardTitle: {
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: 4,
    },
    cardSubtitle: {
      color: '#7f8c8d',
      textAlign: 'center',
      marginBottom: 20,
    },
    vehicleContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    vehicleImageContainer: {
      width: 130,
      height: 90,
      borderRadius: 12,
      overflow: 'hidden',
      marginRight: 20,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    vehicleImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    vehicleDetails: {
      flex: 1,
      justifyContent: 'space-between',
    },
    vehicleName: {
      fontSize: 20,
      color: '#2c3e50',
      marginBottom: 8,
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    detailItem: {
      width: '48%',
      marginBottom: 12,
    },
    detailLabel: {
      color: theme.colors.textgreylight,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    detailValue: {
      color: theme.colors.textdark,
    },
    linkText: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    statusBadge: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    statusText: {
      color: '#ffffff',
    },
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
    assistantDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
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
    },
    studentInitials: {
      color: '#ffffff',
      // fontWeight: 'bold',
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
    schoolItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 12,
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    schoolInfo: {
      flex: 1,
    },
    schoolName: {
      color: '#2c3e50',
      marginBottom: 4,
    },
    schoolLocation: {
      color: '#7f8c8d',
      marginBottom: 4,
    },
    studentCountText: {
      color: theme.colors.primary,
      fontWeight: '500',
    },
    timeContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      minWidth: 80,
    },
    arrivalTime: {
      color: '#ffffff',
      fontWeight: 'bold',
      marginBottom: 2,
    },
    arrivalLabel: {
      color: '#ffffff',
      opacity: 0.8,
    },
    emptyStateContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      color: '#7f8c8d',
      textAlign: 'center',
      marginTop: 8,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 16,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      color: '#7f8c8d',
    },
  });
  
  return (
    <ScrollView style={styles.container}>
      {/* Vehicle Information Card */}
      <View style={styles.vehicleCard}>
        <SWText style={styles.cardTitle} uberBold lg>VEHICLE INFORMATION</SWText>
        <SWText style={styles.cardSubtitle} sm regular>Current Assigned Vehicle Details</SWText>
        
        <View style={styles.vehicleContainer}>
          <View style={styles.vehicleImageContainer}>
            <Image 
              source={require('../../../../assets/images/dummy/van.jpeg')} 
              style={styles.vehicleImage}
            />
          </View>
          
          <View style={styles.vehicleDetails}>
            <SWText style={styles.vehicleName} xl uberBold>Toyota Hiace</SWText>
            <SWText style={styles.detailValue} sm>License: ABC-1234</SWText>
            <View style={styles.statusBadge}>
              <SWText style={styles.statusText} xs bold>ACTIVE</SWText>
            </View>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>Vehicle Owner</SWText>
            <TouchableOpacity onPress={() => console.log('Navigate to owner profile')}>
              <SWText style={styles.linkText} sm>James Wilson</SWText>
            </TouchableOpacity>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>Seating Capacity</SWText>
            <SWText style={styles.detailValue} sm>15 Passengers</SWText>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>Manufacturing Year</SWText>
            <SWText style={styles.detailValue} sm>2022</SWText>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>Fuel Type</SWText>
            <SWText style={styles.detailValue} sm>Diesel</SWText>
          </View>
          <View style={[styles.detailItem]}>
            <SWText style={styles.detailLabel} xs>Travel Path</SWText>
            <View style={[styles.detailValueContainer, { flexDirection: 'row', gap: 10, alignItems: 'center' }]}>
              <SWText style={styles.detailValue} sm>Kalutara</SWText>
              {/* <SWText style={styles.detailValue} sm>to</SWText> */}
              <Ionicons name="swap-horizontal" size={18} color={theme.colors.primary} />
              <SWText style={styles.detailValue} sm>Colombo 7</SWText>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <SWText style={styles.statValue}>{students.length}</SWText>
            <SWText style={styles.statLabel} xs>Students</SWText>
          </View>
          <View style={styles.statItem}>
            <SWText style={styles.statValue}>{schools.length}</SWText>
            <SWText style={styles.statLabel} xs>Schools</SWText>
          </View>
          <View style={styles.statItem}>
            <SWText style={styles.statValue}>4.8</SWText>
            <SWText style={styles.statLabel} xs>Rating</SWText>
          </View>
        </View>
      </View>

      {/* Assistant Information */}
      <View style={styles.sectionCard}>
        <TouchableOpacity 
          style={[styles.sectionHeader, !showAssistantInfo && styles.sectionHeaderCollapsed]}
          onPress={() => setShowAssistantInfo(!showAssistantInfo)}
        >
          <View style={styles.sectionTitle}>
            <FontAwesome name="user-plus" size={18} color={theme.colors.primary} />
            <SWText style={styles.sectionTitleText} md uberBold>Assistant Information</SWText>
          </View>
          <FontAwesome 
            name={showAssistantInfo ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#7f8c8d" 
          />
        </TouchableOpacity>
        
        {showAssistantInfo && (
          <View style={styles.sectionContent}>
            <View style={styles.assistantDetails}>
              <View style={styles.detailItem}>
                <SWText style={styles.detailLabel} xs>Full Name</SWText>
                <SWText style={styles.detailValue} sm>Sarah Johnson</SWText>
              </View>
              <View style={styles.detailItem}>
                <SWText style={styles.detailLabel} xs>Contact Number</SWText>
                <SWText style={styles.detailValue} sm>+94 77 234 5678</SWText>
              </View>
              <View style={styles.detailItem}>
                <SWText style={styles.detailLabel} xs>Experience</SWText>
                <SWText style={styles.detailValue} sm>3 Years</SWText>
              </View>
              <View style={styles.detailItem}>
                <SWText style={styles.detailLabel} xs>Emergency Contact</SWText>
                <SWText style={styles.detailValue} sm>+94 77 345 6789</SWText>
              </View>
            </View>
          </View>
        )}
      </View>
      
      {/* Student List */}
      <View style={styles.sectionCard}>
        <TouchableOpacity 
          style={[styles.sectionHeader, !showStudentList && styles.sectionHeaderCollapsed]}
          onPress={() => setShowStudentList(!showStudentList)}
        >
          <View style={styles.sectionTitle}>
            <FontAwesome name="users" size={18} color={theme.colors.primary} />
            <SWText style={styles.sectionTitleText} md uberBold>
              Assigned Students ({students.length})
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
            {students.map((student, index) => (
              <View key={student.id} style={[styles.studentItem, index === students.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.studentAvatar}>
                  <SWText style={styles.studentInitials} sm uberBold>{student.name.charAt(0)}</SWText>
                </View>
                <View style={styles.studentInfo}>
                  <SWText style={styles.studentName} md uberBold>{student.name}</SWText>
                  <SWText style={styles.studentDetails} sm>{student.grade} • Pickup: {student.pickupLocation}</SWText>
                </View>
                <FontAwesome name="phone" size={16} color={theme.colors.primary} />
              </View>
            ))}
          </View>
        )}
      </View>
      
      {/* Schools Route */}
      <View style={styles.sectionCard}>
        <TouchableOpacity 
          style={[styles.sectionHeader, !showSchoolsList && styles.sectionHeaderCollapsed]}
          onPress={() => setShowSchoolsList(!showSchoolsList)}
        >
          <View style={styles.sectionTitle}>
            <FontAwesome name="map-marker" size={18} color={theme.colors.primary} />
            <SWText style={styles.sectionTitleText} md uberBold>Route & Schools</SWText>
          </View>
          <FontAwesome 
            name={showSchoolsList ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#7f8c8d" 
          />
        </TouchableOpacity>
        
        {showSchoolsList && (
          <View style={styles.sectionContent}>
            {schools.length > 0 ? (
              schools.map((school) => (
                <View key={school.id} style={styles.schoolItem}>
                  <View style={styles.schoolInfo}>
                    <SWText style={styles.schoolName} md uberBold>{school.name}</SWText>
                    <SWText style={styles.schoolLocation} sm>{school.location}</SWText>
                    <SWText style={styles.studentCountText} xs>{school.studentCount} students</SWText>
                  </View>
                  <View style={styles.timeContainer}>
                    <SWText style={styles.arrivalTime} sm>{school.arrivalTime}</SWText>
                    <SWText style={styles.arrivalLabel} xs>Arrival</SWText>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="school-outline" size={48} color="#7f8c8d" />
                <SWText style={styles.emptyStateText} sm>No schools assigned to this route yet.</SWText>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default VehicleInfo;
