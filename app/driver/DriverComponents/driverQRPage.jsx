import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function DriverQRPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState('');

  const fetchDriverQR = async () => {
    try {
      setLoading(true);
      const session = await AsyncStorage.getItem('user_session');
      const parsed = JSON.parse(session);
      const userId = parsed?.user?.id;

      if (!userId) return;

      const res = await fetch(`${API_URL}/mobile/driver/qr/${userId}`);
      const data = await res.json();

      if (data.success && data.qrCode) {
        setQrCode(data.qrCode);
        setDriverName(`${parsed.user.firstname || ''} ${parsed.user.lastname || ''}`);
      } else {
        console.log('QR fetch failed:', data);
      }
    } catch (err) {
      console.error('Error fetching QR:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverQR();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.backgroud }]}>
        <View style={[styles.loadingCard, { backgroundColor: theme.colors.textwhite }]}>
          <ActivityIndicator size="large" color={theme.colors.accentblue} />
          <Text style={[styles.loadingText, { color: theme.colors.textgreydark }]}>
            Loading your QR code...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroud }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.textwhite} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.textwhite }]}>QR Code</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Driver Info Card */}
        <View style={[styles.driverCard, { backgroundColor: theme.colors.textwhite }]}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.colors.primary + '15' }]}>
            <Ionicons name="person-circle" size={48} color={theme.colors.primary} />
          </View>
          <Text style={[styles.driverName, { color: theme.colors.accentblue }]}>
            {driverName || 'Driver'}
          </Text>
          <Text style={[styles.driverLabel, { color: theme.colors.textgreylight }]}>
            Scan to verify
          </Text>
        </View>

        {/* QR Code Card */}
        <View style={[styles.qrCard, { backgroundColor: theme.colors.textwhite }]}>
          {qrCode ? (
            <>
              <Text style={[styles.qrLabel, { color: theme.colors.textgreydark }]}>
                Show this QR code to the School Gurdian
              </Text>
              <View style={styles.qrContainer}>
                <Image 
                  source={{ uri: qrCode }} 
                  style={styles.qrImage}
                />
              </View>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                No QR Code available
              </Text>
            </View>
          )}
        </View>

        {/* Refresh Button */}
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: theme.colors.accentblue }]}
          onPress={fetchDriverQR}
          activeOpacity={0.8}
        >
          <Ionicons name="reload-outline" size={18} color="white" />
          <Text style={styles.refreshText}>Refresh QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  loadingCard: {
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  driverCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  driverLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  qrCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  qrLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 0,
  },
  qrImage: { 
    width: 220, 
    height: 220,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: { 
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshText: { 
    color: 'white', 
    marginLeft: 8, 
    fontWeight: '700',
    fontSize: 14,
  },
  loadingText: { 
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});