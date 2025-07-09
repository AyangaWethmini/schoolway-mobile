import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useTheme } from "../theme/ThemeContext";
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';



//----------------------------------------------COMPONENT FOT THE PROFILE SECTION ON THE TOP------------------------//
const DriverProfileOverview = () => {
  
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.backgroud,
    },
    title: {
      fontSize: theme.fontSizes.large,
      fontWeight: 'bold',
      marginBottom: theme.spacing.md,
      color: theme.colors.textblack,
    },
    section: {
      paddingVertical: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.sm,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.textgreylight,
      marginVertical: theme.spacing.sm,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderColor: theme.colors.primary,
      borderWidth: 2, 
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    avatarText: {
      color: 'white',
      fontSize: theme.fontSizes.large + 8,
      fontWeight: 'bold',
    },
    profileInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      fontSize: theme.fontSizes.medium + 2,
      fontWeight: 'bold',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.xs,
    },
    editButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.backgroud,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.textgreylight,
      zIndex: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
    },
    details: {
      fontSize: theme.fontSizes.small + 2,
      color: theme.colors.textgreylight,
      marginBottom: 2,
      fontWeight : 400
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: theme.colors.backgroud,
      borderRadius: theme.borderRadius.small,
      marginHorizontal: 5,
    },
    statCard: {
      alignItems: 'center',
      flex: 1,
  
    },
    statValue: {
      fontSize: theme.fontSizes.large,
      fontWeight: 'bold',
      color: theme.colors.textblack,
    },
    statLabel: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      marginTop: theme.spacing.xs,
    },
    attribute : {
      color : theme.colors.textgreydark,
    } 
   });

  return (

    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit profile')}>
        <FontAwesome name="pencil" size={20} color={theme.colors.textgreydark} />
      </TouchableOpacity>
      
      <View style={styles.section}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Image 
              source={require('../../assets/images/dummy/driver.webp')}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.details}><Text style={styles.attribute}>Driver ID: </Text>DRV12345</Text>
            <Text style={styles.details}><Text style={styles.attribute}>Vehicle:</Text> Toyota Hiace (ABC-1234)</Text>
            <Text style={styles.details}><Text style={styles.attribute}>Phone:</Text> +94 77 123 4567</Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2 yrs</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>
      </View>
      <View style={styles.separator} />
    </View>

  )
}


