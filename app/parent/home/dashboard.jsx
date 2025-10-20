import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AddButton from '../../components/AddButton';
import CurvedHeader from '../../components/CurvedHeader';
import SWText from '../../components/SWText';
import Spacer from '../../components/Spacer';
import { Button } from "../../components/button";
import { useTheme } from "../../theme/ThemeContext";
import { baseStyles } from "../../theme/theme";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const Dashboard = () => {
  const router = useRouter();  
  const {theme} = useTheme();

  const [children, setChildren] = useState([]);

  const [loading, setLoading] = useState(true);

   useEffect(() => {

    let intervalId;

    const fetchChildren = async () => {
      try {
         const session = await AsyncStorage.getItem('user_session'); // Get logged-in user ID
        
        if (!session) {
          console.error("No user session found");
          return;
        }

          const user = JSON.parse(session);

          const response = await fetch(`${API_URL}/child/parent/${user.user.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error("Failed to fetch children");
          }

          const data = await response.json();
          setChildren(data); // Save to state
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchChildren(); 

    intervalId = setInterval(fetchChildren, 30000);

    return () => clearInterval(intervalId);

  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <SWText style={{ marginTop: 10, color: '#666' }}>Loading...</SWText>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
       case 'on_van':
        return theme.colors.statusorange
      case 'at_school':
        return theme.colors.statusgreen
      case 'at_home':
        return theme.colors.statusblue
      default:
        return theme.colors.statusgrey
    }
  }

  const getStatusBackgroundColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on_van':
        return theme.colors.statusbackgroundorange
      case 'at_school':
        return theme.colors.statusbackgroundgreen
      case 'at_home':
        return theme.colors.statusbackgroundblue
      default:
        return theme.colors.statusbackgroundgrey
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Curved Header - Now scrollable */}
        <CurvedHeader 
          title="SchoolWay" 
          theme={theme}
        />
        
        {/* Content with adjusted padding */}
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.Headingview}>
              <SWText uberBold xl darkPrimary >Your Children</SWText>
                <AddButton 
                  text={'Add Child'}
                  onPress={() => router.push('/parent/addChild')}
                />
            </View>
            <Spacer/>
            <ScrollView horizontal  contentContainerStyle={{ flexGrow: 1 }} showsHorizontalScrollIndicator={false}>
              <View style={styles.cardsContainer}>
                {children.map((child) => (
                  <View key={child.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <SWText style={styles.childName}>{child.name}</SWText>
                      <View style={styles.gradeContainer}>
                        <SWText style={styles.childGrade}>Grade {child.grade}</SWText>
                      </View>
                    </View>

                    {child.status ==='NOT_ASSIGNED' ? child.isAssigned = false : child.isAssigned = true } 
                    <View style={styles.cardContent}>
                      {child.isAssigned ? (
                        <View style={styles.assignmentInfo}>
                          <View style={styles.vanInfoContainer}>
                            <SWText style={styles.vanLabel}>Van</SWText>
                            <SWText style={[styles.vanNumber, { color : theme.colors.accentblue }]}>
                              {child.Van ? child.Van.makeAndModel : 'Loading...'}
                            </SWText>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.notAssignedContainer}>
                          <SWText style={styles.notAssignedText}>Not assigned to any van</SWText>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.buttonContainer}>
                      <Button
                        title="View Details"
                        varient="primary-transparent"
                        onPress={() => router.push(`/parent/childView/${child.id}`)}
                        passstyles={child.isAssigned ? { flex: 1 } : null}
                      />
                      {!child.isAssigned && (
                        <Button
                          title="Assign to Van"
                          varient="primary"
                          onPress={() => router.push(`/parent/vansearch/${child.id}`)}
                        />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          
          <TouchableOpacity 
            style={styles.privateHireButtonContainer}
            onPress={() => router.push('/parent/privateHire')}
            activeOpacity={0.7}
          >
            <View>
              <SWText uberBold xl darkPrimary>Find private hires</SWText>
              <SWText style={styles.privateHireSubtext}>Book a van for special trips</SWText>
            </View>
            
            <View style={styles.privateHireIconContainer}>
              <ChevronRight size={24} color={theme.colors.accentblue} />
            </View>
          </TouchableOpacity>
          <Spacer/>

          <View style={styles.section}>
            <View style={styles.Headingview}>
              <SWText uberBold xl center darkPrimary >Current Status</SWText>
            </View>
            <Spacer/>

            <TouchableOpacity activeOpacity={1} style={styles.downCardsContainer}>
              {children.map((child, index) => (
                <View key={child.id} style={styles.card}>
                  {/* Header with name and status */}
                  <View style={styles.cardHeader}>
                    <SWText darkPrimary style={styles.childName}>{child.name}</SWText>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusBackgroundColor(child.status) }
                    ]}>
                      <SWText style={[
                        styles.statusBadgeText,
                        { color: getStatusColor(child.status) }
                      ]}>
                        {child.status.replace(/_/g, ' ')}
                      </SWText>
                    </View>
                  </View>
                  
                  {/* Time info */}
                  <View style={styles.cardBody}>
                    <View style={styles.timeContainer}>
                      <SWText style={styles.timeLabel}>Pickup Time</SWText>
                      <SWText style={styles.timeValue}>{child.pickupTime || 'Not scheduled'}</SWText>
                    </View>
                  </View>
                </View>
              ))}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 20, // Reduced padding since header is now part of scroll
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  Headingview:{
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    borderBottomWidth:1,
    borderBottomColor:'#d7d8e5ff',
    paddingVertical:10,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4 ,
    paddingBottom: 6,
    gap:10,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  gradeContainer: {
    ...baseStyles.smalltagcontainer
  },
  childGrade: {
    ...baseStyles.smalltagcontent
  },
  cardContent: {
    marginBottom: 20,
  },
  assignmentInfo: {
    gap: 12,
  },
  vanInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  vanLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 8,
    fontWeight: '500',
  },
  vanNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusIndicator: {
    width: 3,
    height: 10,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  notAssignedContainer: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  notAssignedText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap:2,      
    justifyContent: 'space-between',
  },
  downCardsContainer: {
    gap: 5,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  privateHireButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  privateHireSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  privateHireIconContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    padding: 8,
  },
});