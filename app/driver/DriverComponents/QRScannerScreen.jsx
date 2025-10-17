import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, CameraView } from 'expo-camera';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function QRScannerScreen() {
  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync?.() || 
                         await CameraView.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    } catch (err) {
      console.error('Permission error:', err);
      setPermission(false);
    }
  };

  const markStudentAttendance = async (studentId) => {
    try {
      const sessionData = await AsyncStorage.getItem('current_session');
      const parsedSession = JSON.parse(sessionData);

      const res = await fetch(`${API_URL}/mobile/driver/session/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: parsedSession.id,
          studentId,
          type: 'PICKUP',
          status: 'PICKED_UP',
          sessionType: parsedSession.routeType,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        Alert.alert('⚠️ Error', data.message || 'Failed to mark attendance');
        return;
      }

      Alert.alert('✅ Success', 'Student marked as Picked Up', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error('Error marking attendance:', err);
      Alert.alert('❌ Error', 'Something went wrong');
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    console.log('Scanned Data:', data);

    try {
      const match = data.match(/childInfo\/(\d+)/);
      if (!match) {
        Alert.alert('❌ Invalid QR', 'This QR code is not recognized.');
        setScanned(false);
        return;
      }

      const studentId = parseInt(match[1]);
      Alert.alert('QR Scanned', `Detected student ID: ${studentId}`, [
        { text: 'Cancel', style: 'cancel', onPress: () => setScanned(false) },
        { text: 'Mark Picked Up', onPress: () => markStudentAttendance(studentId) },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Error', 'Invalid QR code format');
      setScanned(false);
    }
  };

  if (permission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestCameraPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128'],
        }}
        onBarCodeScanned={handleBarCodeScanned}
      />

      {scanned && (
        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
          <Ionicons name="reload" size={20} color="white" />
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: {
    position: 'absolute',
    bottom: 50,
    left: '25%',
    right: '25%',
    backgroundColor: '#2B3674',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },
});