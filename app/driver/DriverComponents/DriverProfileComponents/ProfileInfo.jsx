import { FontAwesome, Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../auth/AuthContext';
import Loading3 from '../../../components/LoadingComponents/Loading4';
import SWText from '../../../components/SWText';
import { useTheme } from "../../../theme/ThemeContext";
import IdImagesSection from './IdImageSection';
const API_URL = Constants.expoConfig?.extra?.apiUrl;

// IdImagesSection Component

const DriverProfileOverview = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [driverData, setDriverData] = useState({user: null});
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    headerCard: {
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
      // fontSize: 18,
      // fontWeight: 'bold',
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: 4,
    },
    cardSubtitle: {
      // fontSize: 14,
      color: '#7f8c8d',
      textAlign: 'center',
      marginBottom: 20,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: 20,
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 65,
      borderWidth: 3,
      borderColor: theme.colors.primary,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    profileInfo: {
      flex: 1,
    },
    driverName: {
      fontSize: 26,
      // fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 4,
    },
    driverId: {
      // fontSize: 16,
      color: theme.colors.primary,
      // fontWeight: '600',
      marginBottom: 8,
    },
    statusBadge: {
      backgroundColor: '#27ae60',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    statusText: {
      color: '#ffffff',
      // fontSize: 12,
      // fontWeight: '600',
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    detailItem: {
      width: '48%',
      marginBottom: 16,
    },
    detailLabel: {
      // fontSize: 12,
      color: '#7f8c8d',
      // fontWeight: '600',
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    detailValue: {
      // fontSize: 16,
      color: '#2c3e50',
      // fontWeight: '500',
    },
    licenseCard: {
      backgroundColor: '#ffffff',
      margin: 16,
      marginTop: 0,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    licenseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    licenseTitle: {
      // fontSize: 16,
      // fontWeight: 'bold',
      color: '#2c3e50',
      marginLeft: 8,
    },
    licenseDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    statsCard: {
      backgroundColor: '#ffffff',
      margin: 16,
      marginTop: 0,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    statsHeader: {
      // fontSize: 16,
      // fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 16,
      textAlign: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      // fontSize: 12,
      color: '#7f8c8d',
      // fontWeight: '600',
    },
    editButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: '#ffffff',
      padding: 8,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
      zIndex: 10,
    },
    warningCard: {
      backgroundColor: '#fff3cd',
      margin: 16,
      borderRadius: 8,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#ffc107',
      flexDirection: 'row',
      alignItems: 'center',
    },
    rejectedCard: {
      backgroundColor: '#f8d7da',
      borderLeftColor: '#dc3545',
    },
    warningText: {
      color: '#856404',
      // fontWeight: '600',
      flex: 1,
      marginLeft: 8,
    },
    rejectedText: {
      color: '#721c24',
    },
    qrSection: {
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#ecf0f1',
    },
    qrText: {
      // fontSize: 12,
      color: '#7f8c8d',
      marginTop: 8,
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/mobile/driver/profile/${user.id}`);
        const data = await response.json();
        setDriverData(data);
        console.log('Driver profile data : accessed');
        // console.log('Driver Data:', data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [isFocused]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getApprovalStatus = () => {
    switch (user.approvalstatus) {
      case 1: return { text: 'VERIFIED', color: theme.colors.success };
      case 2: return { text: 'PENDING VERIFICATION', color: theme.colors.warning };
      default: return { text: 'REJECTED DRIVER', color: theme.colors.error };
    }
  };

  if (isLoading || !driverData.user) {
    return (
      // <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      //   {/* <SWText>Loading...</SWText>
      // </View> */}
      <Loading3 showMessage={true} message="Loading profile..." style={{ backgroundColor: 'rgba(0,0,0.1)' }} />

    );
  }

  const status = getApprovalStatus();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={() => router.push('./DriverComponents/EditProfile')}>
        <FontAwesome6 name="pencil" size={16} color="#7f8c8d" />
      </TouchableOpacity>

      {user?.approvalstatus !== 1 && (
        <View style={[styles.warningCard, user.approvalstatus === 2 && styles.rejectedCard]}>
          <FontAwesome name="exclamation-triangle" size={18} color={user.approvalstatus === 0 ? "#ffc107" : "#dc3545"} />
          <SWText style={[styles.warningText, user.approvalstatus === 2 && styles.rejectedText]}>
            {user.approvalstatus === 0 
              ? "Your account request is pending approval!"
              : "Your account has been rejected. Please contact support for more information."
            }
          </SWText>
        </View>
      )}

      {/* Driver Identity Card */}
      <View style={styles.headerCard}>
        <SWText style={styles.cardTitle} uberBold lg>SCHOOLWAY DRIVER IDENTITY</SWText>
        <SWText style={styles.cardSubtitle} sm regular>Official Driver Identification Document</SWText>
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
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
            {user.approvalstatus === 1 && (
              <View style={styles.verifiedBadge}>
                <FontAwesome name="check" size={12} color="#ffffff" />
              </View>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <SWText style={styles.driverName} xl uberBold>
              {driverData.user.firstname} {driverData.user.lastname}
            </SWText>
            <SWText style={styles.driverId} sm>
              ID: {driverData.user.driverProfile?.id || 'PENDING'}
            </SWText>
            <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
              <SWText style={styles.statusText} xs bold>{status.text}</SWText>
            </View>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>License ID</SWText>
            <SWText style={styles.detailValue} sm>{driverData.user.driverProfile?.licenseId || 'N/A'}</SWText>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>NIC Number</SWText>
            <SWText style={styles.detailValue} sm>{driverData.user.nic || 'N/A'}</SWText>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>Mobile Phone</SWText>
            <SWText style={styles.detailValue} sm>{driverData.user.mobile || 'N/A'}</SWText>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>District</SWText>
            <SWText style={styles.detailValue} sm>{driverData.user.district || 'N/A'}</SWText>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>Van Service</SWText>
            <SWText style={styles.detailValue} sm>
              {driverData.user.driverProfile?.hasVan ? 'Enrolled' : 'Not Enrolled'}
            </SWText>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>Experience</SWText>
            <SWText style={styles.detailValue} sm>
              {getYearsOfExperience(driverData.user.driverProfile?.startedDriving)} Years
            </SWText>
          </View>
        </View>

        <View style={styles.qrSection}>
          <View style={{ 
            width: 60, 
            height: 60, 
            backgroundColor: '#ecf0f1', 
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Ionicons name="qr-code-sharp" size={40} color="#7f8c8d" />
          </View>
          <SWText style={styles.qrText} xs>Scan for verification</SWText>
        </View>
      </View>

      {/* License Information */}
      <View style={styles.licenseCard}>
        <View style={styles.licenseHeader}>
          <FontAwesome name="id-card" size={20} color={theme.colors.primary} />
          <SWText style={styles.licenseTitle} md uberBold>License Information</SWText>
        </View>
        
        <View style={styles.licenseDetails}>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>License Types</SWText>
            <SWText style={styles.detailValue} sm>
              {driverData.user.driverProfile?.licenseType?.join(', ') || 'N/A'}
            </SWText>
          </View>
          <View style={styles.detailItem}>
            <SWText style={styles.detailLabel} xs>Expiry Date</SWText>
            <SWText style={styles.detailValue} sm>
              {formatDate(driverData.user.driverProfile?.licenseExpiry)}
            </SWText>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <SWText style={styles.detailLabel} xs>Languages</SWText>
          <SWText style={styles.detailValue} sm>
            {driverData.user.driverProfile?.languages?.join(', ') || 'N/A'}
          </SWText>
        </View>

        {/* ID Images Collapsible Section */}
        <IdImagesSection 
          frontImage={driverData.user.driverProfile?.licenseFront}
          backImage={driverData.user.driverProfile?.licenseBack}
        />
      </View>

      {/* Performance Stats */}
      <View style={styles.statsCard}>
        <SWText style={styles.statsHeader} md uberBold>Performance Overview</SWText>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <SWText style={styles.statValue}>
              {driverData.user.driverProfile?.rating?.toFixed(1) || '0.0'}
            </SWText>
            <SWText style={styles.statLabel} xs>Rating</SWText>
          </View>
          <View style={styles.statItem}>
            <SWText style={styles.statValue} xl uberBold>
              {driverData.user.driverProfile?.ratingCount || '0'}
            </SWText>
            <SWText style={styles.statLabel} xs>Reviews</SWText>
          </View>
          <View style={styles.statItem}>
            <SWText style={styles.statValue}>
              {getYearsOfExperience(driverData.user.driverProfile?.startedDriving)}
            </SWText>
            <SWText style={styles.statLabel} xs>Years Exp.</SWText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DriverProfileOverview;