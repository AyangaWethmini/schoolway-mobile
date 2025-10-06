import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import SWText from '../../components/SWText';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');
const API_URL = Constants.expoConfig?.extra?.apiUrl;


const GenerateQR = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const {id }  = useLocalSearchParams();
  const childId = id; 
  const [isLoading, setIsLoading] = useState(true);
  const [qrData, setQrData] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const qrCodeRef = useRef(null);
  const [childName, setChildName] = useState('Not Found'); // Placeholder name

  // Styles

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSizes.medium,
      color: theme.colors.textgreydark,
    },
    contentContainer: {
      alignItems: 'center',
      width: '100%',
    },
    title: {
      fontSize: theme.fontSizes.large + 4,
      fontWeight: 'bold',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
      lineHeight: 22,
    },
    qrContainer: {
      backgroundColor: 'white',
      padding: theme.spacing.xl,
      borderRadius: theme.borderRadius.large,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      marginBottom: theme.spacing.xl,
      alignItems: 'center',
    },
    childInfo: {
      backgroundColor: theme.colors.primary + '10',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      marginBottom: theme.spacing.lg,
      width: '100%',
      alignItems: 'center',
    },
    childName: {
      fontSize: theme.fontSizes.medium + 2,
      color: theme.colors.accentblue,
      marginBottom: theme.spacing.xs,
    },
    childId: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      fontWeight: '500',
    },
    qrInfo: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.sm,
      backgroundColor: '#f8f9fa',
      borderRadius: theme.borderRadius.small,
      width: '100%',
    },
    qrInfoText: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      gap: theme.spacing.md,
    },
    button: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.medium,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    shareButton: {
      backgroundColor: theme.colors.accentblue,
    },
    buttonText: {
      color: 'white',
      fontSize: theme.fontSizes.medium,
      marginLeft: theme.spacing.sm,
    },
    disabledButton: {
      backgroundColor: theme.colors.textgreylight,
    },
    instructionsContainer: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.md,
      backgroundColor: '#fff3cd',
      borderRadius: theme.borderRadius.small,
      borderLeftWidth: 4,
      borderLeftColor: '#ffc107',
    },
    instructionsTitle: {
      fontSize: theme.fontSizes.medium,
      color: '#856404',
      marginBottom: theme.spacing.sm,
    },
    instructionText: {
      fontSize: theme.fontSizes.small,
      color: '#856404',
      lineHeight: 20,
    },
  });

  // Generate unique QR data for the child
  useEffect(() => {
  const fetchQrFromBackend = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching QR for childId:', childId);

        const response = await fetch(`${API_URL}/child/QRcode/${childId}`);
        if (!response.ok) throw new Error('Failed to fetch child');

        setChildName(response.name);

        const data = await response.json();
        setQrData(data.qrCode); 
      } catch (error) {
        console.error('Error fetching QR:', error);
        Alert.alert('Error', 'Unable to load QR code');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrFromBackend();
  }, [childId]);

  const downloadQR = async () => {
    try {
      setIsDownloading(true);
      
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library permissions to save the QR code.');
        return;
      }

      // Get QR code as SVG and convert to base64
      qrCodeRef.current.toDataURL((dataURL) => {
        saveQRCode(dataURL);
      });

    } catch (error) {
      console.error('Error downloading QR code:', error);
      Alert.alert('Error', 'Failed to download QR code');
    } finally {
      setIsDownloading(false);
    }
  };

  const saveQRCode = async (base64Data) => {
    try {
      const filename = `${childName}_QR_${Date.now()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      // Save to file system
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('SchoolWay QR Codes');
      
      if (album == null) {
        await MediaLibrary.createAlbumAsync('SchoolWay QR Codes', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert(
        'Success!', 
        `QR code for ${childName} has been saved to your gallery.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert('Error', 'Failed to save QR code to gallery');
    }
  };

  const shareQR = async () => {
    try {
      if (Platform.OS === 'ios') {
        qrCodeRef.current.toDataURL(async (dataURL) => {
          const filename = `${childName}_QR_${Date.now()}.png`;
          const fileUri = `${FileSystem.documentDirectory}${filename}`;
          
          await FileSystem.writeAsStringAsync(fileUri, dataURL, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await Sharing.shareAsync(fileUri, {
            mimeType: 'image/png',
            dialogTitle: `Share ${childName}'s QR Code`,
          });
        });
      } else {
        // For Android, use the Share API with text
        await Share.share({
          title: `${childName}'s QR Code`,
          message: `QR Code for ${childName} - SchoolWay Attendance\nChild ID: ${childId}`,
        });
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <SWText style={styles.loadingText}>Generating unique QR code...</SWText>
        </View>
      </View>
    );
  }

return (
    <SafeAreaView style={styles.container}>
        <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <SWText h1>Student QR Code</SWText>
                    <SWText h2 style={styles.subtitle}>
                        This QR code uniquely identifies your child for attendance tracking
                    </SWText>

                    <View style={styles.childInfo}>
                        <SWText uberBold style={styles.childName}>{childName ? childName : 'Duleepa Anjana'}</SWText>
                        <SWText style={styles.childId}>Student ID: 
                            {childId ? childId : ' Stu-100203'}
                        </SWText>
                    </View>

                    {qrData ? (
                      <View style={styles.qrContainer}>
                        <SWText h3 style={{ marginBottom: 10 }}>Scan this QR</SWText>
                        <Image
                          source={{ uri: qrData }}
                          style={{ width: width * 0.6, height: width * 0.6, borderRadius: 8 }}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <SWText style={styles.qrInfoText}>QR code not available</SWText>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, isDownloading && styles.disabledButton]}
                            onPress={downloadQR}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <>
                                    <Ionicons name="download-outline" size={20} color="white" />
                                    <SWText uberBold style={styles.buttonText}>
                                        Download
                                    </SWText>
                                </>
                            )}
                            {isDownloading && (
                                <SWText uberBold style={styles.buttonText}>
                                    Saving...
                                </SWText>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.shareButton]}
                            onPress={shareQR}
                        >
                            <MaterialIcons name="share" size={18} color="white" />
                            <SWText uberBold style={styles.buttonText}>Share</SWText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.instructionsContainer}>
                        <SWText uberBold style={styles.instructionsTitle}>How to use:</SWText>
                        <SWText uberMedium style={styles.instructionText}>
                            • Show this QR code to the driver for attendance{'\n'}
                            • Get a physical copy of this and leave it with your child{'\n'}
                            • Each scan will record the time and location{'\n'}
                            • This will keep you notified about the child's safety{'\n'}
                            • Keep the QR code accessible on your phone{'\n'}
                            • Download and save as backup
                        </SWText>
                    </View>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
);
};

export default GenerateQR;