import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AddButton from '../../components/AddButton';
import TextHeading from '../../components/TextHeading';
import { Button } from "../../components/button";
import { useTheme } from "../../theme/ThemeContext";
import { baseStyles } from "../../theme/theme";



const Dashboard = () => {
  // Mock data for parent's children
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
      status: 'at home',
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
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <View style={styles.Headingview}>
            <TextHeading>Your Children</TextHeading>
            <AddButton 
              text={'Add Child'}
              onPress={() => router.push('/parent/addChild')}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              {children.map((child) => (
                <View key={child.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <View style={styles.gradeContainer}>
                      <Text style={styles.childGrade}>{child.grade}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardContent}>
                    {child.isAssigned ? (
                      <View style={styles.assignmentInfo}>
                        <View style={styles.vanInfoContainer}>
                          <Text style={styles.vanLabel}>Van</Text>
                          <Text style={[styles.vanNumber, { color : theme.colors.accentblue }]}>{child.vanNumber}</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.notAssignedContainer}>
                        <Text style={styles.notAssignedText}>Not assigned to any van</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.buttonContainer}>
                    <Button
                      title="View Details"
                      varient="outlined-black"
                      onPress={() => console.log('Outlined Black pressed')}
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

        <View style={styles.section}>
          <TextHeading>Current Status</TextHeading>
          <View style={styles.table}>

            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.nameColumn]}>Name</Text>
              <Text style={[styles.tableHeaderText, styles.timeColumn]}>Time</Text>
              <Text style={[styles.tableHeaderText, styles.statusColumn]}>Status</Text>
            </View>
            
            {children.map((child, index) => (
              <View key={child.id} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                <Text style={[styles.tableCell, styles.nameColumn]}>{child.name}</Text>
                <Text style={[styles.tableCell, styles.timeColumn]}>{child.pickupTime || 'N/A'}</Text>
                <View style={[styles.tableCell, styles.statusColumn]}>
                  <View style={[
                    styles.statusTag,
                    { backgroundColor: getStatusBackgroundColor(child.status) }
                  ]}>
                    <Text style={[
                      styles.statusTagText,
                      { color: getStatusColor(child.status) }
                    ]}>
                      {child.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
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
    justifyContent:'space-between'
  }
  ,
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    marginVertical: 10,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
    justifyContent: 'space-between',
  },
  table: {
    overflow: 'hidden',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',

  },
  tableHeaderText: {
    color: '#00000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableRow: {
    backgroundColor:'#ffffff',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },
  nameColumn: {
    flex: 1,
  },
  timeColumn: {
    flex: 1,
  },
  statusColumn: {
    flex: 1,
    textAlign:'center',
    flexDirection:'row',
    justifyContent:'center'
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
})