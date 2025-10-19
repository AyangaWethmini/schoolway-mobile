import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import SWText from '../components/SWText';

const { width } = Dimensions.get('window');
const API_URL = Constants.expoConfig?.extra?.apiUrl;

const CurvedHeader = ({ title, theme }) => {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch unread notification count
  useEffect(() => {
    let intervalId = null;

    const fetchUnreadCount = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (!session) return;

        const user = JSON.parse(session);

        const response = await fetch(`${API_URL}/notifications/unread-count?userId=${user.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch notifications');

        const data = await response.json();
        setNotificationCount(data.unreadCount || 0);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();
    intervalId = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={headerStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0099cc" />
      
      <LinearGradient
        colors={['#0099cc', '#00bcd4', '#00d4aa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={headerStyles.gradientContainer}
      >
        <SafeAreaView style={headerStyles.safeArea}>
          <View style={headerStyles.headerContent}>
            <SWText uberBold style={headerStyles.title}>{title}</SWText>
            
            {/* Notification button */}
            <TouchableOpacity 
              style={headerStyles.notificationButton}
              activeOpacity={0.7}
              onPress={() => router.push('/notifications')} // Navigate to notifications page
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
              {!loading && notificationCount > 0 && (
                <View style={headerStyles.notificationBadge}>
                  <SWText style={headerStyles.badgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </SWText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <Svg
        height={40}
        width={width}
        style={headerStyles.wave}
        viewBox={`0 0 ${width} 40`}
      >
        <Path
          d={`M0,10 Q${width / 4},35 ${width / 2},10 T${width},10 L${width},0 L0,0 Z`}
          fill="#00d4aa"
        />
      </Svg>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  gradientContainer: {
    paddingBottom: 0,
  },
  safeArea: {
    paddingHorizontal: 20,
  },
  headerContent: {
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
  },
  wave: {
    position: 'absolute',
    top: 68.6,
    left: 0,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CurvedHeader;
