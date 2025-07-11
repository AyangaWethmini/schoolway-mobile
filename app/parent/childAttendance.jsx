import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import TextHeading from '../components/TextHeading';
import { useTheme } from "../theme/ThemeContext";

const { width } = Dimensions.get('window');


const SchoolVanScreen = ({ navigation }) => {

  const { theme } = useTheme();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleBack = () => {
    navigation.goBack();
  };

  const [attendanceHistory, setAttendanceHistory] = useState({
    '2025-07-10': 'present',
    '2025-07-09': 'absent',
    '2025-07-07': 'present',
    '2025-07-08': 'present',
    '2025-07-01': 'absent',
    '2025-07-02': 'present',
    '2025-07-03': 'present',
    '2025-07-04': 'present',
    '2025-07-05': 'absent',
    '2025-07-06': 'present'
  });

   const generateCalendarDays = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days = [];
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      
      return days;
    };
  
    const getAttendanceColor = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      const status = attendanceHistory[dateStr];
      if (status === 'present') return theme.colors.backgroundLightGreen;
      if (status === 'absent') return theme.colors.backgroundLightRed;
      return '#f0f0f0';
    };
  
    const getMonthName = (date) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
      return months[date.getMonth()];
    };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={[styles.header, { backgroundColor : theme.colors.primary } ]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance</Text>
        </View>

        <View style={styles.calendarCard}>
          <TextHeading>Attendance Calendar - {getMonthName(selectedDate)} {selectedDate.getFullYear()}</TextHeading>
          
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.dayHeader}>{day}</Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {generateCalendarDays().map((date, index) => {
              const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <View
                  key={index}
                  style={[
                    styles.calendarDay,
                    { backgroundColor: getAttendanceColor(date) },
                    isToday && styles.today
                  ]}
                >
                  <Text style={[
                    styles.dayText,
                    !isCurrentMonth && styles.otherMonthText,
                    isToday && styles.todayText
                  ]}>
                    {date.getDate()}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.backgroundLightGreen }]} />
              <Text style={styles.legendText}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.backgroundLightRed }]} />
              <Text style={styles.legendText}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#f0f0f0' }]} />
              <Text style={styles.legendText}>No Record</Text>
            </View>
          </View>
        </View>

      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight:'bold',
    color: '#000',
  },
  calendarCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 40,
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:3,
    marginBottom: 20,
  },
  dayHeader: {
    width: (width - 80) / 7,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap:5,
  },
  calendarDay: {
    width: (width - 80) / 7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  otherMonthText: {
    color: '#ccc',
  },
  today: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  todayText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  
});

export default SchoolVanScreen;