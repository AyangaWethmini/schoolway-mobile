import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../auth/AuthContext";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MultilineTextInput, TextInputComponent, FileUpload, DropdownInput } from '../../components/inputs';
import { Button } from '../../components/button';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditProfile = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth(); // Get the authenticated user from AuthContext
  const [image, setImage] = useState(null);
  
  // State for loading handling
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submissions
  const [isLoading, setIsLoading] = useState(true); // For loading profile data
  
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
  
  // Helper function to get the API base URL - tries multiple addresses if needed
  const getApiBaseUrl = useCallback(() => {
    // Return the primary URL - could add fallbacks here if needed
    return 'http://192.168.8.112:3000';
  }, []);
  
  // Function to fetch driver profile data from API - wrapped in useCallback to avoid dependency issues
  const fetchDriverProfileData = useCallback(async () => {
    setIsLoading(true); // Start loading
    
    try {
      // Check if user is authenticated and has ID
      if (!user || !user.id) {
        throw new Error('User not authenticated or missing ID');
      }
      
      const driverId = user.id;
      const apiBaseUrl = getApiBaseUrl();
      const apiUrl = `${apiBaseUrl}/api/mobile/driver/profile/${driverId}`;
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 15000); // 15 second timeout
      
      // Make API call to fetch driver profile data from backend
      const response = await fetch(apiUrl, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch profile data';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_) {
          // If parsing fails, use status text
          errorMessage = `${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      const { user: userProfile } = data;
      
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
      
      // Create a profile data object with the data from API
      const newProfileData = {
        firstName,
        lastName,
        email: userProfile?.email || '',
        phone: userProfile?.mobile || '',
        address: formattedAddress,
        licenseId: driverData.licenseId || '',
        licenseExpiry: licenseExpiryDate || '',
        licenseType: Array.isArray(driverData.licenseType) ? driverData.licenseType : [],
        languages: Array.isArray(driverData.languages) ? driverData.languages : [],
        relocate: driverData.relocate || false,
        startedDriving: startedDrivingDate || '',
        bio: driverData.bio || '',
        rating: driverData.rating || 0,
        ratingCount: driverData.totalReviews || 0,
        dp: userProfile?.dp || null,
        licenseFront: driverData.licenseFront || null,
        licenseBack: driverData.licenseBack || null,
        policeReport: driverData.policeReport || null,
        medicalReport: driverData.medicalReport || null
      };
      
      // Update both states - profileData holds the current backend data, form holds the editable data
      setProfileData(newProfileData);
      setForm({
        ...newProfileData,
        dpType: 'image/jpeg', // Default profile picture type
        licenseFrontType: 'image/jpeg',
        licenseBackType: 'image/jpeg',
        policeReportType: 'image/jpeg',
        medicalReportType: 'image/jpeg'
      });
      
      // Set image and document states - these will be updated only when form is submitted
      const originalImage = userProfile?.dp || null;
      const originalLicenseFront = driverData.licenseFront || null;
      const originalLicenseBack = driverData.licenseBack || null;
      const originalPoliceReport = driverData.policeReport || null; 
      const originalMedicalReport = driverData.medicalReport || null;
      
      // Set the document states with the original values
      setImage(originalImage);
      setLicenseFront(originalLicenseFront);
      setLicenseBack(originalLicenseBack);
      setPoliceReport(originalPoliceReport);
      setMedicalReport(originalMedicalReport);
    } catch (error) {
      // Extract more useful error information
      let errorMessage = 'Failed to load profile data. Please try again.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Network timeout: The request took too long to complete. Please try again with a better connection.';
      } else if (error.message.includes('Network')) {
        const serverAddress = getApiBaseUrl().replace(/^https?:\/\//, '');
        errorMessage = `Network error: Unable to connect to the server at ${serverAddress}. Please check your internet connection and server status.`;
      } else if (error.message.includes('ECONNREFUSED')) {
        const serverAddress = getApiBaseUrl().replace(/^https?:\/\//, '');
        errorMessage = `Connection refused: The server at ${serverAddress} actively refused the connection. Please verify the server is running.`;
      }
      
      Alert.alert('Error', errorMessage);
      
      // Set default placeholder values even when the fetch fails
      const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        licenseId: '',
        licenseExpiry: '',
        licenseType: [],
        languages: [],
        relocate: false,
        startedDriving: '',
        bio: '',
        rating: 0,
        ratingCount: 0
      };
      
      setProfileData(defaultValues);
      setForm({
        ...defaultValues,
        licenseFrontType: 'image/jpeg',
        licenseBackType: 'image/jpeg',
        policeReportType: 'image/jpeg',
        medicalReportType: 'image/jpeg'
      });
    } finally {
      setIsLoading(false); // End loading regardless of success or error
    }
  }, [user, setForm, setProfileData, setImage, setLicenseFront, setLicenseBack, setPoliceReport, setMedicalReport, setIsLoading, getApiBaseUrl]); // Include all dependencies used inside the callback
  
  // We'll use profileData to store the current profile data from the backend
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseId: '',
    licenseExpiry: '',
    licenseType: [],
    languages: [],
    relocate: false,
    startedDriving: '',
    bio: '',
    rating: 0,
    ratingCount: 0,
    dp: null,               // Profile image
    licenseFront: null,     // Document images
    licenseBack: null,
    policeReport: null,
    medicalReport: null
  });
  
  // formData will be used to track form changes without affecting the displayed profile
  const [form, setForm] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dp : '',
    dpType: 'image/jpeg', // Profile picture file type
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
    ratingCount: 0,
    // Document file types
    licenseFrontType: 'image/jpeg',
    licenseBackType: 'image/jpeg',
    policeReportType: 'image/jpeg',
    medicalReportType: 'image/jpeg'
  });
  
  // For file uploads
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [policeReport, setPoliceReport] = useState(null);
  const [medicalReport, setMedicalReport] = useState(null);

  // Function to pick an image from the device's gallery
  const pickImage = async () => {
    try {
      // Ask permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library is required!');
        return;
      }

      // Open image picker without allowsEditing to prevent redirection to edit page
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,  // Slightly reduced quality for better performance
        allowsEditing: false,
        aspect: [1, 1],
        exif: false,    // Don't include EXIF data to reduce size
        base64: false,  // Don't include base64 data to improve performance
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Validate that we have a valid URI
        if (!selectedImage.uri || typeof selectedImage.uri !== 'string') {
          Alert.alert('Error', 'Invalid image selected. Please try again.');
          return;
        }
        
        console.log('Selected profile image:', {
          uri: selectedImage.uri,
          fileSize: selectedImage.fileSize,
          width: selectedImage.width,
          height: selectedImage.height
        });
        
        // Set the selected image URI to the state
        setImage(selectedImage.uri);
        
        // Get MIME type from the asset or derive it from the URI extension
        let fileType;
        if (selectedImage.type) {
          fileType = selectedImage.type;
        } else {
          const fileExtension = selectedImage.uri.split('.').pop()?.toLowerCase() || 'jpg';
          fileType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
        }
        
        // Set form values related to the image
        setForm(prev => ({
          ...prev,
          dpType: fileType
        }));
        
        // Optional: Display success message
        Alert.alert('Success', 'Profile picture selected successfully');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };
  
  // Function to pick a document (image or PDF)
  const pickDocument = async (documentType) => {
    try {
      // Show document type selection options
      Alert.alert(
        "Select Document Type",
        "Choose the type of document you want to upload",
        [
          {
            text: "Image from Gallery",
            onPress: () => pickImageForDocument(documentType)
          },
          {
            text: "PDF Document",
            onPress: () => pickPdfForDocument(documentType)
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
    } catch (_error) {
      Alert.alert('Error', `Failed to open document picker. Please try again.`);
    }
  };

  // Function to pick an image for document
  const pickImageForDocument = async (documentType) => {
    try {
      // Ask permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library is required!');
        return;
      }

      // Open image picker without any allowsEditing to prevent redirection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8, // Slightly reduced quality for better upload performance
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Get file information
        const selectedAsset = result.assets[0];
        const documentUri = selectedAsset.uri;
        const fileExtension = documentUri.split('.').pop() || 'jpg';
        const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
        
        console.log(`Selected ${documentType} image:`, {
          uri: documentUri,
          type: mimeType,
          size: selectedAsset.fileSize || 'unknown'
        });
        
        // Set the appropriate state based on document type
        updateDocumentState(documentType, documentUri, mimeType);
      }
    } catch (error) {
      console.error(`Error picking image for ${documentType}:`, error);
      Alert.alert('Error', `Failed to pick an image. Please try again.`);
    }
  };

  // Function to pick a PDF file for document
  const pickPdfForDocument = async (documentType) => {
    try {
      // Open document picker to select PDF
      const result = await DocumentPicker.getDocumentAsync({ 
        type: 'application/pdf',
        copyToCacheDirectory: true
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const documentUri = selectedAsset.uri;
        const mimeType = selectedAsset.mimeType || 'application/pdf';
        
        console.log(`Selected ${documentType} PDF:`, {
          uri: documentUri,
          type: mimeType,
          name: selectedAsset.name,
          size: selectedAsset.size || 'unknown'
        });
        
        // Set the appropriate state based on document type
        updateDocumentState(documentType, documentUri, mimeType);
      }
    } catch (error) {
      console.error(`Error picking PDF for ${documentType}:`, error);
      Alert.alert('Error', `Failed to pick a PDF. Please try again.`);
    }
  };

  // Helper function to update the appropriate state based on document type
  const updateDocumentState = (documentType, uri, mimeType) => {
    // Log the file information for debugging
    console.log(`Updating document state for ${documentType}:`, { uri, mimeType });
    
    // Make sure URI is valid
    if (!uri) {
      console.warn(`Invalid URI for ${documentType}`);
      Alert.alert('Error', 'Invalid file selected. Please try again.');
      return;
    }
    
    switch (documentType) {
      case 'licenseFront':
        setLicenseFront(uri);
        // Store mime type in a way that it's accessible during form submission
        setForm(prev => ({ ...prev, licenseFrontType: mimeType }));
        break;
      case 'licenseBack':
        setLicenseBack(uri);
        setForm(prev => ({ ...prev, licenseBackType: mimeType }));
        break;
      case 'policeReport':
        setPoliceReport(uri);
        setForm(prev => ({ ...prev, policeReportType: mimeType }));
        break;
      case 'medicalReport':
        setMedicalReport(uri);
        setForm(prev => ({ ...prev, medicalReportType: mimeType }));
        break;
      default:
        console.warn(`Unknown document type: ${documentType}`);
        break;
    }
    
    // Alert the user that the document was selected successfully
    Alert.alert(
      'Document Selected', 
      `${documentType.charAt(0).toUpperCase() + documentType.slice(1).replace(/([A-Z])/g, ' $1')} has been selected successfully.`
    );
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
      
      // Check if user is authenticated and has ID
      if (!user || !user.id) {
        throw new Error('User not authenticated or missing ID');
      }
      
      const driverId = user.id;
      
      // Create FormData for multipart form upload (supports both text fields and files)
      const formData = new FormData();
      
      // Add text fields to FormData
      formData.append('firstName', form.firstName || '');
      formData.append('lastName', form.lastName || '');
      formData.append('email', form.email || '');
      formData.append('phone', form.phone || '');
      formData.append('address', form.address || '');
      formData.append('licenseId', form.licenseId || '');
      formData.append('licenseExpiry', form.licenseExpiry || '');
      
      // Handle arrays by stringifying them
      formData.append('licenseType', JSON.stringify(form.licenseType || []));
      formData.append('languages', JSON.stringify(form.languages || []));
      
      // Handle booleans
      formData.append('relocate', form.relocate ? 'true' : 'false');
      
      // Add more fields
      formData.append('startedDriving', form.startedDriving || '');
      formData.append('bio', form.bio || '');
      
      // Add profile image file if selected
      if (image) {
        try {
          // Get file extension from URI or use jpg as default
          const extension = image.split('.').pop() || 'jpg';
          const fileName = `profile_${driverId}.${extension}`;
          
          // Ensure URI is properly formatted for different platforms
          const fileUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
          
          formData.append('profileImage', {
            uri: fileUri,
            name: fileName,
            type: `image/${extension === 'png' ? 'png' : 'jpeg'}`
          });
          console.log('Appending profile image:', { uri: fileUri, name: fileName });
        } catch (err) {
          console.error('Error preparing profile image:', err);
        }
      }
      
      // Helper function for preparing document files
      const prepareFileForUpload = (fileUri, fileType, fieldName, fileNamePrefix) => {
        if (!fileUri) return;
        
        try {
          // Ensure we have valid data
          if (!fileUri || typeof fileUri !== 'string') {
            console.warn(`Invalid ${fieldName} URI:`, fileUri);
            return;
          }
          
          const type = fileType || 'image/jpeg';
          const extension = type === 'application/pdf' ? 'pdf' : type.split('/').pop() || 'jpg';
          const fileName = `${fileNamePrefix}_${driverId}.${extension}`;
          
          // Ensure URI is properly formatted for different platforms
          const formattedUri = Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri;
          
          formData.append(fieldName, {
            uri: formattedUri,
            name: fileName,
            type: type
          });
          
          console.log(`Appending ${fieldName}:`, { uri: formattedUri, name: fileName, type });
        } catch (err) {
          console.error(`Error preparing ${fieldName}:`, err);
        }
      };
      
      // Add document files if selected - using the helper function
      prepareFileForUpload(licenseFront, form.licenseFrontType, 'licenseFront', 'license_front');
      prepareFileForUpload(licenseBack, form.licenseBackType, 'licenseBack', 'license_back');
      prepareFileForUpload(policeReport, form.policeReportType, 'policeReport', 'police_report');
      prepareFileForUpload(medicalReport, form.medicalReportType, 'medicalReport', 'medical_report');
      
      // Send to API - with proper headers for multipart/form-data
      const apiBaseUrl = getApiBaseUrl();
      const apiUrl = `${apiBaseUrl}/api/mobile/driver/profile/${driverId}`;
      
      // Show loading alert to user
      Alert.alert('Updating Profile', 'Please wait while your profile is being updated...');
      
      let response;
      try {
        // Create AbortController with longer timeout for large uploads
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 60000); // 60 second timeout for large uploads
        
        // Log the formData for debugging
        console.log('FormData entries:');
        // Log the keys being sent in formData
        for (let key of Object.keys(formData._parts.reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {}))) {
          console.log(`FormData contains key: ${key}`);
        }
        
        // IMPORTANT: When using FormData, let the browser set the Content-Type header
        // including the boundary parameter
        response = await fetch(apiUrl, {
          method: 'PUT',
          body: formData,
          headers: {
            // Don't manually set Content-Type when using FormData
            // It will be set automatically with the correct boundary parameter
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          let errorData;
          let errorResponseText;
          
          try {
            // Try to get text response first
            errorResponseText = await response.text();
            
            // Try to parse as JSON if possible
            try {
              errorData = JSON.parse(errorResponseText);
              throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
            } catch (_parseError) {
              // If not valid JSON, use the text (ignoring parse error)
              throw new Error(`Server error ${response.status}: ${errorResponseText || response.statusText}`);
            }
          } catch (_jsonError) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        }
      } catch (fetchError) {
        // Handle different types of fetch errors
        if (fetchError.name === 'AbortError') {
          throw new Error('Network timeout: The request took too long to complete. This may happen with large image uploads or slow connections. Please try again with smaller images or a stronger connection.');
        } else if (fetchError.message.includes('Network') || !fetchError.response) {
          const serverAddress = apiBaseUrl.replace(/^https?:\/\//, '');
          throw new Error(`Network error: Unable to connect to the server at ${serverAddress}. Please check your internet connection and make sure the server is running and accessible.`);
        } else if (fetchError.message.includes('ECONNREFUSED')) {
          throw new Error(`Connection refused: The server at ${apiBaseUrl} actively refused the connection. Please verify the server is running and the address is correct.`);
        }
        
        throw fetchError;
      }
      
      // Parse the API response to get updated data
      const responseData = await response.json();
      console.log('Profile update successful:', responseData);
      
      // Only after successful API update, update the displayed profile data
      await fetchDriverProfileData(); // Re-fetch the data to ensure it's updated correctly
      
      // Show success message
      Alert.alert(
        'Success', 
        'Driver profile updated successfully',
        [{ text: 'OK', }]
      );
    } catch (error) {
      // Extract more useful error information
      console.error('Profile update error:', error);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.message.includes('Network')) {
        const serverAddress = getApiBaseUrl().replace(/^https?:\/\//, '');
        errorMessage = `Network error: Unable to connect to the server at ${serverAddress}. Please check your internet connection and server status.`;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'The request timed out. Server might be slow or unavailable. Please try again later.';
      } else if (error.message.includes('multipart/form-data')) {
        errorMessage = 'Error processing file uploads. Please try again with smaller files or check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
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
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      
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

    licenseTypeContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.sm,
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

    cancelButtonCustom: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      marginHorizontal: theme.spacing.md,
    },

    // Core overlay style for loading
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 999,
      padding: theme.spacing.lg,
    },
    loadingText: {
      color: theme.colors.textblack,
      fontSize: theme.fontSizes.medium,
      marginTop: theme.spacing.md,
      fontWeight: '500',
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
    // Determine file type based on stored mime type or file extension
    const getMimeType = () => {
      switch (documentType) {
        case 'licenseFront': return form.licenseFrontType || 'image/jpeg';
        case 'licenseBack': return form.licenseBackType || 'image/jpeg';
        case 'policeReport': return form.policeReportType || 'image/jpeg';
        case 'medicalReport': return form.medicalReportType || 'image/jpeg';
        default: return 'image/jpeg';
      }
    };

    const mimeType = getMimeType();
    const isPdf = mimeType === 'application/pdf';
    const extension = isPdf ? 'pdf' : (mimeType.includes('png') ? 'png' : 'jpg');
    
    // Get a clean filename from the document URI or generate a placeholder
    let fileName;
    if (document) {
      // Extract filename from the path
      const uriParts = document.split('/');
      fileName = uriParts[uriParts.length - 1];
      
      // If filename doesn't have an extension, add one based on the mime type
      if (!fileName.includes('.')) {
        fileName = `${fileName}.${extension}`;
      }
    } else {
      fileName = `${documentType}.${extension}`;
    }
    
    // Create file object with correct properties for the FileUpload component
    const fileObject = document ? {
      uri: document,
      name: fileName,
      type: mimeType,
      size: 0 // Size is unknown but providing a default value
    } : null;
    
    // Determine file status text based on whether file is selected
    const fileStatus = document ? 
      `File selected: ${isPdf ? 'PDF Document' : 'Image'}` : 
      'No file selected';
    
    return (
      <FileUpload
        label={title}
        placeholder={`Upload ${title} (Image or PDF)`}
        fileType="document"
        selectedFile={fileObject}
        onFileSelect={() => pickDocument(documentType)}
        status={fileStatus}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile data...</Text>
        </View>
      )}
      
      {/* Error will be shown via Alert only */}
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
            {/* Make the entire image area tappable for better UX */}
            <TouchableOpacity 
              style={styles.profileImageWrapper} 
              onPress={pickImage} 
              activeOpacity={0.8}
            >
              <Image 
                source={image 
                  ? { uri: image } 
                  : require('../../../assets/images/dummy/driver.webp')}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.profileImageOverlay}>
                <View style={styles.cameraIconContainer}>
                  <FontAwesome name="camera" size={18} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>
            {profileData.firstName} {profileData.lastName}
          </Text>
          <Text style={styles.profileEmail}>
            {profileData.email}
          </Text>
          
          {/* Rating Display */}
          {profileData.rating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome
                    key={star}
                    name={star <= Math.floor(profileData.rating) ? "star" : star <= profileData.rating ? "star-half-o" : "star-o"}
                    size={20}
                    color="#FFD700"
                    style={{ marginHorizontal: 3 }}
                  />
                ))}
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  {profileData.rating.toFixed(1)} ({profileData.ratingCount} {profileData.ratingCount === 1 ? 'rating' : 'ratings'})
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
            <Button
              title="Add"
              icon={<FontAwesome name="plus" size={16} color="white" />}
              varient="primary"
              onPress={addLicenseType}
              disabled={!newLicenseType || form.licenseType.includes(newLicenseType)}
              passstyles={{height: 50, marginLeft: theme.spacing.sm}}
              size="small"
            />
          </View>
          
          {form.licenseType.length > 0 && (
            <View style={styles.selectedItemsList}>
              <Text style={styles.selectedItemsTitle}>My License Types:</Text>
              {form.licenseType.map((type, index) => (
                <View key={index} style={[styles.selectedItem, index === form.licenseType.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.selectedItemText}>{type}</Text>
                  <Button
                    title="Remove"
                    varient="outlined-primary"
                    onPress={() => removeLicenseType(type)}
                    passstyles={{paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm}}
                    size="small"
                  />
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
            <Button
              title="Add"
              icon={<FontAwesome name="plus" size={16} color="white" />}
              varient="primary"
              onPress={addLanguage}
              disabled={!newLanguage || form.languages.includes(newLanguage)}
              passstyles={{height: 50, marginLeft: theme.spacing.sm}}
              size="small"
            />
          </View>
          
          {form.languages.length > 0 && (
            <View style={styles.selectedItemsList}>
              <Text style={styles.selectedItemsTitle}>Selected Languages:</Text>
              {form.languages.map((language, index) => (
                <View key={index} style={[styles.selectedItem, index === form.languages.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.selectedItemText}>{language}</Text>
                  <Button
                    title="Remove"
                    varient="outlined-primary"
                    onPress={() => removeLanguage(language)}
                    passstyles={{paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm}}
                    size="small"
                  />
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
          
          <View style={{gap: theme.spacing.md}}>
            {renderDocumentUpload("License Front", "licenseFront", licenseFront, setLicenseFront)}
            {renderDocumentUpload("License Back", "licenseBack", licenseBack, setLicenseBack)}
            {renderDocumentUpload("Police Report", "policeReport", policeReport, setPoliceReport)}
            {renderDocumentUpload("Medical Report", "medicalReport", medicalReport, setMedicalReport)}
          </View>
        </View>



        {isSubmitting && (
          <Button
            title="Saving..."
            varient="outlined-black"
            disabled={true}
            icon={<ActivityIndicator color={theme.colors.primary} size="small" />}
            passstyles={{marginVertical: theme.spacing.md}}
          />
        )}
        {!isSubmitting && (
          <>
            <Button 
              title="Save Changes"
              varient="primary"
              onPress={handleSubmit}
            />
            <Button 
              title="Reset Form"
              varient="outlined-primary"
              onPress={() => {
                Alert.alert(
                  "Reset Form",
                  "This will reset all changes to the original values. Continue?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    {
                      text: "Reset",
                      onPress: () => {
                        // Reset form to original data without leaving the page
                        setForm({
                          ...profileData,
                          licenseFrontType: 'image/jpeg',
                          licenseBackType: 'image/jpeg',
                          policeReportType: 'image/jpeg',
                          medicalReportType: 'image/jpeg'
                        });
                        
                        // Also reset the document states
                        const originalImage = profileData.dp;
                        const originalLicenseFront = profileData.licenseFront;
                        const originalLicenseBack = profileData.licenseBack;
                        const originalPoliceReport = profileData.policeReport;
                        const originalMedicalReport = profileData.medicalReport;
                        
                        setImage(originalImage);
                        setLicenseFront(originalLicenseFront);
                        setLicenseBack(originalLicenseBack);
                        setPoliceReport(originalPoliceReport);
                        setMedicalReport(originalMedicalReport);
                      }
                    }
                  ]
                );
              }}
              passstyles={{ marginTop: 12 }}
            />
          </>
        )}
        
        <Button 
          title="Cancel"
          varient="outlined-black"
          disabled={isSubmitting}
          onPress={() => {
            // Confirm before discarding changes
            Alert.alert(
              "Discard Changes",
              "Are you sure you want to discard your changes?",
              [
                {
                  text: "No",
                  style: "cancel"
                },
                {
                  text: "Yes",
                  onPress: () => {
                    // Reset form to original profile data
                    setForm({
                      ...profileData,
                      licenseFrontType: 'image/jpeg',
                      licenseBackType: 'image/jpeg',
                      policeReportType: 'image/jpeg',
                      medicalReportType: 'image/jpeg'
                    });
                    router.back();
                  }
                }
              ]
            );
          }}
          passstyles={styles.cancelButtonCustom}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
