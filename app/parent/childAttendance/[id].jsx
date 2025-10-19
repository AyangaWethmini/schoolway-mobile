import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Spacer from '../../components/Spacer';
import SWText from '../../components/SWText';
import { useTheme } from "../../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const { width } = Dimensions.get('window');

const childAttendance = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceHistory, setAttendanceHistory] = useState({});

  const handleBack = () => router.back();

  // 🧩 Helper to get date string in Sri Lanka timezone (no shifting)
  const getLocalDateString = (date) => {
    return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' }); // YYYY-MM-DD
  };

  // 🧠 Fetch attendance from backend
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`${API_URL}/childAttendance/calendar/${id}`);
        if (!response.ok) throw new Error('Failed to fetch attendance');
        const data = await response.json();

        // Transform API data to { "YYYY-MM-DD": { status, routeType } }
        const formatted = {};
        data.attendance.forEach((item) => {
          formatted[item.date] = { status: item.status, routeType: item.routeType };
        });
        setAttendanceHistory(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAttendance();
  }, [id]);

  const generateCalendarDays = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  // 🎨 Determine background color based on status and routeType
  const getAttendanceColor = (date) => {
    const dateStr = getLocalDateString(date);
    const record = attendanceHistory[dateStr];

    if (!record) return '#f0f0f0';
    if (record.status === 'present') return theme.colors.backgroundLightGreen;
    if (record.status === 'absent') {
      switch (record.routeType) {
        case 'MORNING_PICKUP': return '#FFD700'; // gold
        case 'EVENING_DROPOFF': return '#FF8C00'; // dark orange
        case 'BOTH': return '#FF4500'; // red-orange
        default: return theme.colors.statusbackgroundred;
      }
    }
    return '#f0f0f0';
  };

  const getAttendanceTextColor = (date) => {
    const dateStr = getLocalDateString(date);
    const record = attendanceHistory[dateStr];

    if (!record) return theme.colors.accentblue;
    if (record.status === 'present') return theme.colors.statusgreen;
    if (record.status === 'absent') return '#fff';
    return theme.colors.accentblue;
  };

  const getMonthName = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <SWText uberBold style={styles.headerTitle}>Attendance</SWText>
        </View>

        <View style={styles.calendarCard}>
          <SWText h2>
            Attendance Calendar - {getMonthName(selectedDate)} {selectedDate.getFullYear()}
          </SWText>
          <Spacer />

          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <SWText key={day} bold style={styles.dayHeader}>{day}</SWText>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>
            {generateCalendarDays().map((date, index) => {
              const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
              const isToday = getLocalDateString(date) === getLocalDateString(new Date());

              return (
                <View
                  key={index}
                  style={[
                    styles.calendarDay,
                    { backgroundColor: getAttendanceColor(date) },
                    isToday && styles.today
                  ]}
                >
                  <SWText
                    style={[
                      styles.dayText,
                      { color: getAttendanceTextColor(date) },
                      !isCurrentMonth && styles.otherMonthText,
                    ]}
                    bold={isToday}
                  >
                    {date.getDate()}
                  </SWText>
                </View>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.backgroundLightGreen }]} />
              <SWText style={styles.legendText}>Present</SWText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFD700' }]} />
              <SWText style={styles.legendText}>Absent (Morning)</SWText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF8C00' }]} />
              <SWText style={styles.legendText}>Absent (Evening)</SWText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF4500' }]} />
              <SWText style={styles.legendText}>Absent (Both)</SWText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#f0f0f0' }]} />
              <SWText style={styles.legendText}>No Record</SWText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: { padding: 5, marginRight: 15 },
  headerTitle: { fontSize: 18, color: 'white' },
  calendarCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 40,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 3, marginBottom: 20 },
  dayHeader: { width: (width - 80) / 7, color: '#666' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  calendarDay: { width: (width - 80) / 7, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 5, borderRadius: 8 },
  dayText: { fontSize: 14 },
  otherMonthText: { color: '#ccc' },
  today: { borderWidth: 2 },
  legend: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 5 },
  legendText: { fontSize: 12, color: '#666' },
});

export default childAttendance;
