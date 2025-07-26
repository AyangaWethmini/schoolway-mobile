import { FontAwesome } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../auth/AuthContext';
import { useTheme } from "../../../theme/ThemeContext";
const API_URL = Constants.expoConfig?.extra?.apiUrl;

const DriverProfileOverview = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [driverData, setDriverData] = useState({user: null});
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const isFocused = useIsFocused();
  
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
      setIsLoading(true); // Start loading
      try {
        const response = await fetch(`${API_URL}/mobile/driver/profile/${user.id}`);
        const data = await response.json();
        setDriverData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchUserData();
  }, [isFocused]); // Refetch when the screen is focused

  // Helper to calculate years of experience from startedDriving date
  const getYearsOfExperience = (startedDriving) => {
    if (!startedDriving) return 0;
    const start = new Date(startedDriving);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const m = now.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < start.getDate())) {
      years--;
    }
    return years;
  };

  // Show loading indicator while data is being fetched
  if (isLoading || !driverData.user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
      
      <View style={styles.section}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Image 

              source={
                driverData.user.dp !== "/Images/male_pro_pic_placeholder.png"
                  ? { uri: driverData.user.dp }
                  : { uri: "https://res.cloudinary.com/db6dfgjz0/image/upload/v1753010305/driver_gkkawq.webp" }
              }
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{driverData.user.firstname} {driverData.user.lastname}</Text>
            <Text style={styles.details}>
              <Text style={styles.attribute}>Driver ID: </Text>
              {driverData.user.driverProfile?.id || 'N/A'}
            </Text>
            <Text style={styles.details}>
              <Text style={styles.attribute}>Van Service:</Text> 
              {driverData.user.driverProfile?.hasVan ? ' Enrolled' : ' Not enrolled'}
            </Text>
            <Text style={styles.details}>
              <Text style={styles.attribute}>Phone:</Text> 
              {driverData.user.mobile || 'not given'}
            </Text>
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
            <Text style={styles.statValue}>
              {driverData.user.driverProfile?.rating || 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {getYearsOfExperience(driverData.user.driverProfile?.startedDriving)} yrs
            </Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.separator} />
    </View>

  )
}

export default DriverProfileOverview;