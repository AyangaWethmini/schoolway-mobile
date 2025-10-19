import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function DriverQRPage() {
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2B3674" />
        <Text style={styles.loadingText}>Loading your QR code...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Driver QR Code</Text>
      <Text style={styles.subHeader}>{driverName}</Text>

      {qrCode ? (
        <Image source={{ uri: qrCode }} style={styles.qrImage} />
      ) : (
        <Text style={styles.errorText}>No QR Code available</Text>
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={fetchDriverQR}>
        <Ionicons name="reload-outline" size={20} color="white" />
        <Text style={styles.refreshText}>Refresh QR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', alignItems: 'center', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#2B3674', marginTop: 20 },
  subHeader: { fontSize: 16, color: '#555', marginBottom: 20 },
  qrImage: { width: 250, height: 250, marginBottom: 30 },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: '#2B3674',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshText: { color: 'white', marginLeft: 8, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#555' },
  errorText: { color: '#999', marginTop: 10 },
});
