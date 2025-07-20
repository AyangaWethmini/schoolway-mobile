import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
const API_URL = Constants.expoConfig?.extra?.apiUrl;

const EditProfile = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    nic: '',
    licenseId: '',
    licenseExpiry: '',
    licenseType: [],
    relocate: false,
    startedDriving: '',
    languages: [],
    bio: '',
  });
  
  // Image states
  const [images, setImages] = useState({
    profileImage: null,
    licenseFront: null,
    licenseBack: null,
    nicPic: null,
    policeReport: null,
    medicalReport: null,
  });
  
  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState({
    birthDate: false,
    licenseExpiry: false,
    startedDriving: false,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.backgroud,
    },
    scrollContainer: {
      padding: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: 'bold',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.fontSizes.small,
      fontWeight: '600',
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.textgreylight,
      borderRadius: theme.borderRadius.small,
      padding: theme.spacing.sm,
      fontSize: theme.fontSizes.small,
      color: theme.colors.textblack,
      backgroundColor: theme.colors.background,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    dateButton: {
      borderWidth: 1,
      borderColor: theme.colors.textgreylight,
      borderRadius: theme.borderRadius.small,
      padding: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    dateButtonText: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textblack,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderColor: theme.colors.primary,
      borderWidth: 2, 
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      overflow: 'hidden',
    },
    imageUploadContainer: {
      borderWidth: 1,
      borderColor: theme.colors.textgreylight,
      borderRadius: theme.borderRadius.small,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    imageUploadButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.small,
      flexDirection: 'row',
      alignItems: 'center',
    },
    imageUploadButtonText: {
      color: 'white',
      marginLeft: theme.spacing.xs,
      fontSize: theme.fontSizes.small,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.small,
      alignItems: 'center',
      // marginTop: theme.spacing.lg,
    },
    saveButtonText: {
      color: 'white',
      fontSize: theme.fontSizes.medium,
      fontWeight: 'bold',
    },
    disabledButton: {
      backgroundColor: theme.colors.textgreylight,
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/mobile/driver/profile/${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        const userData = data.user;
        const driverData = userData.driverProfile;
        
        setFormData({
          firstName: userData.firstname || '',
          lastName: userData.lastname || '',
          email: userData.email || '',
          phone: userData.mobile || '',
          address: userData.address || '',
          birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : '',
          nic: userData.nic || '',
          licenseId: driverData?.licenseId || '',
          licenseExpiry: driverData?.licenseExpiry ? new Date(driverData.licenseExpiry).toISOString().split('T')[0] : '',
          licenseType: driverData?.licenseType || [],
          relocate: driverData?.relocate || false,
          startedDriving: driverData?.startedDriving ? new Date(driverData.startedDriving).toISOString().split('T')[0] : '',
          languages: driverData?.languages || [],
          bio: driverData?.bio || '',
        });

        setImages({
          profileImage: userData.dp || null,
          licenseFront: driverData?.licenseFront || null,
          licenseBack: driverData?.licenseBack || null,
          nicPic: userData.nicPic || null,
          policeReport: driverData?.policeReport || null,
        });
      } else {
        Alert.alert('Error', 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event, selectedDate, field) => {
    setShowDatePicker(prev => ({
      ...prev,
      [field]: false
    }));
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      handleInputChange(field, dateString);
    }
  };

  const pickImage = async (imageType) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImages(prev => ({
        ...prev,
        [imageType]: base64Image
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData = {
        ...formData,
        ...images
      };

      const response = await fetch(`${API_URL}/mobile/driver/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully', [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.textgreydark }}>
          Loading profile data...
        </Text>
      </View>
    );
  }

  return (
    // <View style={[styles.container, { marginBottom: 50 }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Profile Image */}
        <View style={{ alignItems: 'center', marginBottom: theme.spacing.lg }}>
            <View
                style={{
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.colors.textgreylight,
                }}
            >
                <TouchableOpacity
                    style={{ width: 150, height: 150, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => pickImage('profileImage')}
                    activeOpacity={0.8}
                >
                    <Image
                        source={
                            images.profileImage
                                ? { uri: images.profileImage }
                                : user.dp
                                ? { uri: user.dp }
                                : { uri: 'https://via.placeholder.com/150' }
                        }
                        style={{ width: 150, height: 150, borderRadius: 75 }}
                        resizeMode="cover"
                    />
                    {/* Overlay with upload icon */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            height: 48,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <FontAwesome name="upload" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>}
        {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Profile Image</Text>
            <View style={styles.imageUploadContainer}>
                <TouchableOpacity
                    style={styles.imageUploadButton}
                    onPress={() => pickImage('profileImage')}
                >
                </TouchableOpacity>
            </View>
        </View> */}

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              placeholder="Enter your last name"
            />
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View> */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile No.</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter your address"
              multiline
            />
          </View>
{/* 
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(prev => ({ ...prev, birthDate: true }))}
            >
              <Text style={styles.dateButtonText}>
                {formData.birthDate || 'Select birth date'}
              </Text>
              <FontAwesome name="calendar" size={16} color={theme.colors.textgreydark} />
            </TouchableOpacity>
          </View> */}

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>NIC Number</Text>
            <TextInput
              style={styles.input}
              value={formData.nic}
              onChangeText={(value) => handleInputChange('nic', value)}
              placeholder="Enter your NIC number"
            />
          </View> */}
        </View>

        {/* Driver Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>License ID</Text>
            <TextInput
              style={styles.input}
              value={formData.licenseId}
              onChangeText={(value) => handleInputChange('licenseId', value)}
              placeholder="Enter your license ID"
            />
          </View> */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>License Expiry Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(prev => ({ ...prev, licenseExpiry: true }))}
            >
              <Text style={styles.dateButtonText}>
                {formData.licenseExpiry || 'Select expiry date'}
              </Text>
              <FontAwesome name="calendar" size={16} color={theme.colors.textgreydark} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Started working as a driver since</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(prev => ({ ...prev, startedDriving: true }))}
            >
              <Text style={styles.dateButtonText}>
                {formData.startedDriving || 'Select date when you started driving'}
              </Text>
              <FontAwesome name="calendar" size={16} color={theme.colors.textgreydark} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="Tell about yourself"
              multiline
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Willing to Relocate</Text>
            <Switch
              value={formData.relocate}
              onValueChange={(value) => handleInputChange('relocate', value)}
              trackColor={{ false: theme.colors.textgreylight, true: theme.colors.primary }}
            />
          </View>
        </View>



        {/* Document Uploads */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document Uploads</Text>
            <Text style={[styles.label, { paddingBottom: 20, paddingTop:0, color: theme.colors.warning }]}>You are only able to update these before verified by the admins</Text>

            {/* License Front (only if status != 1) */}
            {user.approvalstatus !== 1 && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>License Front</Text>
                <View style={styles.imageUploadContainer}>
                  <TouchableOpacity
                    style={{ width: 120, height: 90, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.textgreylight }}
                    onPress={() => pickImage('licenseFront')}
                    activeOpacity={0.8}
                  >
                    {images.licenseFront ? (
                      <Image
                        source={{ uri: images.licenseFront }}
                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{ width: 120, height: 90, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Empty background */}
                      </View>
                    )}
                    {/* Overlay with upload icon and text */}
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: 32,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <FontAwesome name="upload" size={16} color="white" />
                      <Text style={[styles.imageUploadButtonText, { color: 'white', marginLeft: 6 }]}>
                        {images.licenseFront ? 'Change Image' : 'Upload Image'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}


            {user.approvalstatus !== 1 && (
                <View style={styles.inputContainer}>
                <Text style={styles.label}>License Back</Text>
                <View style={styles.imageUploadContainer}>
                  <TouchableOpacity
                    style={{ width: 120, height: 90, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.textgreylight }}
                    onPress={() => pickImage('licenseBack')}
                    activeOpacity={0.8}
                  >
                    {images.licenseBack ? (
                      <Image
                        source={{ uri: images.licenseBack }}
                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{ width: 120, height: 90, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Empty background */}
                      </View>
                    )}
                    {/* Overlay with upload icon and text */}
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: 32,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <FontAwesome name="upload" size={16} color="white" />
                      <Text style={[styles.imageUploadButtonText, { color: 'white', marginLeft: 6 }]}>
                        {images.licenseBack ? 'Change Image' : 'Upload Image'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}


            {/* Police Report */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Police Report</Text>
                <View style={styles.imageUploadContainer}>
                  <TouchableOpacity
                    style={{ width: 120, height: 90, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.textgreylight }}
                    onPress={() => pickImage('policeReport')}
                    activeOpacity={0.8}
                  >
                    {images.policeReport ? (
                      <Image
                        source={{ uri: images.policeReport }}
                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{ width: 120, height: 90, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Empty background */}
                      </View>
                    )}
                    {/* Overlay with upload icon and text */}
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: 32,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <FontAwesome name="upload" size={16} color="white" />
                      <Text style={[styles.imageUploadButtonText, { color: 'white', marginLeft: 6 }]}>
                        {images.policeReport ? 'Change Image' : 'Upload Image'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            {/* Medical Report */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Medical Report</Text>
                <View style={styles.imageUploadContainer}>
                  <TouchableOpacity
                    style={{ width: 120, height: 90, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.textgreylight }}
                    onPress={() => pickImage('medicalReport')}
                    activeOpacity={0.8}
                  >
                    {images.medicalReport ? (
                      <Image
                        source={{ uri: images.medicalReport }}
                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{ width: 120, height: 90, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Empty background */}
                      </View>
                    )}
                    {/* Overlay with upload icon and text */}
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: 32,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <FontAwesome name="upload" size={16} color="white" />
                      <Text style={[styles.imageUploadButtonText, { color: 'white', marginLeft: 6 }]}>
                        {images.medicalReport ? 'Change Image' : 'Upload Image'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
        </View>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>

        {/* Date Pickers */}
        {showDatePicker.birthDate && (
          <DateTimePicker
            value={formData.birthDate ? new Date(formData.birthDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateChange(event, date, 'birthDate')}
            maximumDate={new Date()}
          />
        )}

        {showDatePicker.licenseExpiry && (
          <DateTimePicker
            value={formData.licenseExpiry ? new Date(formData.licenseExpiry) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateChange(event, date, 'licenseExpiry')}
            minimumDate={new Date()}
          />
        )}

        {showDatePicker.startedDriving && (
          <DateTimePicker
            value={formData.startedDriving ? new Date(formData.startedDriving) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateChange(event, date, 'startedDriving')}
            maximumDate={new Date()}
          />
        )}
        {/* <Text style={styles.footerText}>By saving changes, you agree to our Terms of Service and Privacy Policy.</Text> */}
      </ScrollView>
    // </View>
  );
};

export default EditProfile;