import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const router = useRouter();
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  // Pulse animation for QR frame
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const markStudentAttendance = async (studentId) => {
    setLoading(true);
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
        setScanned(false);
        setLoading(false);
        return;
      }

      setLastScanned(studentId);
      Alert.alert('✅ Success', 'Student marked as Picked Up', [
        { text: 'Scan Next', onPress: () => { setScanned(false); setLoading(false); } },
        { text: 'Go Back', onPress: () => { setLoading(false); router.back(); } },
      ]);
    } catch (err) {
      console.error('Error marking attendance:', err);
      Alert.alert('❌ Error', 'Something went wrong');
      setScanned(false);
      setLoading(false);
    }
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned || loading) return;
    setScanned(true);

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    loadingText: {
      marginTop: 20,
      fontSize: 16,
      color: '#2B3674',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#F5F5F5',
    },
    permissionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#2B3674',
    },
    permissionDescription: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 30,
      color: '#666',
      lineHeight: 20,
    },
    primaryButton: {
      backgroundColor: '#2B3674',
      paddingHorizontal: 30,
      paddingVertical: 14,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 10,
      backgroundColor: 'rgba(43, 54, 116, 0.95)',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    backButton: {
      padding: 8,
    },
    torchButton: {
      padding: 8,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    qrFrame: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 12,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    corner: {
      width: 40,
      height: 40,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderColor: '#2B3674',
      position: 'absolute',
      top: -8,
      left: -8,
    },
    instructionText: {
      marginTop: 40,
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    footer: {
      paddingBottom: 30,
      paddingHorizontal: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    loadingLabel: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    scanAgainButton: {
      backgroundColor: '#2B3674',
      padding: 14,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    scanAgainText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 10,
    },
    statusText: {
      color: '#4CAF50',
      fontSize: 14,
      fontWeight: '600',
    },
    successBanner: {
      position: 'absolute',
      bottom: 40,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(76, 175, 80, 0.95)',
      padding: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    successText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 14,
    },
  });

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2B3674" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera" size={60} color="#2B3674" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionDescription}>
          We need access to your camera to scan QR codes and mark student pickups.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.primaryButton}>
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        enableZoomGesture
        enableBarcodeScanner={true}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Student QR</Text>
        <TouchableOpacity onPress={() => setTorchOn(!torchOn)} style={styles.torchButton}>
          <Ionicons name={torchOn ? 'flash' : 'flash-off'} size={24} color={torchOn ? '#FFD700' : 'white'} />
        </TouchableOpacity>
      </View>

      {/* QR Frame Overlay */}
      <View style={styles.centerContainer}>
        <Animated.View 
          style={[
            styles.qrFrame,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.corner} />
          <View style={[styles.corner, { top: 0, right: 0, transform: [{ rotate: '90deg' }] }]} />
          <View style={[styles.corner, { bottom: 0, right: 0, transform: [{ rotate: '180deg' }] }]} />
          <View style={[styles.corner, { bottom: 0, left: 0, transform: [{ rotate: '270deg' }] }]} />
        </Animated.View>

        <Text style={styles.instructionText}>
          Point your camera at a student QR code
        </Text>
      </View>

      {/* Bottom Controls */}
      <View style={styles.footer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2B3674" />
            <Text style={styles.loadingLabel}>Processing...</Text>
          </View>
        )}

        {!loading && scanned && (
          <TouchableOpacity 
            style={styles.scanAgainButton} 
            onPress={() => setScanned(false)}
          >
            <Ionicons name="reload" size={20} color="white" />
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        )}

        {!loading && !scanned && (
          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.statusText}>Ready to scan</Text>
          </View>
        )}
      </View>

      {/* Last Scanned Info */}
      {lastScanned && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-done" size={18} color="#4CAF50" />
          <Text style={styles.successText}>Student {lastScanned} picked up</Text>
        </View>
      )}
    </View>
  );
}

