import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../auth/AuthContext";
import * as ImagePicker from 'expo-image-picker';
import { MultilineTextInput, TextInputComponent, FileUpload, DropdownInput } from '../../components/inputs';
import { Button } from '../../components/button';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditProfile = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth(); // Get the authenticated user from AuthContext
  const [image, setImage] = useState(null);
  
  // State for loading and error handling
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submissions
  const [isLoading, setIsLoading] = useState(true); // For loading profile data
  const [error, setError] = useState(null);
  
  // Request permissions and fetch profile data when component mounts
  useEffect(() => {
    // Request image picker permissions
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload a profile photo.'
        );
      }
    })();
    
    // Fetch profile data - no loading indicator here
    if (user && user.id) {
      fetchDriverProfileData();
    }
  }, [user, fetchDriverProfileData]); // Include fetchDriverProfileData in the dependency array
  
  // Function to fetch driver profile data from API - wrapped in useCallback to avoid dependency issues
  const fetchDriverProfileData = useCallback(async () => {
    setError(null);
    setIsLoading(true); // Start loading
    
    try {
      // Check if user is authenticated and has ID
      if (!user || !user.id) {
        throw new Error('User not authenticated or missing ID');
      }
      
      const driverId = user.id;
      console.log('Fetching driver profile with ID:', driverId);
      
      // Make API call to fetch driver profile data from backend
      const response = await fetch(`http://192.168.8.112:3000/api/mobile/driver/profile/${driverId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile data');
      }
      
      const data = await response.json();
      console.log('Raw API response:', JSON.stringify(data, null, 2));
      
      const { user: userProfile } = data;
      
      console.log('Received profile data:', userProfile);
      
      // Default values if driver profile isn't found
      let driverData = {
        licenseId: '',
        licenseExpiry: '',
        licenseType: [],
        languages: [],
        relocate: false,
        startedDriving: '',
        bio: '',
        rating: 0,
        totalReviews: 0,
        licenseFront: null,
        licenseBack: null,
        policeReport: null,
        medicalReport: null
      };
      
      // If we have driver profile data, use it
      if (userProfile && userProfile.driverProfile) {
        driverData = { ...driverData, ...userProfile.driverProfile };
      }
      
      // Extract first and last name with placeholders if not available
      const firstName = userProfile?.firstname || 'First Name';
      const lastName = userProfile?.lastname || 'Last Name';
      
      // Format the startedDriving date if available
      let startedDrivingDate = '';
      if (driverData.startedDriving) {
        startedDrivingDate = new Date(driverData.startedDriving).toISOString().split('T')[0];
      }
      
      // Format license expiry date
      let licenseExpiryDate = '';
      if (driverData.licenseExpiry) {
        licenseExpiryDate = new Date(driverData.licenseExpiry).toISOString().split('T')[0];
      }
      
      // Clean up address data
      const address = userProfile?.address || '';
      const district = userProfile?.district || '';
      const formattedAddress = address && district 
        ? `${address}, ${district}` 
        : address || district || 'Your Address';
      
      // Update the form with the data from API
      setForm({
        firstName,
        lastName,
        email: userProfile?.email || 'email@example.com',
        phone: userProfile?.mobile || 'Phone Number',
        address: formattedAddress,
        licenseId: driverData.licenseId || 'License Number',
        licenseExpiry: licenseExpiryDate || '',
        licenseType: Array.isArray(driverData.licenseType) ? driverData.licenseType : [],
        languages: Array.isArray(driverData.languages) ? driverData.languages : [],
        relocate: driverData.relocate || false,
        startedDriving: startedDrivingDate || '',
        bio: driverData.bio || 'Tell us about yourself',
        rating: driverData.rating || 0,
        ratingCount: driverData.totalReviews || 0
      });
      
      // Set image and documents if available
      if (userProfile?.dp) {
        setImage(userProfile.dp);
      }
      
      if (driverData.licenseFront) {
        setLicenseFront(driverData.licenseFront);
      }
      
      if (driverData.licenseBack) {
        setLicenseBack(driverData.licenseBack);
      }
      
      if (driverData.policeReport) {
        setPoliceReport(driverData.policeReport);
      }
      
      if (driverData.medicalReport) {
        setMedicalReport(driverData.medicalReport);
      }
      
      console.log('Profile data loaded successfully from API');
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data. Please try again.');
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
      
      // Set default placeholder values even when the fetch fails
      setForm({
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'email@example.com',
        phone: 'Phone Number',
        address: 'Your Address',
        licenseId: 'License Number',
        licenseExpiry: '',
        licenseType: [],
        languages: [],
        relocate: false,
        startedDriving: '',
        bio: 'Tell us about yourself',
        rating: 0,
        ratingCount: 0
      });
    } finally {
      setIsLoading(false); // End loading regardless of success or error
    }
  }, [user, setForm, setError, setImage, setLicenseFront, setLicenseBack, setPoliceReport, setMedicalReport, setIsLoading]); // Include all dependencies used inside the callback
  
  const [form, setForm] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    // Driver Specific Info
    licenseId: '',
    licenseExpiry: '',
    licenseType: [],
    languages: [],
    relocate: false,
    startedDriving: '',
    bio: '',
    // Rating information (read-only)
    rating: 0,
    ratingCount: 0
  });
  
  // For file uploads
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [policeReport, setPoliceReport] = useState(null);
  const [medicalReport, setMedicalReport] = useState(null);

  // Function to pick an image from the device's gallery
  const pickImage = async () => {
    try {
      // Request permission to access the photo library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos to change your profile picture.');
        return;
      }
      
      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Set the selected image URI to the state
        setImage(result.assets[0].uri);
        console.log('Selected image:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };
  
  // Function to pick a document (image or PDF)
  const pickDocument = async (documentType) => {
    try {
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos to upload documents.');
        return;
      }
      
      // Launch the document picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Handle different document types
        const documentUri = result.assets[0].uri;
        console.log(`Selected ${documentType}:`, documentUri);
        
        // Set the appropriate state based on document type
        switch (documentType) {
          case 'licenseFront':
            setLicenseFront(documentUri);
            break;
          case 'licenseBack':
            setLicenseBack(documentUri);
            break;
          case 'policeReport':
            setPoliceReport(documentUri);
            break;
          case 'medicalReport':
            setMedicalReport(documentUri);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(`Error picking ${documentType}:`, error);
      Alert.alert('Error', `Failed to pick ${documentType}. Please try again.`);
    }
  };

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    try {
      // Show loading state only when submitting
      setIsSubmitting(true);
      setError(null);
      
      // Validate form data
      if (!form.licenseId) {
        Alert.alert('Validation Error', 'License ID is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!form.licenseExpiry) {
        Alert.alert('Validation Error', 'License expiry date is required');
        setIsSubmitting(false);
        return;
      }
      
      // Create FormData for multipart/form-data submission (handles file uploads)
      const formData = new FormData();
      
      // Append text fields
      Object.keys(form).forEach((key) => {
        // Handle arrays (licenseType, languages)
        if (Array.isArray(form[key])) {
          formData.append(key, JSON.stringify(form[key]));
        } 
        // Handle boolean values
        else if (typeof form[key] === 'boolean') {
          formData.append(key, form[key] ? 'true' : 'false');
        }
        // Handle regular text values
        else {
          formData.append(key, form[key]);
        }
      });
      
      // Append file uploads if available
      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('profileImage', {
          uri: image,
          name: filename || 'profile.jpg',
          type,
        });
      }
      
      // Append document uploads
      const appendDocument = (uri, fieldName) => {
        if (uri) {
          const filename = uri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          formData.append(fieldName, {
            uri,
            name: filename || `${fieldName}.jpg`,
            type,
          });
        }
      };
      
      appendDocument(licenseFront, 'licenseFront');
      appendDocument(licenseBack, 'licenseBack');
      appendDocument(policeReport, 'policeReport');
      appendDocument(medicalReport, 'medicalReport');
      
      console.log('Submitting driver profile update...');
      
      // Check if user is authenticated and has ID
      if (!user || !user.id) {
        throw new Error('User not authenticated or missing ID');
      }
      
      const driverId = user.id;
      console.log('Updating driver profile with ID:', driverId);
      
      // Send to API - use the correct IP address instead of localhost
      const response = await fetch(`http://192.168.56.1/api/mobile/driver/${driverId}/profile`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add authorization headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      // Show success message
      Alert.alert(
        'Success', 
        'Driver profile updated successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F8FA', // Light gray background
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.medium,
      paddingHorizontal: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    refreshButton: {
      padding: 8,
      backgroundColor: 'rgba(0,0,0,0.03)',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: theme.fontSizes.large,
      fontWeight: 'bold',
      color: theme.colors.textblack,
      marginLeft: theme.spacing.md,
    },
    pageSubtitle: {
      color: theme.colors.textgreydark,
      fontSize: theme.fontSizes.small,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    formSection: {
      marginBottom: theme.spacing.lg,
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: '700',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.md,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      paddingLeft: theme.spacing.sm,
    },
    inputContainer: {
      marginBottom: theme.spacing.sm,
    },
    profileImageContainer: {
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
    },
    profileImageWrapper: {
      position: 'relative',
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 7,
      elevation: 8,
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 4,
      borderColor: theme.colors.primary,
    },
    profileImageOverlay: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    cameraIconContainer: {
      backgroundColor: theme.colors.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    },
    imageUploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accentblue,
      borderRadius: theme.borderRadius.small,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    imageUploadText: {
      color: 'white',
      marginLeft: theme.spacing.xs,
      fontSize: theme.fontSizes.small,
    },
    documentUploadContainer: {
      marginVertical: theme.spacing.sm,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    switchLabel: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.textblack,
    },
    removeButton: {
      backgroundColor: theme.colors.accentblue,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: theme.borderRadius.small,
      alignItems: 'center',
      justifyContent: 'center',
    },
    removeButtonText: {
      color: 'white',
      fontSize: theme.fontSizes.small,
      fontWeight: '500',
    },
    
    
    profileName: {
      fontSize: 24, 
      fontWeight: 'bold', 
      marginTop: 16, 
      color: theme.colors.textblack,
      textAlign: 'center',
    },
    profileEmail: {
      fontSize: 16, 
      color: theme.colors.textgreydark, 
      marginBottom: 8,
      textAlign: 'center',
    },
    fieldLabel: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.md,
      fontWeight: '600',
    },
    licenseTypeContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.sm,
    },
    addListButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.small,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginLeft: theme.spacing.sm,
      height: 50,
    },
    addListButtonText: {
      color: 'white',
      fontWeight: '500',
      marginLeft: theme.spacing.xs,
    },
    selectedItemsList: {
      marginVertical: theme.spacing.md,
      backgroundColor: theme.colors.backgroud,
      padding: theme.spacing.md,
      
    },
    selectedItemsTitle: {
      fontSize: theme.fontSizes.small,
      fontWeight: '600',
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.sm,
    },
    selectedItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    selectedItemText: {
      fontSize: theme.fontSizes.medium,
      color: theme.colors.textblack,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.medium,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    submitButtonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: theme.fontSizes.medium,
      marginLeft: 8,
    },
    cancelButtonCustom: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      marginHorizontal: theme.spacing.md,
    },
    loadingButtonContainer: {
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.large,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    loadingButtonText: {
      color: theme.colors.textblack,
      fontWeight: '600',
      fontSize: theme.fontSizes.medium,
      marginLeft: theme.spacing.sm,
    },
    errorContainer: {
      backgroundColor: '#FFEBEE',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      marginVertical: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.fontSizes.small,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    disabledButton: {
      backgroundColor: theme.colors.border,
      opacity: 0.7,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.9)',
      zIndex: 999,
      borderRadius: theme.borderRadius.medium,
    },
    loadingText: {
      color: theme.colors.textblack,
      fontSize: theme.fontSizes.medium,
      marginTop: theme.spacing.md,
      fontWeight: '500',
    },
    loadingOverlay: {
      position: 'absolute',
      zIndex: 999,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    expiryWarning: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF3E0',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      marginVertical: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    expiryError: {
      backgroundColor: '#FFEBEE',
    },
    expiryWarningText: {
      fontSize: theme.fontSizes.small,
      flex: 1,
      fontWeight: '500',
    },
    ratingContainer: {
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    starsContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    ratingBadge: {
      backgroundColor: theme.colors.primary + '15', 
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.primary + '30',
    },
    ratingText: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textblack,
      fontWeight: '500',
    }
  });

  // State for DateTimePicker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode] = useState('date'); // We're only using date mode for now
  const [activeDateField, setActiveDateField] = useState('');

  // Function to handle date changes
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Format the date as a string (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange(activeDateField, formattedDate);
    }
  };

  // Function to show date picker for specific field
  const showDatePickerForField = (field) => {
    setActiveDateField(field);
    setShowDatePicker(true);
  };
  
  // Function to add license type
  const [newLicenseType, setNewLicenseType] = useState('');
  
  const addLicenseType = () => {
    if (newLicenseType.trim() !== '' && !form.licenseType.includes(newLicenseType.trim())) {
      handleChange('licenseType', [...form.licenseType, newLicenseType.trim()]);
      setNewLicenseType('');
    }
  };
  
  const removeLicenseType = (type) => {
    handleChange('licenseType', form.licenseType.filter(item => item !== type));
  };
  
  // Function to add language
  const [newLanguage, setNewLanguage] = useState('');
  
  const addLanguage = () => {
    if (newLanguage.trim() !== '' && !form.languages.includes(newLanguage.trim())) {
      handleChange('languages', [...form.languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };
  
  const removeLanguage = (language) => {
    handleChange('languages', form.languages.filter(item => item !== language));
  };
  
  // Function to check if license is expired or about to expire
  const checkLicenseExpiry = (expiryDate) => {
    try {
      const expiry = new Date(expiryDate);
      const today = new Date();
      
      // Calculate days until expiry
      const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) {
        return { isValid: false, message: 'Your license has expired! Please renew immediately.' };
      } else if (daysUntilExpiry < 30) {
        return { isValid: true, message: `Your license will expire in ${daysUntilExpiry} days. Please renew soon.` };
      } else {
        return { isValid: true, message: null };
      }
    } catch (error) {
      console.error('Error checking license expiry:', error);
      return { isValid: false, message: 'Invalid expiry date format.' };
    }
  };

  // Component for rendering document uploads using the FileUpload component
  const renderDocumentUpload = (title, documentType, document, setDocument) => {
    const fileObject = document ? {
      uri: document,
      name: document.split('/').pop() || `${documentType}.jpg`,
      type: 'image/jpeg'
    } : null;
    
    return (
      <View style={styles.documentUploadContainer}>
        <FileUpload
          label={title}
          placeholder={`Upload ${title}`}
          fileType="document"
          selectedFile={fileObject}
          onFileSelect={() => pickDocument(documentType)}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile data...</Text>
        </View>
      )}
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textblack} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Driver Profile</Text>
          <View style={{ flex: 1 }} />
          <Button 
            varient="transparent"
            icon={<Ionicons 
              name="refresh" 
              size={20} 
              color={isSubmitting ? theme.colors.textgreydark : theme.colors.primary} 
            />}
            onPress={fetchDriverProfileData}
            disabled={isSubmitting}
            passstyles={{paddingHorizontal: 0}}
          />
        </View>

        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image 
              source={image ? { uri: image } : require('../../../assets/images/dummy/driver.webp')}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={styles.profileImageOverlay} 
              onPress={pickImage}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <View style={styles.cameraIconContainer}>
                <FontAwesome name="camera" size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>
            {form.firstName} {form.lastName}
          </Text>
          <Text style={styles.profileEmail}>
            {form.email}
          </Text>
          
          {/* Rating Display */}
          {form.rating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome
                    key={star}
                    name={star <= Math.floor(form.rating) ? "star" : star <= form.rating ? "star-half-o" : "star-o"}
                    size={20}
                    color="#FFD700"
                    style={{ marginHorizontal: 3 }}
                  />
                ))}
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  {form.rating.toFixed(1)} ({form.ratingCount} {form.ratingCount === 1 ? 'rating' : 'ratings'})
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TextInputComponent
            label="First Name"
            value={form.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
            placeholder="First Name"
          />
          
          <TextInputComponent
            label="Last Name"
            value={form.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
            placeholder="Last Name"
          />
          
          <TextInputComponent
            label="Phone"
            value={form.phone}
            onChangeText={(text) => handleChange('phone', text)}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          
          <TextInputComponent
            label="Address"
            value={form.address}
            onChangeText={(text) => handleChange('address', text)}
            placeholder="Home Address"
            multiline
          />

          <View style={styles.inputContainer}>
            <MultilineTextInput
              label="Bio"
              value={form.bio}
              onChangeText={(text) => handleChange('bio', text)}
              placeholder={form.bio || "Tell us about yourself"}
              numberOfLines={6}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          
          <TextInputComponent
            label="License ID"
            value={form.licenseId}
            onChangeText={(text) => handleChange('licenseId', text)}
            placeholder="License Identification Number"
          />
          
          <TextInputComponent
            label="License Expiry Date"
            value={form.licenseExpiry}
            onChangeText={(text) => handleChange('licenseExpiry', text)}
            placeholder="YYYY-MM-DD"
            onFocus={() => showDatePickerForField('licenseExpiry')}
          />
          
          {form.licenseExpiry && checkLicenseExpiry(form.licenseExpiry).message && (
            <View style={[
              styles.expiryWarning, 
              !checkLicenseExpiry(form.licenseExpiry).isValid ? styles.expiryError : styles.expiryWarning
            ]}>
              <FontAwesome 
                name={checkLicenseExpiry(form.licenseExpiry).isValid ? "exclamation-triangle" : "times-circle"} 
                size={16} 
                color={checkLicenseExpiry(form.licenseExpiry).isValid ? "#FF9800" : "#F44336"} 
                style={{ marginRight: 8 }}
              />
              <Text style={styles.expiryWarningText}>
                {checkLicenseExpiry(form.licenseExpiry).message}
              </Text>
            </View>
          )}
          
          {showDatePicker && (
            <DateTimePicker
              value={new Date(form.licenseExpiry)}
              mode={datePickerMode}
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
          
          {/* License Types */}
          <View style={styles.licenseTypeContainer}>
            <View style={{flex: 1}}>
              <DropdownInput
                label="License Types"
                placeholder="Select license type"
                options={[
                  { label: "B1", value: "B1" },
                  { label: "B2", value: "B2" },
                  { label: "C1", value: "C1" },
                  { label: "C", value: "C" },
                  { label: "CE", value: "CE" },
                  { label: "D1", value: "D1" },
                  { label: "D", value: "D" },
                  { label: "G1", value: "G1" },
                  { label: "G", value: "G" },
                  { label: "J", value: "J" }
                ]}
                selectedValue={newLicenseType}
                onSelect={(value) => setNewLicenseType(value)}
              />
            </View>
            <TouchableOpacity 
              style={styles.addListButton}
              onPress={addLicenseType}
              disabled={!newLicenseType || form.licenseType.includes(newLicenseType)}
            >
              <FontAwesome name="plus" size={16} color="white" />
              <Text style={styles.addListButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {form.licenseType.length > 0 && (
            <View style={styles.selectedItemsList}>
              <Text style={styles.selectedItemsTitle}>My License Types:</Text>
              {form.licenseType.map((type, index) => (
                <View key={index} style={[styles.selectedItem, index === form.licenseType.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.selectedItemText}>{type}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeLicenseType(type)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          <View style={styles.licenseTypeContainer}>
            <View style={{flex: 1}}>
              <DropdownInput
                label="Languages"
                placeholder="Select language"
                options={[
                  { label: "English", value: "English" },
                  { label: "Sinhala", value: "Sinhala" },
                  { label: "Tamil", value: "Tamil" },
                  { label: "Hindi", value: "Hindi" },
                  { label: "French", value: "French" },
                  { label: "Spanish", value: "Spanish" },
                  { label: "Arabic", value: "Arabic" },
                  { label: "German", value: "German" },
                  { label: "Mandarin", value: "Mandarin" },
                  { label: "Japanese", value: "Japanese" }
                ]}
                selectedValue={newLanguage}
                onSelect={(value) => setNewLanguage(value)}
              />
            </View>
            <TouchableOpacity 
              style={styles.addListButton}
              onPress={addLanguage}
              disabled={!newLanguage || form.languages.includes(newLanguage)}
            >
              <FontAwesome name="plus" size={16} color="white" />
              <Text style={styles.addListButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {form.languages.length > 0 && (
            <View style={styles.selectedItemsList}>
              <Text style={styles.selectedItemsTitle}>Selected Languages:</Text>
              {form.languages.map((language, index) => (
                <View key={index} style={[styles.selectedItem, index === form.languages.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.selectedItemText}>{language}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeLanguage(language)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TextInputComponent
            label="Started Driving Date"
            value={form.startedDriving}
            onChangeText={(text) => handleChange('startedDriving', text)}
            placeholder="YYYY-MM-DD"
            onFocus={() => showDatePickerForField('startedDriving')}
          />
          
          {/* Willing to Relocate */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Willing to Relocate</Text>
            <Switch
              value={form.relocate}
              onValueChange={(value) => handleChange('relocate', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={form.relocate ? theme.colors.accent : '#f4f3f4'}
            />
          </View>
          
          {/* Document Uploads */}
          <Text style={[styles.sectionTitle, {marginTop: theme.spacing.md}]}>Required Documents</Text>
          
          {renderDocumentUpload("License Front", "licenseFront", licenseFront, setLicenseFront)}
          {renderDocumentUpload("License Back", "licenseBack", licenseBack, setLicenseBack)}
          {renderDocumentUpload("Police Report", "policeReport", policeReport, setPoliceReport)}
          {renderDocumentUpload("Medical Report", "medicalReport", medicalReport, setMedicalReport)}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <FontAwesome name="exclamation-circle" size={20} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isSubmitting && (
          <View style={styles.loadingButtonContainer}>
            <ActivityIndicator color={theme.colors.primary} size="small" />
            <Text style={styles.loadingButtonText}>Saving...</Text>
          </View>
        )}
        {!isSubmitting && (
          <Button 
            title="Save Changes"
            varient="primary"
            onPress={handleSubmit}
          />
        )}
        
        <Button 
          title="Cancel"
          varient="outlined-black"
          disabled={isSubmitting}
          onPress={() => router.back()}
          passstyles={styles.cancelButtonCustom}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
