import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AddButton from '../../components/AddButton';
import SWText from '../../components/SWText';
import Spacer from '../../components/Spacer';
import { Button } from "../../components/button";
import { useTheme } from "../../theme/ThemeContext";
import { baseStyles } from "../../theme/theme";



const Dashboard = () => {

  const router = useRouter();  
  const {theme} = useTheme();

  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'Duleepa',
      grade: '5th Grade',
      vanNumber: 'VAN-001',
      pickupTime: '7:30 AM',
      dropoffTime: '3:45 PM',
      status: 'On the way',
      driver: 'John Smith',
      contact: '+1 234-567-8901',
      isAssigned: true
    },
    {
      id: 2,
      name: 'Lehan',
      grade: '3rd Grade',
      vanNumber: 'VAN-001',
      pickupTime: '7:30 AM',
      dropoffTime: '3:45 PM',
      status: 'In School',
      driver: 'John Smith',
      contact: '+1 234-567-8901',
      isAssigned: true
    },
    {
      id: 3,
      name: 'Ayanga',
      grade: '1st Grade',
      vanNumber: null,
      pickupTime: null,
      dropoffTime: null,
      status: 'At home',
      driver: null,
      contact: null,
      isAssigned: false
    },
    {
      id: 4,
      name: 'Dineth',
      grade: '2nd Grade',
      vanNumber: null,
      pickupTime: null,
      dropoffTime: null,
      status: 'Not Assigned',
      driver: null,
      contact: null,
      isAssigned: false
    }
  ])

  const getStatusColor = (status) => {
    const {theme} = useTheme();
    switch (status.toLowerCase()) {
      case 'on the way':
        return theme.colors.statusorange
      case 'in school':
        return theme.colors.statusgreen
      case 'at home':
        return theme.colors.statusblue
      case 'not assigned':
        return theme.colors.statusgrey
      default:
        return theme.colors.statusgrey
    }
  }

  const getStatusBackgroundColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on the way':
        return theme.colors.statusbackgroundorange
      case 'in school':
        return theme.colors.statusbackgroundgreen
      case 'at home':
        return theme.colors.statusbackgroundblue
      case 'not assigned':
        return theme.colors.statusbackgroundgrey
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
        <View style={styles.section}>
          <View style={styles.Headingview}>
              <SWText uberBold xl >Your Children</SWText>
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
                      <SWText style={styles.childGrade}>{child.grade}</SWText>
                    </View>
                  </View>
                  
                  <View style={styles.cardContent}>
                    {child.isAssigned ? (
                      <View style={styles.assignmentInfo}>
                        <View style={styles.vanInfoContainer}>
                          <SWText style={styles.vanLabel}>Van</SWText>
                          <SWText style={[styles.vanNumber, { color : theme.colors.accentblue }]}>{child.vanNumber}</SWText>
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
                      varient="outlined-black"
                      onPress={() => router.push('/parent/childView')}
                      passstyles={child.isAssigned ? { flex: 1 } : null}
                    />
                    {!child.isAssigned && (
                      <Button
                        title="Assign to Van"
                        varient="secondary"
                        onPress={() => router.push('/parent/vansearch')}
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={styles.privateHireButtonContainer}>
          <View>
            <SWText uberBold xl center >Find privet hires</SWText>
          </View>
          
          <View>
            <TouchableOpacity 
              onPress={() => router.push('/parent/privateHire')}
              activeOpacity={0.8}
            >
              <ChevronRight size={20} color={theme.colors.accentblue} />
            </TouchableOpacity>
          </View>
        </View>
        <Spacer/>

        <View style={styles.section}>
          <View style={styles.Headingview}>
            <SWText uberBold xl center >Current Status</SWText>
          </View>
          <Spacer/>

          <TouchableOpacity activeOpacity={1} style={styles.downCardsContainer}>
            {children.map((child, index) => (
              <View key={child.id} style={styles.card}>
                {/* Header with name and status */}
                <View style={styles.cardHeader}>
                  <SWText style={styles.childName}>{child.name}</SWText>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBackgroundColor(child.status) }
                  ]}>
                    <SWText style={[
                      styles.statusBadgeText,
                      { color: getStatusColor(child.status) }
                    ]}>
                      {child.status}
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
    padding: 16,
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
  }
  ,
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4 ,
    paddingBottom: 6,
    gap:10,
  },

  
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
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
    paddingHorizontal: 4, // Small padding for shadow visibility
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
    elevation: 3, // Android shadow
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
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
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  privateHireButton: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#006666',
  },

  privateHireButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  privateHireButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },

  privateHireIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  privateHireIconText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
})