//-----------------------COMPONENT FOR THE VEHICLE INFORMATION section----------------------------------//

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
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroud,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      
    },
    sectionTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.md,
    },
    vehicleContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    vehicleImageContainer: {
      width: 120,
      height: 80,
      borderRadius: theme.borderRadius.small,
      overflow: 'hidden',
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.textgreylight,
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
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.xs,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    detailLabel: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      width: 80,
    },
    detailValue: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textblack,
      flex: 1,
    },
    profileLink: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    linkText: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.accentblue,
      marginRight: theme.spacing.xs,
    },
    assistantDropdown: {
      marginTop: theme.spacing.sm,
      backgroundColor: theme.colors.backgroud,
      borderRadius: theme.borderRadius.small,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    dropdownHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize : theme.fontSizes.md,
    },
    assistantTitle: {
      fontSize: theme.fontSizes.small + 1,
      fontWeight: '600',
      color: theme.colors.textblack,
    },
    assistantDetails: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.textgreylight,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.textgreylight,
      marginVertical: theme.spacing.sm,
    },
    studentListContainer: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.textgreylight,
    },
    studentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.textgreylight,
    },
    studentInfo: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    studentName: {
      fontSize: theme.fontSizes.small + 1,
      fontWeight: '500',
      color: theme.colors.textblack,
    },
    studentDetails: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
    },
    studentAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.textgreylight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    studentInitials: {
      fontSize: theme.fontSizes.small,
      fontWeight: 'bold',
      color: theme.colors.textblack,
    },
    schoolsContainer: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.textgreylight,
    },
    schoolItem: {
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.backgroud,
      borderRadius: theme.borderRadius.small,
      overflow: 'hidden',
    },
    schoolHeader: {
      flexDirection: 'row',
      padding: theme.spacing.sm,
    },
    schoolInfo: {
      flex: 1,
    },
    schoolName: {
      fontSize: theme.fontSizes.small + 2,
      fontWeight: '600',
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.xs,
    },
    schoolLocation: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
    },
    timeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.small,
      minWidth: 80,
    },
    arrivalTime: {
      fontSize: theme.fontSizes.small,
      fontWeight: 'bold',
      color: theme.colors.textblack,
    },
    arrivalLabel: {
      fontSize: theme.fontSizes.small - 2,
      color: theme.colors.textblack,
    },
    studentCountText: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.accentblue,
      marginTop: theme.spacing.xs,
      fontWeight: '500',
    },
    routeLine: {
      position: 'absolute',
      left: 15,
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: theme.colors.primary,
      zIndex: -1,
    },
    emptyStateText: {
      textAlign: 'center',
      color: theme.colors.textgreydark,
      padding: theme.spacing.md,
    }
  });

  // Mock data for students
  const students = [
    { id: 1, name: 'Amandi Perera', grade: 'Grade 5', pickupLocation: 'Colombo 7' },
    { id: 2, name: 'Lehan Selaka', grade: 'Grade 3', pickupLocation: 'Colombo 5' },
    { id: 3, name: 'Duleepa Edirisinghe', grade: 'Grade 4', pickupLocation: 'Colombo 6' },
    { id: 4, name: 'Na wikramathnthri', grade: 'Grade 2', pickupLocation: 'Colombo 4' },
  ];
  
  return (
    <View style={styles.container}>
      {/* <Text style={styles.sectionTitle}>Vehicle Information</Text> */}
      
      <View style={styles.vehicleContainer}>
        <View style={styles.vehicleImageContainer}>
          <Image 
            source={require('../../assets/images/dummy/van.jpeg')} 
            style={styles.vehicleImage}
          />
        </View>
        
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleName}>Toyota Hiace (ABC-1234)</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Owner:</Text>
            <TouchableOpacity style={styles.profileLink} onPress={() => console.log('Navigate to owner profile')}>
              <Text style={styles.linkText}>James Wilson</Text>
              <FontAwesome name="external-link" size={12} color={theme.colors.accentblue} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Capacity:</Text>
            <Text style={styles.detailValue}>15 seats</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Year:</Text>
            <Text style={styles.detailValue}>2022</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.assistantDropdown}
        onPress={() => setShowAssistantInfo(!showAssistantInfo)}
      >
        <View style={styles.dropdownHeader}>
          <Text style={styles.assistantTitle}>Assistant Information</Text>
          <FontAwesome 
            name={showAssistantInfo ? "chevron-up" : "chevron-down"} 
            size={12} 
            color={theme.colors.textgreydark} 
          />
        </View>
        
        {showAssistantInfo && (
          <View style={styles.assistantDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>Sarah Johnson</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>+94 77 234 5678</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Experience:</Text>
              <Text style={styles.detailValue}>3 years</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.separator} />
      
      <TouchableOpacity 
        style={styles.assistantDropdown}
        onPress={() => setShowStudentList(!showStudentList)}
      >
        <View style={styles.dropdownHeader}>
          <Text style={styles.assistantTitle}>Student List ({students.length})</Text>
          <FontAwesome 
            name={showStudentList ? "chevron-up" : "chevron-down"} 
            size={12} 
            color={theme.colors.textgreydark} 
          />
        </View>
        
        {showStudentList && (
          <View style={styles.studentListContainer}>
            {students.map((student) => (
              <View key={student.id} style={styles.studentItem}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentInitials}>{student.name.charAt(0)}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentDetails}>{student.grade} • {student.pickupLocation}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
       
      </TouchableOpacity>
      
      <View style={styles.separator} />
      
      {/* Schools dropdown */}
      <TouchableOpacity 
        style={styles.assistantDropdown}
        onPress={() => setShowSchoolsList(!showSchoolsList)}
      >
        <View style={styles.dropdownHeader}>
          <Text style={styles.assistantTitle}>Destination Schools</Text>
          <FontAwesome 
            name={showSchoolsList ? "chevron-up" : "chevron-down"} 
            size={12} 
            color={theme.colors.textgreydark} 
          />
        </View>
        
        {showSchoolsList && (
          <View style={styles.schoolsContainer}>
            {/* Route line to connect the schools */}
            {schools.length > 1 && <View style={styles.routeLine} />}
            
            {schools.map((school) => (
              <View key={school.id} style={styles.schoolItem}>
                <View style={styles.schoolHeader}>
                  <View style={styles.schoolInfo}>
                    <Text style={styles.schoolName}>{school.name}</Text>
                    <Text style={styles.schoolLocation}>{school.location}</Text>
                    <Text style={styles.studentCountText}>{school.studentCount} students</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.arrivalTime}>{school.arrivalTime}</Text>
                    <Text style={styles.arrivalLabel}>Arrival</Text>
                  </View>
                </View>
              </View>
            ))}
            
            {schools.length === 0 && (
              <Text style={styles.emptyStateText}>No schools scheduled for this route.</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}























export default function Profile() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAF8F8',
    }
  });

  return (
    <ScrollView style={styles.container}>
      <DriverProfileOverview />
      <VehicleInfo />
    </ScrollView>
  )
}
