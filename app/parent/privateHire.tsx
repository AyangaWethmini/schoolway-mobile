import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from "../components/button";
import SWText from '../components/SWText';
import { useTheme } from "../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const PrivateHire = () => {
  // We now handle warnings directly at the van level
  // (removed global search warning state)
  
  // Helper to get place name from coordinates
  const getPlaceName = async (coords: LatLng, cb: (name: string) => void) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        cb('Permission denied');
        return;
      }
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        cb(`${place.name || place.street || ''}, ${place.city || place.region || ''}`);
      } else {
        cb('Selected location');
      }
    } catch {
      cb('Selected location');
    }
  };
  // Map picker states
  type LatLng = { latitude: number; longitude: number };
  type Van = {
    id: number;
    registrationNumber: string;
    licensePlateNumber: string;
    makeAndModel: string;
    seatingCapacity: number;
    acCondition: boolean;
    photoUrl: string;
    ownerId: string;
    privateRating: number;
    averageRating: number;
    contactNo: string;
    routeStart: string;
    pickupDistance: number;
    tripDistance: number;
    warning?: string; // Optional warning message from the server
  };
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);
  // Search bar states for map pickers
  const [pickupSearch, setPickupSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [pickupMapRegion, setPickupMapRegion] = useState({
    latitude: 7.8731,
    longitude: 80.7718,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [destinationMapRegion, setDestinationMapRegion] = useState({
    latitude: 7.8731,
    longitude: 80.7718,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const router = useRouter();
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('request');
  const [showVanSelection, setShowVanSelection] = useState(false);
  // (Removed duplicate, now using typed version above)
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Date picker states
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());

  // Form state
  const [formData, setFormData] = useState({
    destination: '',
    pickupLocation: '',
    departureDate: '',
    returnDate: '',
    passengers: '',
    additionalNotes: ''
  });

  // State for vans fetched from backend
  const [availableVans, setAvailableVans] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // State for hire history
  const [hireHistory, setHireHistory] = useState<any[]>([]);

  // Fetch user's bookings
  const fetchMyHires = async () => {
    try {
      const session = await AsyncStorage.getItem('user_session');
      let userId = null;
      if (session) {
        const user = JSON.parse(session);
        userId = user?.user?.id;
        console.log(userId)
      }
      if (!userId) return;
  const response = await fetch(`${API_URL}/private-hire/my-hires?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  const data = await response.json();
  console.log('Bookings received:', data.hires);
  setHireHistory(data.hires || []);
    } catch (e) {
      setHireHistory([]);
    }
  };

  // Fetch on mount of history tab
  useEffect(() => {
    if (activeTab === 'history') {
      fetchMyHires();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
      header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    backButton: {
      padding: 5,
      marginRight: 15,
    },
    headerTitle: {
      fontSize: 18,
      color: 'white',
    },
    headerSpacer: {
      width: 60,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 5,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      backgroundColor: '#eee',
      borderBottomColor: theme.colors.accentblue,
    },
    tabText: {
      fontSize: 14,
      color: '#888',
    },
    activeTabText: {
      color: theme.colors.accentblue,
    },
    tabContent: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    formContainer: {
      padding: 16,
    },
    formTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    formSubtitle: {
      fontSize: 16,
      color: '#666',
      marginTop: 10,
      marginBottom: 32,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    dateRow: {
      flexDirection: 'row',
    },
    dateInput: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateInputText: {
      fontSize: 16,
      color: '#333',
    },
    placeholderText: {
      color: '#999',
    },
    searchButton: {
      marginTop: 20,
      backgroundColor: '#1a1a1a',
    },
    vanSelectionContainer: {
      paddingHorizontal: 10,
    },
    searchResultsHeader: {
      marginBottom: 20,
    },
    backButtonText: {
      color: '#008080',
      fontSize: 16,
      fontWeight: '500',
    },
    resultsTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    resultsSubtitle: {
      fontSize: 14,
      color: '#666',
    },
    vanCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    vanCardHeader: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    vanImageContainer: {
      width: 60,
      height: 60,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    vanImage: {
      fontSize: 24,
    },
    vanInfo: {
      flex: 1,
    },
    vanName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    vanType: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    vanDriver: {
      fontSize: 14,
      color: '#333',
    },
    vanPricing: {
      alignItems: 'flex-end',
    },
    vanPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#008080',
    },
    vanPriceUnit: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
    },
    ratingContainer: {
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    rating: {
      fontSize: 12,
      color: '#333',
    },
    vanFeatures: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    featureTag: {
      backgroundColor: '#e8f4f8',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
    },
    featureText: {
      fontSize: 12,
      color: '#008080',
      fontWeight: '500',
    },
    vanActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    contactButton: {
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 16,
      paddingVertical : 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    contactButtonText: {
      color: '#333',
      fontSize: 14,
      fontWeight: '500',
    },
    requestButton: {
      flex: 0,
      paddingHorizontal: 24,
    },
    historyContainer: {
      padding: 16,
    },
    historyTitle: {
      fontSize: 24,
      color: '#1a1a1a',
      marginVertical: 8,
    },
    historySubtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 24,
    },
    historyCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    historyCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    historyMainInfo: {
      flex: 1,
    },
    historyDestination: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    historyDates: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    historyDetails: {
      fontSize: 14,
      color: '#333',
    },
    historyStatus: {
      alignItems: 'flex-end',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginBottom: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    historyCost: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
    historyActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modifyButton: {
      backgroundColor: '#fff3cd',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: '#ffeeba',
    },
    modifyButtonText: {
      color: '#856404',
      fontSize: 14,
      fontWeight: '500',
    },
    cancelButton: {
      backgroundColor: '#f8d7da',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#f5c6cb',
    },
    cancelButtonText: {
      color: '#721c24',
      fontSize: 14,
      fontWeight: '500',
    },
    rebookButton: {
      backgroundColor: '#d4edda',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: '#c3e6cb',
    },
    rebookButtonText: {
      color: '#155724',
      fontSize: 14,
      fontWeight: '500',
    },
    reviewButton: {
      backgroundColor: '#d1ecf1',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#bee5eb',
    },
    reviewButtonText: {
      color: '#0c5460',
      fontSize: 14,
      fontWeight: '500',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      margin: 20,
      minWidth: 300,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 16,
      textAlign: 'center',
    },
    modalText: {
      fontSize: 16,
      color: '#333',
      marginBottom: 16,
      lineHeight: 24,
    },
    modalBold: {
      fontWeight: '600',
      color: '#008080',
    },
    modalDetails: {
      fontSize: 14,
      color: '#666',
      marginBottom: 24,
      lineHeight: 20,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalCancelButton: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      paddingVertical: 12,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    modalCancelText: {
      textAlign: 'center',
      color: '#666',
      fontSize: 16,
      fontWeight: '500',
    },
    modalConfirmButton: {
      flex: 1,
      backgroundColor: '#008080',
      paddingVertical: 12,
      borderRadius: 8,
      marginLeft: 8,
    },
    modalConfirmText: {
      textAlign: 'center',
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    
  });

  // Date formatting function
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle departure date change
  const onDepartureDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || departureDate;
    setShowDeparturePicker(Platform.OS === 'ios');
    setDepartureDate(currentDate);
    setFormData({...formData, departureDate: formatDate(currentDate)});
  };

  // Handle return date change
  const onReturnDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || returnDate;
    setShowReturnPicker(Platform.OS === 'ios');
    setReturnDate(currentDate);
    setFormData({...formData, returnDate: formatDate(currentDate)});
  };

  // Step 1: Search vans
  const handleSearch = async () => {
    if (
      !formData.destination ||
      !formData.pickupLocation ||
      !formData.departureDate ||
      !formData.passengers
    ) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    const passengerCount = Number(formData.passengers);
    if (isNaN(passengerCount) || passengerCount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number of passengers');
      return;
    }
    
    if (passengerCount > 50) {
      Alert.alert('Validation Error', 'Maximum number of passengers allowed is 50');
      return;
    }

    setIsSearching(true);
    // Prepare payload for van search (no userId, no vanId, no fare, no status)
    const payload = {
      pickupLat: pickupCoords?.latitude ?? null,
      pickupLng: pickupCoords?.longitude ?? null,
      destinationLat: destinationCoords?.latitude ?? null,
      destinationLng: destinationCoords?.longitude ?? null,
      departureDate: departureDate ? departureDate.toISOString() : null,
      returnDate: returnDate ? returnDate.toISOString() : null,
      noOfPassengers: Number(formData.passengers),
    };

    try {
      const response = await fetch(`${API_URL}/private-hire/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error('Failed to search vans.');
      }

  const data = await response.json();
  setAvailableVans(data.vans || []);
  // Each van already includes its own warning if needed
  setShowVanSelection(true);
    } catch (error) {
      console.error('Van search failed:', error.message);
      Alert.alert('Error', 'Could not search for vans. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Step 2: Create hire after van selection
  const handleVanRequest = (van) => {
    setSelectedVan(van);
    setShowConfirmModal(true);
  };

  const confirmRequest = async () => {
    setIsRequesting(true);
    let userId = null;
    
    // Validate passenger count again as a safeguard
    const passengerCount = Number(formData.passengers);
    if (isNaN(passengerCount) || passengerCount <= 0 || passengerCount > 50) {
      Alert.alert('Validation Error', 'Please enter a valid number of passengers (1-50)');
      setIsRequesting(false);
      return;
    }
    
    try {
      const session = await AsyncStorage.getItem('user_session');
      if (session) {
        const user = JSON.parse(session);
        userId = user?.user?.id;
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      Alert.alert('Error', 'Could not retrieve user session.');
      setIsRequesting(false);
      return;
    }
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      setIsRequesting(false);
      return;
    }
    // Calculate fare
    let fare = null;
    if (selectedVan && selectedVan.privateRating && selectedVan.tripDistance) {
      fare = Math.round(selectedVan.privateRating * selectedVan.tripDistance * 2);
    }
    // Prepare payload for hire creation
    const payload = {
      userId,
      pickupLat: pickupCoords?.latitude ?? null,
      pickupLng: pickupCoords?.longitude ?? null,
      destinationLat: destinationCoords?.latitude ?? null,
      destinationLng: destinationCoords?.longitude ?? null,
      departureDate: departureDate ? departureDate.toISOString() : null,
      returnDate: returnDate ? returnDate.toISOString() : null,
      noOfPassengers: Number(formData.passengers),
      notes: formData.additionalNotes || '',
      status: 'PENDING',
      vanId: selectedVan?.id ?? null,
      fare ,
    };
    console.log('Submitting hire payload:', payload);
    try {
      const response = await fetch(`${API_URL}/private-hire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error('Failed to submit private hire request.');
      }
      const data = await response.json();
      console.log(data);
      Alert.alert(
        'Request Sent!',
        `Your request for ${selectedVan.makeAndModel || 'Van'} has been sent to the driver. They will contact you soon.`,
        [{ text: 'OK', onPress: () => {
          setShowConfirmModal(false);
          setShowVanSelection(false);
          setFormData({
            destination: '',
            pickupLocation: '',
            departureDate: '',
            returnDate: '',
            passengers: '',
            additionalNotes: ''
          });
          setSelectedVan(null);
          setAvailableVans([]);
        }}]
      );
    } catch (error) {
      console.error('Submission failed:', error.message);
      Alert.alert('Error', 'Could not submit your request. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  // ...existing code...

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return theme.colors.statusgreen || '#4CAF50';
      case 'upcoming':
        return theme.colors.statusblue || '#2196F3';
      case 'cancelled':
        return theme.colors.statusgrey || '#757575';
      case 'rejected':
        return '#d32f2f'; // Red color for rejected status
      default:
        return '#757575';
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return theme.colors.statusbackgroundgreen || '#E8F5E8';
      case 'upcoming':
        return theme.colors.statusbackgroundblue || '#E3F2FD';
      case 'cancelled':
        return theme.colors.statusbackgroundgrey || '#F5F5F5';
      case 'rejected':
        return '#FFEBEE'; // Light red background for rejected status
      default:
        return '#F5F5F5';
    }
  };

  const renderRequestTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {!showVanSelection ? (
        <View style={styles.formContainer}>
          <SWText h1 >Plan Your Trip</SWText>
          <SWText uberMedium style={styles.formSubtitle}>Fill in the details to find available vans</SWText>

          <View style={styles.inputGroup}>
            <SWText style={styles.inputLabel}>Destination *</SWText>
            <TextInput
              style={styles.textInput}
              placeholder="Where are you going?"
              value={formData.destination}
              onChangeText={(text) => setFormData({...formData, destination: text})}
            />
            <TouchableOpacity onPress={() => setShowDestinationMap(true)} style={{marginTop: 8}}>
              <SWText style={{color: '#008080'}}>Select on Map</SWText>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <SWText style={styles.inputLabel}>Pickup Location *</SWText>
            <TextInput
              style={styles.textInput}
              placeholder="Where should we pick you up?"
              value={formData.pickupLocation}
              onChangeText={(text) => setFormData({...formData, pickupLocation: text})}
            />
            <TouchableOpacity onPress={() => setShowPickupMap(true)} style={{marginTop: 8}}>
              <SWText style={{color: '#008080'}}>Select on Map</SWText>
            </TouchableOpacity>
          </View>

          {/* Map Modal for Pickup Location */}
          <Modal visible={showPickupMap} animationType="slide">
            <View style={{flex: 1}}>
              {/* Header with Close button */}
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10, backgroundColor: '#f8f9fa', zIndex: 2, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'}}>
                <TouchableOpacity onPress={() => setShowPickupMap(false)} style={{padding: 8}}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <SWText style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>Select Pickup Location</SWText>
                <View style={{width: 32}} />
              </View>
              {/* Search bar row */}
              <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 0, paddingBottom: 10, backgroundColor: '#f8f9fa', zIndex: 2}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#d1e7dd', paddingHorizontal: 12, paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 2, elevation: 2}}>
                  <Ionicons name="search" size={18} color="#008080" style={{marginRight: 8}} />
                  <TextInput
                    style={{flex: 1, fontSize: 16, color: '#222', paddingVertical: 6}}
                    placeholder="Search pickup location..."
                    placeholderTextColor="#888"
                    value={pickupSearch}
                    onChangeText={setPickupSearch}
                    onSubmitEditing={async () => {
                      if (pickupSearch.trim()) {
                        try {
                          const results = await Location.geocodeAsync(pickupSearch);
                          if (results && results.length > 0) {
                            const loc = results[0];
                            setPickupMapRegion({
                              latitude: loc.latitude,
                              longitude: loc.longitude,
                              latitudeDelta: 0.05,
                              longitudeDelta: 0.05,
                            });
                            setPickupCoords({ latitude: loc.latitude, longitude: loc.longitude });
                          } else {
                            Alert.alert('Location not found');
                          }
                        } catch {
                          Alert.alert('Error searching location');
                        }
                      }
                    }}
                    returnKeyType="search"
                  />
                </View>
                <TouchableOpacity
                  style={{marginLeft: 10, backgroundColor: '#008080', borderRadius: 10, padding: 12, shadowColor: '#008080', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 3}}
                  onPress={async () => {
                    if (pickupSearch.trim()) {
                      try {
                        const results = await Location.geocodeAsync(pickupSearch);
                        if (results && results.length > 0) {
                          const loc = results[0];
                          setPickupMapRegion({
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                          });
                          setPickupCoords({ latitude: loc.latitude, longitude: loc.longitude });
                        } else {
                          Alert.alert('Location not found');
                        }
                      } catch {
                        Alert.alert('Error searching location');
                      }
                    }
                  }}
                >
                  <Ionicons name="search" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
              <MapView
                style={{flex: 1}}
                region={pickupMapRegion}
                onPress={(e) => {
                  setPickupCoords({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude
                  });
                  setPickupMapRegion({
                    ...pickupMapRegion,
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude
                  });
                }}
              >
                {pickupCoords && <Marker coordinate={pickupCoords} />}
              </MapView>
              <Button title="Confirm Pickup Location" varient="primary" onPress={async () => {
                setShowPickupMap(false);
                if (pickupCoords) {
                  await getPlaceName(pickupCoords, (name) => setFormData({...formData, pickupLocation: name}));
                }
                setPickupSearch('');
              }} passstyles={{ marginVertical: 16, marginHorizontal: 16 }} />
            </View>
          </Modal>

          {/* Map Modal for Destination Location */}
          <Modal visible={showDestinationMap} animationType="slide">
            <View style={{flex: 1}}>
              {/* Header with Close button */}
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10, backgroundColor: '#f8f9fa', zIndex: 2, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'}}>
                <TouchableOpacity onPress={() => setShowDestinationMap(false)} style={{padding: 8}}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <SWText style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>Select Destination Location</SWText>
                <View style={{width: 32}} />
              </View>
              {/* Search bar row */}
              <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 0, paddingBottom: 10, backgroundColor: '#f8f9fa', zIndex: 2}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#d1e7dd', paddingHorizontal: 12, paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 2, elevation: 2}}>
                  <Ionicons name="search" size={18} color="#008080" style={{marginRight: 8}} />
                  <TextInput
                    style={{flex: 1, fontSize: 16, color: '#222', paddingVertical: 6}}
                    placeholder="Search destination location..."
                    placeholderTextColor="#888"
                    value={destinationSearch}
                    onChangeText={setDestinationSearch}
                    onSubmitEditing={async () => {
                      if (destinationSearch.trim()) {
                        try {
                          const results = await Location.geocodeAsync(destinationSearch);
                          if (results && results.length > 0) {
                            const loc = results[0];
                            setDestinationMapRegion({
                              latitude: loc.latitude,
                              longitude: loc.longitude,
                              latitudeDelta: 0.05,
                              longitudeDelta: 0.05,
                            });
                            setDestinationCoords({ latitude: loc.latitude, longitude: loc.longitude });
                          } else {
                            Alert.alert('Location not found');
                          }
                        } catch {
                          Alert.alert('Error searching location');
                        }
                      }
                    }}
                    returnKeyType="search"
                  />
                </View>
                <TouchableOpacity
                  style={{marginLeft: 10, backgroundColor: '#008080', borderRadius: 10, padding: 12, shadowColor: '#008080', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 3}}
                  onPress={async () => {
                    if (destinationSearch.trim()) {
                      try {
                        const results = await Location.geocodeAsync(destinationSearch);
                        if (results && results.length > 0) {
                          const loc = results[0];
                          setDestinationMapRegion({
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                          });
                          setDestinationCoords({ latitude: loc.latitude, longitude: loc.longitude });
                        } else {
                          Alert.alert('Location not found');
                        }
                      } catch {
                        Alert.alert('Error searching location');
                      }
                    }
                  }}
                >
                  <Ionicons name="search" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
              <MapView
                style={{flex: 1}}
                region={destinationMapRegion}
                onPress={(e) => {
                  setDestinationCoords({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude
                  });
                  setDestinationMapRegion({
                    ...destinationMapRegion,
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude
                  });
                }}
              >
                {destinationCoords && <Marker coordinate={destinationCoords} />}
              </MapView>
              <Button title="Confirm Destination Location" varient="primary" onPress={async () => {
                setShowDestinationMap(false);
                if (destinationCoords) {
                  await getPlaceName(destinationCoords, (name) => setFormData({...formData, destination: name}));
                }
                setDestinationSearch('');
              }} passstyles={{ marginVertical: 16, marginHorizontal: 16 }} />
            </View>
          </Modal>
          <View style={styles.dateRow}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
              <SWText style={styles.inputLabel}>Departure Date *</SWText>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDeparturePicker(true)}
              >
                <SWText style={[styles.dateInputText, !formData.departureDate && styles.placeholderText]}>
                  {formData.departureDate || 'Departure date'}
                </SWText>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
              <SWText style={styles.inputLabel}>Return Date</SWText>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowReturnPicker(true)}
              >
                <SWText style={[styles.dateInputText, !formData.returnDate && styles.placeholderText]}>
                  {formData.returnDate || 'Return date'}
                </SWText>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <SWText style={styles.inputLabel}>Number of Passengers * (Max 50)</SWText>
            <TextInput
              style={styles.textInput}
              placeholder="How many people?"
              keyboardType="numeric"
              value={formData.passengers}
              onChangeText={(text) => {
                // Only allow numbers
                const numericText = text.replace(/[^0-9]/g, '');
                // Validate maximum 50 passengers
                if (numericText === '' || (parseInt(numericText) <= 50)) {
                  setFormData({...formData, passengers: numericText});
                } else {
                  Alert.alert('Validation Error', 'Maximum number of passengers allowed is 50');
                }
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <SWText style={styles.inputLabel}>Additional Notes</SWText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Any special requirements or notes..."
              multiline
              numberOfLines={3}
              value={formData.additionalNotes}
              onChangeText={(text) => setFormData({...formData, additionalNotes: text})}
            />
          </View>

          <Button
            title={isSearching ? "Searching..." : "Search Available Vans"}
            onPress={handleSearch}
            passstyles={styles.searchButton}
            disabled={isSearching}
          />

          {/* Date Pickers */}
          {showDeparturePicker && (
            <DateTimePicker
              testID="departureDatePicker"
              value={departureDate}
              mode="date"
              is24Hour={true}
              display="default"
              minimumDate={new Date()}
              onChange={onDepartureDateChange}
            />
          )}

          {showReturnPicker && (
            <DateTimePicker
              testID="returnDatePicker"
              value={returnDate}
              mode="date"
              is24Hour={true}
              display="default"
              minimumDate={departureDate}
              onChange={onReturnDateChange}
            />
          )}
        </View>
      ) : (
        <View style={styles.vanSelectionContainer}>
          <View style={[styles.header ]}>
            <SWText style={styles.resultsSubtitle}>
              {formData.destination} • {formData.departureDate} • {formData.passengers} passengers
            </SWText>
            
          </View>
            {/* No general warning display here - only show warnings in individual van cards */}
            
            <View style={{ backgroundColor: '#fffbe6', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <SWText style={{ color: '#856404', fontSize: 15, textAlign: 'center' }}>
              Please note: The estimated fare may vary depending on your length of stay. For final pricing and further arrangements, kindly contact the van owner directly.
            </SWText>
            </View>

          {availableVans.length === 0 ? (
            <SWText style={{ textAlign: 'center', marginTop: 32 }}>No vans found for your trip details.</SWText>
          ) : (
      availableVans.map((van: Van) => (
        <React.Fragment key={van.id}>
          <View style={[styles.vanCard, { borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6, marginBottom: 24, backgroundColor: '#fff' }]}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
              <View style={[styles.vanImageContainer, { borderRadius: 12, overflow: 'hidden', marginRight: 16, backgroundColor: '#f0f4fa', width: 72, height: 72, justifyContent: 'center', alignItems: 'center' }]}> 
                {van.photoUrl ? (
                  <Image source={{ uri: van.photoUrl }} style={{ width: 72, height: 72, borderRadius: 12 }} />
                ) : (
                  <SWText style={{ fontSize: 40 }}>🚐</SWText>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <SWText uberBold style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 4 }}>{van.makeAndModel || 'Van'}</SWText>
                <SWText style={{ fontSize: 15, color: '#008080', marginBottom: 2 }}>
                  <Ionicons name={van.acCondition ? 'snow' : 'sunny'} size={16} color={van.acCondition ? '#2196F3' : '#FFA726'} />
                  {' '}{van.seatingCapacity} seats • {van.acCondition ? 'AC' : 'No AC'}
                </SWText>
                <SWText style={{ fontSize: 15, color: '#FFD700', marginBottom: 2 }}>
                  <Ionicons name="star" size={16} color="#FFD700" /> {van.averageRating ? van.averageRating.toFixed(1) : '-'} / 5
                </SWText>
                
                <SWText style={{ fontSize: 13, color: '#666', marginBottom: 2 }}>
                  <Ionicons name="pricetag" size={14} color="#888" /> Reg: {van.registrationNumber} | Plate: {van.licensePlateNumber}
                </SWText>
                <SWText style={{ fontSize: 13, color: '#666' }}>
                  <Ionicons name="location" size={14} color="#888" /> Pickup: {van.pickupDistance ? van.pickupDistance.toFixed(1) : '-'} km | Trip: {van.tripDistance ? van.tripDistance.toFixed(1) : '-'} km
                </SWText>
                
                {/* Display warning if present */}
                {van.warning && (
                  <View style={{ 
                    backgroundColor: '#FFF3CD', 
                    borderWidth: 1, 
                    borderColor: '#FFEEBA', 
                    borderRadius: 6, 
                    padding: 8,
                    marginTop: 6 
                  }}>
                    <SWText style={{ fontSize: 13, color: '#856404', fontWeight: '500' }}>
                      <Ionicons name="warning" size={14} color="#856404" /> {van.warning}
                    </SWText>
                  </View>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Ionicons name="star" size={18} color="#FFD700" /> */}
                {/* <SWText style={{ fontSize: 15, color: '#333', marginLeft: 4 }}>{van.privateRating}</SWText> */}
              </View>
              <View style={{ backgroundColor: '#e8f4f8', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                <SWText style={{ fontSize: 16, color: '#008080', fontWeight: 'bold' }}>
                  Estimated Fare: Rs. {van.privateRating && van.tripDistance ? Math.round(van.privateRating * van.tripDistance * 2).toLocaleString() : '-'}
                </SWText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 16 }}>
              <TouchableOpacity style={[styles.contactButton, { marginRight: 8 }]}> 
                <SWText style={styles.contactButtonText} onPress={() => Linking.openURL(`tel:${van.contactNo}`)}>Contact</SWText>
              </TouchableOpacity>
              <Button
                title="Request This Van"
                varient="primary"
                onPress={() => handleVanRequest(van)}
                passstyles={styles.requestButton}
              />
              
            </View>
            {/* We're only showing warnings that come directly with each van */}
          </View>
          
        </React.Fragment>
      ))
    )}
        </View>
      )}
    </ScrollView>
  );
  

  // Helper to get place name from coordinates (async)
  const getPlaceNameSync = async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results && results.length > 0) {
        const place = results[0];
        return `${place.name || place.street || ''}, ${place.city || place.region || ''}`;
      }
    } catch {}
    return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
  };

  // State for resolved place names for bookings
  const [bookingPlaces, setBookingPlaces] = useState<{ [id: string]: { pickup: string; destination: string } }>({});

  // Resolve place names for bookings
  useEffect(() => {
    const resolvePlaces = async () => {
      if (hireHistory.length === 0) return;
      const places: { [id: string]: { pickup: string; destination: string } } = {};
      for (const hire of hireHistory) {
        const pickup = await getPlaceNameSync(hire.pickupLat, hire.pickupLng);
        const destination = await getPlaceNameSync(hire.destinationLat, hire.destinationLng);
        places[hire.id] = { pickup, destination };
      }
      setBookingPlaces(places);
    };
    resolvePlaces();
  }, [hireHistory]);

  const renderHistoryTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.historyContainer}>
        <SWText h1 style={styles.historyTitle}>Your Private Hire History</SWText>
        <SWText uberMedium style={styles.historySubtitle}>Track all your vacation van bookings</SWText>

        {hireHistory.length === 0 ? (
          <SWText style={{ textAlign: 'center', marginTop: 32 }}>No bookings found.</SWText>
        ) : (
          [...hireHistory].sort((a, b) => {
            // Sort: accepted first, then others, cancelled/rejected last
            const aLowPriority = a.status && (a.status.toLowerCase() === 'cancelled' || a.status.toLowerCase() === 'rejected');
            const bLowPriority = b.status && (b.status.toLowerCase() === 'cancelled' || b.status.toLowerCase() === 'rejected');
            
            // Put rejected and cancelled at the bottom
            if (aLowPriority && !bLowPriority) return 1; 
            if (!aLowPriority && bLowPriority) return -1;
            
            // If both are rejected, put rejected after cancelled
            if (aLowPriority && bLowPriority) {
              const aRejected = a.status && a.status.toLowerCase() === 'rejected';
              const bRejected = b.status && b.status.toLowerCase() === 'rejected';
              if (aRejected && !bRejected) return 1;
              if (!aRejected && bRejected) return -1;
            }
            
            // For normal priority items, prioritize accepted with final fare
            const aHasFinalAccepted = a.finalFare !== null && a.finalFare !== undefined && a.status && a.status.toLowerCase() === 'accepted';
            const bHasFinalAccepted = b.finalFare !== null && b.finalFare !== undefined && b.status && b.status.toLowerCase() === 'accepted';
            if (aHasFinalAccepted === bHasFinalAccepted) return 0;
            return aHasFinalAccepted ? -1 : 1;
          }).map((hire: any) => (
            <View key={hire.id} style={[styles.historyCard, { borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4, marginBottom: 24, backgroundColor: '#fff', padding: 18 }]}> 
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="car" size={28} color="#008080" style={{ marginRight: 12 }} />
                <SWText style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' }}>
                  {hire.vanId ? `Van #${hire.vanId}` : 'No van assigned'}
                </SWText>
                <View style={{ flex: 1 }} />
                <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(hire.status), marginLeft: 8 }]}> 
                  <SWText style={[styles.statusText, { color: getStatusColor(hire.status), fontWeight: 'bold' }]}>
                    {hire.status}
                  </SWText>
                </View>
              </View>
              <SWText style={{ fontSize: 15, color: '#008080', marginBottom: 2 }}>
                <Ionicons name="location" size={16} color="#008080" /> Pickup: {bookingPlaces[hire.id]?.pickup || `${hire.pickupLat?.toFixed(3)}, ${hire.pickupLng?.toFixed(3)}`}
              </SWText>
              <SWText style={{ fontSize: 15, color: '#008080', marginBottom: 2 }}>
                <Ionicons name="flag" size={16} color="#008080" /> Destination: {bookingPlaces[hire.id]?.destination || `${hire.destinationLat?.toFixed(3)}, ${hire.destinationLng?.toFixed(3)}`}
              </SWText>
              <SWText style={{ fontSize: 15, color: '#008080', marginBottom: 2 }}>
                <Ionicons name="map" size={16} color="#008080" /> Distance: {hire.tripDistance ? `${hire.tripDistance.toFixed(1)} km` : '-'}
              </SWText>
              <SWText style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>
                <Ionicons name="calendar" size={15} color="#888" /> {hire.departureDate ? new Date(hire.departureDate).toLocaleDateString() : '-'}
                {hire.returnDate ? ` - ${new Date(hire.returnDate).toLocaleDateString()}` : ''}
              </SWText>
              <SWText style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>
                <Ionicons name="people" size={15} color="#888" /> {hire.noOfPassengers} passengers
              </SWText>
              <SWText style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>
                <Ionicons name="document-text" size={15} color="#888" /> Notes: {hire.notes || '-'}
              </SWText>
              <View style={{ flexDirection: 'col', alignItems: 'left', marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="cash" size={18} color="#008080" style={{ marginRight: 4 }} />
                  <SWText style={{ fontSize: 16, color: '#008080', fontWeight: 'bold', marginRight: 8 }}>
                    {hire.fare !== null && hire.fare !== undefined ? `Rs. ${Math.round(hire.fare).toLocaleString()}` : 'Fare: -'}
                  </SWText>
                </View>
                {hire.finalFare !== null && hire.finalFare !== undefined && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 8, padding: 8, marginLeft: 0, marginBottom: 4 }}>
                    <SWText style={{ fontSize: 16, color: '#d32f2f', fontWeight: 'bold', marginRight: 12 }}>
                      Final Fare: Rs. {Math.round(hire.finalFare).toLocaleString()}
                    </SWText>
                    {(hire.finalFare !== null && hire.finalFare !== undefined && hire.status && hire.status.toLowerCase() === 'accepted') && (
                      <Button
                        title="Proceed to Pay"
                        varient="primary"
                        passstyles={{ paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#008080', borderRadius: 6 }}
                        onPress={() => {
                          router.push({
                            pathname: '/parent/privateHirePaymentDetails',
                            params: {
                              finalFare: hire.finalFare,
                              destination: bookingPlaces[hire.id]?.destination || `${hire.destinationLat?.toFixed(3)}, ${hire.destinationLng?.toFixed(3)}`,
                              pickupLocation: bookingPlaces[hire.id]?.pickup || `${hire.pickupLat?.toFixed(3)}, ${hire.pickupLng?.toFixed(3)}`,
                              departureDate: hire.departureDate ? new Date(hire.departureDate).toLocaleDateString() : '-',
                              returnDate: hire.returnDate ? new Date(hire.returnDate).toLocaleDateString() : '-',
                              passengers: hire.noOfPassengers,
                              notes: hire.notes || '-',
                              vanId: hire.vanId || '',
                              status: hire.status || '',
                            }
                          });
                        }}
                      />
                    )}
                  </View>
                )}
                
              </View>
              {/* Optionally show cancel button for pending bookings, but not for cancelled or rejected */}
              {hire.status && hire.status.toLowerCase() !== 'cancelled' && hire.status.toLowerCase() !== 'rejected' && (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                  <TouchableOpacity style={[styles.cancelButton, { minWidth: 100 }]}
                   onPress={async () => {
                    try {
                      const response = await fetch(`${API_URL}/private-hire/my-hires/cancel`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: hire.id })
                      });
                      if (!response.ok) throw new Error('Failed to cancel booking');
                      fetchMyHires();
                    } catch (err) {
                      Alert.alert('Error', 'Could not cancel booking.');
                    }
                  }}>
                    <SWText style={styles.cancelButtonText}>Cancel</SWText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
        <View style={[styles.header , { backgroundColor : theme.colors.primary } ]}>
          <TouchableOpacity onPress={() => { router.back()}} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <SWText uberBold style={styles.headerTitle}>Private Hire</SWText>
        </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'request' && styles.activeTab]}
          onPress={() => setActiveTab('request')}
        >
          <SWText uberBold={activeTab === 'request'} style={[styles.tabText, activeTab === 'request' && styles.activeTabText]}>
            Request Van
          </SWText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <SWText uberBold={activeTab === 'history'} style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            My Bookings
          </SWText>
        </TouchableOpacity>
      </View>

      {activeTab === 'request' ? renderRequestTab() : renderHistoryTab()}

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SWText style={styles.modalTitle}>Confirm Request</SWText>
            {selectedVan && (
              <>
                <SWText style={styles.modalText}>
                  You&apos;re about to request <SWText style={styles.modalBold}>{selectedVan.makeAndModel || 'Van'}</SWText> for your trip to <SWText style={styles.modalBold}>{formData.destination}</SWText>.
                </SWText>
                <SWText style={styles.modalDetails}>
                  • Departure: {formData.departureDate}
                  {formData.returnDate && `\n• Return: ${formData.returnDate}`}
                  {`\n• Passengers: ${formData.passengers}`}
                  {`\n• Registration: ${selectedVan.registrationNumber}`}
                </SWText>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowConfirmModal(false)}
                    disabled={isRequesting}
                  >
                    <SWText style={styles.modalCancelText}>Cancel</SWText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={confirmRequest}
                    disabled={isRequesting}
                  >
                    <SWText style={styles.modalConfirmText}>{isRequesting ? 'Sending...' : 'Send Request'}</SWText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PrivateHire;

