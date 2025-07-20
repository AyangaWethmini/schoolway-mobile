import { FontAwesome, Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from "../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

//----------------------------------------------REUSABLE DOCUMENT ITEM COMPONENT------------------------//
const DocumentItem = ({ 
  name, 
  validUntil, 
  onUpload, 
  onRemind,
  uploadLabel = "Upload", 
  remindLabel = "Remind Owner" 
}) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    documentItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.textgreylight,
    },
    documentName: {
      fontSize: theme.fontSizes.small + 1,
      fontWeight: '500',
      color: theme.colors.textblack,
      marginBottom: 2,
    },
    documentDate: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
    },
    documentActions: {
      flexDirection: 'row',
    },
    smallButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: theme.borderRadius.small,
      marginLeft: 6,
    },
    smallButtonText: {
      color: 'white',
      fontSize: theme.fontSizes.small - 1,
      marginLeft: 4,
      fontWeight: '500',
    }
  });

  return (
    <View style={styles.documentItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.documentName}>{name}</Text>
        <Text style={styles.documentDate}>Valid until: {validUntil}</Text>
      </View>
      <View style={styles.documentActions}>
        <TouchableOpacity 
          style={[styles.smallButton, { backgroundColor: theme.colors.primary }]}
          onPress={onUpload}
        >
          <FontAwesome name="upload" size={12} color="white" />
          <Text style={styles.smallButtonText}>{uploadLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.smallButton, { backgroundColor: theme.colors.accentblue }]}
          onPress={onRemind}
        >
          <FontAwesome name="bell" size={12} color="white" />
          <Text style={styles.smallButtonText}>{remindLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//----------------------------------------------COMPONENT FOT THE PROFILE SECTION ON THE TOP------------------------//
const DriverProfileOverview = () => {
  const {logout, user} = useAuth();
  const router = useRouter();
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

   useEffect(() => {
    // Fetch user data to show on profile from backend api mobile/profile/data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/mobile/profile/data`);
        const data = await response.json();
        // Update state with fetched data
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  return (

    <View style={styles.container}> 

      {user?.approvalstatus !== 1 && (
        <View style={{
          backgroundColor: '#FFF3CD',
          borderRadius: 8,
          padding: 10,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#FFECB5',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <FontAwesome name="exclamation-triangle" size={18} color="#FFA500" style={{ marginRight: 8 }} />
         {user.approvalstatus === 0 ? (
          <Text style={{ color: '#856404', fontWeight: '600', flex: 1 }}>
            Your account request is pending approval!
          </Text>
          ) : (
           <Text style={{ color: '#D32F2F', fontWeight: '600', flex: 1 }}>
            Your account has been rejected. Please contact support for more information.
          </Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.editButton} onPress={() => router.push('./DriverComponents/EditProfile')}>
        <FontAwesome6 name="pencil" size={20} color="black" />
      </TouchableOpacity>
      {/* <Link href="/allindex" > see font type {user.approvalstatus}</Link> */}

        <Ionicons name="log-out-outline" size = {24} onPress={logout}></Ionicons>
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


//----------------------------VEHICLE CHECKUPS and REMINDERS-----------------------------------------------//

const LicenseAndVehicleCheckups = () => {
  const { theme } = useTheme();
  const [showLicenseInfo, setShowLicenseInfo] = useState(true);
  const [showVehicleCheckups, setShowVehicleCheckups] = useState(true);
  
  // Mock data - in real app this would come from API or state
  const licenseExpiryDate = "2024-07-15"; // Format: YYYY-MM-DD
  const lastCheckupDate = "2024-07-09"; // Format: YYYY-MM-DD
  const nextCheckupDate = "2025-09-09"; // Format: YYYY-MM-DD (2 months from current date)
  
  // Calculate days until license expiry
  const today = new Date();
  const expiryDate = new Date(licenseExpiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  // Last checkup reference (used for display only)
  
  // Calculate days until next checkup
  const nextCheckupDateObj = new Date(nextCheckupDate);
  const daysUntilNextCheckup = Math.ceil((nextCheckupDateObj - today) / (1000 * 60 * 60 * 24));
  
  // Determine alert levels
  const getLicenseAlertLevel = () => {
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'urgent';
    if (daysUntilExpiry <= 60) return 'warning';
    return 'ok';
  };
  
  const getCheckupAlertLevel = () => {
    if (daysUntilNextCheckup < 0 && Math.abs(daysUntilNextCheckup) > 30) return 'critical';
    if (daysUntilNextCheckup < 0) return 'overdue';
    if (daysUntilNextCheckup <= 30) return 'upcoming';
    if (daysUntilNextCheckup > 30) return 'healthy'; // 2+ months is a healthy state
    return 'ok';
  };
  
  const licenseAlertLevel = getLicenseAlertLevel();
  const checkupAlertLevel = getCheckupAlertLevel();
  
  // Get appropriate colors based on alert level
  const getLicenseAlertColor = () => {
    switch (licenseAlertLevel) {
      case 'expired': return theme.colors.error;
      case 'urgent': return '#FF6B00'; // Orange
      case 'warning': return theme.colors.primary; // Yellow
      default: return '#4CAF50'; // Green
    }
  };
  
  const getCheckupAlertColor = () => {
    switch (checkupAlertLevel) {
      case 'critical': return '#8B0000'; // Dark Red for critical/severe warning
      case 'overdue': return theme.colors.error;
      case 'upcoming': return '#FF6B00'; // Orange
      case 'healthy': return '#4CAF50'; // Bright green for healthy status
      default: return '#4CAF50'; // Green
    }
  };
  
  const licenseAlertColor = getLicenseAlertColor();
  const checkupAlertColor = getCheckupAlertColor();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroud,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.sm,
    },
    alertContainer: {
      borderRadius: theme.borderRadius.small,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    alertTitle: {
      fontSize: theme.fontSizes.medium - 2,
      fontWeight: '600',
      color: theme.colors.textblack,
    },
    alertInfo: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.sm,
    },
    alertStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.xs,
    },
    statusText: {
      fontSize: theme.fontSizes.small,
      fontWeight: '500',
    },
    dateInfo: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.xs,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.textgreylight,
      marginVertical: theme.spacing.sm,
    },
    button: {
      backgroundColor: theme.colors.accentblue,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.small,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    buttonText: {
      color: theme.colors.textwhite,
      fontWeight: '600',
      fontSize: theme.fontSizes.small,
    },
    dropdownHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    dropdownTitle: {
      fontSize: theme.fontSizes.small + 1,
      fontWeight: '600',
      color: theme.colors.textblack,
    },
    contentContainer: {
      backgroundColor: theme.colors.backgroud,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.small,
      borderWidth: 1,
      borderColor: theme.colors.textgreylight,
    },
    // Document list container styles (only keeping container styles)
    documentList: {
      marginTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.textgreylight,
      paddingTop: theme.spacing.sm,
    },
    documentListTitle: {
      fontSize: theme.fontSizes.small + 2,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.sm,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>License & Vehicle Status</Text>
      
      {/* License Expiration Section */}
      <TouchableOpacity 
        style={[styles.contentContainer, { borderLeftWidth: 3, borderLeftColor: licenseAlertColor }]
        }
        onPress={() => setShowLicenseInfo(!showLicenseInfo)}
      >
        <View style={styles.dropdownHeader}>
          <Text style={styles.dropdownTitle}>Driving License Status</Text>
          <FontAwesome 
            name={showLicenseInfo ? "chevron-up" : "chevron-down"} 
            size={12} 
            color={theme.colors.textgreydark} 
          />
        </View>
        
        {showLicenseInfo && (
          <>
            <View style={styles.alertStatus}>
              <View style={[styles.statusDot, { backgroundColor: licenseAlertColor }]} />
              <Text style={[styles.statusText, { color: licenseAlertColor }]}>
                {licenseAlertLevel === 'expired' ? 'License Expired' :
                 licenseAlertLevel === 'urgent' ? 'Expiring Soon' :
                 licenseAlertLevel === 'warning' ? 'Renewal Recommended' : 'Valid'}
              </Text>
            </View>
            
            <Text style={styles.dateInfo}>
              <Text style={{ fontWeight: '500' }}>Expiry Date:</Text> {formatDate(licenseExpiryDate)}
            </Text>
            
            {daysUntilExpiry > 0 ? (
              <Text style={styles.alertInfo}>Your driving license will expire in {daysUntilExpiry} days. {daysUntilExpiry <= 30 ? 'Please renew it as soon as possible.' : 'Plan for renewal ahead of time.'}</Text>
            ) : (
              <Text style={styles.alertInfo}>Your driving license has expired. You must renew it immediately before continuing to drive.</Text>
            )}
            
            {(daysUntilExpiry <= 30 || daysUntilExpiry < 0) && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => console.log('Upload new license document')}
              >
                <Text style={styles.buttonText}>Upload New License Document</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </TouchableOpacity>
      
      <View style={styles.separator} />
      
      {/* Vehicle Checkups Section */}
      <TouchableOpacity 
        style={[styles.contentContainer, { borderLeftWidth: 3, borderLeftColor: checkupAlertColor }]
        }
        onPress={() => setShowVehicleCheckups(!showVehicleCheckups)}
      >
        <View style={styles.dropdownHeader}>
          <Text style={styles.dropdownTitle}>Vehicle Condition Status</Text>
          <FontAwesome 
            name={showVehicleCheckups ? "chevron-up" : "chevron-down"} 
            size={12} 
            color={theme.colors.textgreydark} 
          />
        </View>
        
        {showVehicleCheckups && (
          <>
            <View style={styles.alertStatus}>
              <View style={[styles.statusDot, { backgroundColor: checkupAlertColor }]} />
              <Text style={[styles.statusText, { color: checkupAlertColor }]}>
                {checkupAlertLevel === 'critical' ? 'Critical: Severely Overdue' :
                 checkupAlertLevel === 'overdue' ? 'Checkup Overdue' :
                 checkupAlertLevel === 'upcoming' ? 'Checkup Soon' : 
                 checkupAlertLevel === 'healthy' ? 'Vehicle in Good Standing' : 'Status Good'}
              </Text>
            </View>
            
            <Text style={styles.dateInfo}>
              <Text style={{ fontWeight: '500' }}>Last Checkup:</Text> {formatDate(lastCheckupDate)}
            </Text>
            
            <Text style={styles.dateInfo}>
              <Text style={{ fontWeight: '500' }}>Next Due:</Text> {formatDate(nextCheckupDate)}
            </Text>
            
            {daysUntilNextCheckup > 0 ? (
              <>
                <Text style={styles.alertInfo}>
                  Next vehicle condition test is in {daysUntilNextCheckup} days. 
                  {daysUntilNextCheckup <= 30 
                    ? 'Please prepare for the test.' 
                    : 'Your vehicle is up to date with required inspections.'}
                </Text>
                {daysUntilNextCheckup > 30 && (
                  <Text style={[styles.alertInfo, { color: '#4CAF50', fontWeight: '500' }]}>
                    STATUS: Vehicle is in good condition and compliant with all requirements.
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text style={styles.alertInfo}>Your vehicle condition test is overdue by {Math.abs(daysUntilNextCheckup)} days. Please schedule it immediately.</Text>
                {Math.abs(daysUntilNextCheckup) > 30 && (
                  <Text style={[styles.alertInfo, { color: theme.colors.error, fontWeight: '600' }]}>
                    WARNING: Vehicle condition check is overdue by more than 30 days. Vehicle operation may be restricted until inspection is completed.
                  </Text>
                )}
              </>
            )}
            
            <View style={styles.documentList}>
              <Text style={styles.documentListTitle}>Required Documents</Text>
              
              <DocumentItem 
                name="Emissions Test" 
                validUntil="Oct 9, 2025" 
                onUpload={() => console.log('Upload emissions document')}
                onRemind={() => console.log('Remind owner about emissions')}
              />
              
              <DocumentItem 
                name="Insurance" 
                validUntil="Nov 15, 2025" 
                onUpload={() => console.log('Upload insurance document')}
                onRemind={() => console.log('Remind owner about insurance')}
              />
              
              <DocumentItem 
                name="Road Tax" 
                validUntil="Dec 31, 2025" 
                onUpload={() => console.log('Upload road tax document')}
                onRemind={() => console.log('Remind owner about road tax')}
              />
              
              <DocumentItem 
                name="Vehicle Fitness Certificate" 
                validUntil="Aug 10, 2025" 
                onUpload={() => console.log('Upload fitness certificate')}
                onRemind={() => console.log('Remind owner about fitness certificate')}
              />
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.md }}>
              <TouchableOpacity 
                style={[
                  styles.button, 
                  { 
                    flex: 1, 
                    marginRight: daysUntilNextCheckup <= 0 ? 8 : 0,
                    backgroundColor: daysUntilNextCheckup > 30 ? '#4CAF50' : theme.colors.accentblue 
                  }
                ]} 
                onPress={() => console.log('Remind owner')}
              >
                <Text style={styles.buttonText}>
                  {daysUntilNextCheckup > 30 ? 'Set General Reminder' : 'Remind Owner'}
                </Text>
              </TouchableOpacity>
              
              {daysUntilNextCheckup <= 0 && (
                <TouchableOpacity 
                  style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: theme.colors.primary }]} 
                  onPress={() => console.log('Schedule inspection')}
                >
                  <Text style={[styles.buttonText, { color: theme.colors.textblack }]}>Schedule Inspection</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
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
      <LicenseAndVehicleCheckups />
    </ScrollView>
  )
}
