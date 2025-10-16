import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList, Image, Modal,
  SafeAreaView, ScrollView, StatusBar, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import 'react-native-get-random-values';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import AddButton from '../components/AddButton';
import { Button } from "../components/button";
import { DropdownInput, MultilineTextInput, NumberInput, TextInputComponent } from '../components/inputs';
import SWText from '../components/SWText';
import { useTheme } from "../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const AddChild = () => {
  const { theme } = useTheme();
  const router = useRouter();

  // Input States
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [schoolStartTime, setSchoolStartTime] = useState('');
  const [schoolEndTime, setSchoolEndTime] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null); // {latitude, longitude, address}
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    // Fetch school list from API
    fetch(`${API_URL}/schools`)
    .then(response => response.json())
    .then(data => {
      setSchools(data);
      setFilteredSchools(data);
    })
    .catch(error => {
      console.error("Failed to fetch schools", error);
    });
  }, []);

  // Update map region when pickup location changes
  useEffect(() => {
    if (pickupLocation) {
      setMapRegion({
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [pickupLocation]);

  // Function to get address from coordinates
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
      if (!apiKey) {
        throw new Error('Google Maps API key not found');
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        // Get the most relevant address (usually the first result)
        const address = data.results[0].formatted_address;
        console.log('Reverse geocoding result:', address);
        return address;
      } else {
        throw new Error(`Geocoding API error: ${data.status}`);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Return coordinate string as fallback
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  // Updated handleMapPress function
  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    
    console.log('Map tapped at:', latitude, longitude);
    
    // Show loading state (optional)
    setPickupLocation({ 
      latitude, 
      longitude, 
      address: 'Loading address...' 
    });

    try {
      // Get human-readable address
      const address = await getAddressFromCoordinates(latitude, longitude);
      
      // Update with real address
      setPickupLocation({ 
        latitude, 
        longitude, 
        address 
      });
      
      console.log('Address found:', address);
    } catch (error) {
      console.error('Failed to get address:', error);
      // Keep coordinates as fallback
      setPickupLocation({ 
        latitude, 
        longitude, 
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
      });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!Array.isArray(schools)) return; // safeguard

    const filtered = schools.filter(s =>
      s.schoolName?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSchools(filtered);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant media access to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedFile(result.assets[0]);
    }
  };

  const handleFinish = async () => {
    if (!childName  || !selectedSchool || !pickupLocation || !schoolStartTime || !schoolEndTime ) {
      Alert.alert('Validation Error', 'Please fill all required fields including pickup location and photo.');
      return;
    }

    if(!age || !grade){
      setAge(1)
      setGrade(2)
    }

    const formData = new FormData();
    formData.append('name', childName);
    formData.append('age', age);
    formData.append('grade', grade);
    formData.append('schoolID', selectedSchool.schoolId.toString());
    formData.append('gateID', selectedSchool.gateId);
    formData.append('schoolStartTime', schoolStartTime);
    formData.append('schoolEndTime', schoolEndTime);
    formData.append('pickupLat', pickupLocation.latitude.toString());
    formData.append('pickupLng', pickupLocation.longitude.toString());
    formData.append('pickupLocation', pickupLocation.address.toString());
    formData.append('specialNotes', specialNotes);

    if (selectedFile) {
      const imageType = selectedFile.mimeType || 'image/jpeg'; 
      formData.append('profilePicture', {
        uri: selectedFile.uri,
        type: imageType,
        name: selectedFile.fileName || 'profile.jpg',
      });
    }

    try {
      const session = await AsyncStorage.getItem('user_session'); // Get ID from storage

      if (session){
         const user = JSON.parse(session);

         formData.append('userId',user.user.id);
         console.log("User ID:", user.user.id);
         const response = await fetch(`${API_URL}/child`, {
          method: 'POST',
          body: formData,
          // Note: Do NOT set Content-Type manually; let fetch set it automatically
        });

        if (!response.ok) {
          throw new Error('Failed to submit');
        }

        const result = await response.json();
        Alert.alert('Success', 'Child information added successfully!');
        router.back();
      }
    } catch (error) {
      console.error('Error submitting child:', error);
      Alert.alert('Error', 'Failed to add child.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <SWText uberBold style={styles.headerTitle}>Add child info</SWText>
        </View>

        <View style={styles.formContainer}>
          {/* Name, Age, Grade */}
          <TextInputComponent placeholder="Enter Child's name" value={childName} onChangeText={setChildName} />
          <NumberInput placeholder="Enter Child's age" value={age}  onChangeText={setAge} />
          <NumberInput placeholder="Enter Child's Grade" value={grade} onChangeText={setGrade} />

          {/* Searchable School Dropdown */}
          <TouchableOpacity onPress={() => setShowModal(true)} style={styles.inputGroup}>
            <SWText style={styles.label}>Select School</SWText>
            <View style={styles.dropdownBox}>
              <SWText>{selectedSchool ? selectedSchool.schoolName : 'Tap to select a school'}</SWText>
            </View>
          </TouchableOpacity>

          {/* Modal for School Search */}
          <Modal visible={showModal} animationType="slide">
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <SWText style={styles.modalTitle}>Select School</SWText>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                placeholder="Search school..."
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchInput}
              />
              
              <FlatList
                data={filteredSchools}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => {
                      setSelectedSchool(item);
                      setShowModal(false);
                      setSearchQuery('');
                    }}
                    style={styles.schoolItemContainer}
                  >
                    <Text style={styles.schoolItem}>{item.schoolName} {item.gateName ? item.gateName : ''} </Text>
                  </TouchableOpacity>
                )}
                style={styles.schoolsList}
                showsVerticalScrollIndicator={true}
              />
              
              <View style={styles.modalFooter}>
                <Button title="Close" varient="secondary" onPress={() => setShowModal(false)} />
              </View>
            </SafeAreaView>
          </Modal>

          {/* Start Time, End Time */}
          <DropdownInput placeholder="Select Start Time" options={[
            { label: '07:10 AM', value: '07:10' },
            { label: '07:30 AM', value: '07:30' },
            { label: '08:00 AM', value: '08:00' }
          ]} selectedValue={schoolStartTime} onSelect={setSchoolStartTime} />

          <DropdownInput placeholder="Select End Time" options={[
            { label: '11:00 AM', value: '11:00' },
            { label: '12:00 PM', value: '12:00' },
            { label: '01:10 PM', value: '13:10' },
            { label: '01:30 PM', value: '13:30' },
          ]} selectedValue={schoolEndTime} onSelect={setSchoolEndTime} />

          {/* Special Notes */}
          <MultilineTextInput
            placeholder="Mention special needs, allergies, etc."
            value={specialNotes}
            onChangeText={setSpecialNotes}
            numberOfLines={4}
          />

          {/* Map for Pickup Location */}
          <SWText style={styles.label}>Select Pickup Location</SWText>
          
          {/* Location Search Button */}
          <TouchableOpacity 
            onPress={() => setShowLocationModal(true)} 
            style={styles.locationSearchButton}
          >
            <SWText style={styles.locationSearchText}>
              {pickupLocation && pickupLocation.address
                ? pickupLocation.address
                : 'Tap to search location'
              }
            </SWText>
            <Ionicons name="search" size={20} color="#666" />
          </TouchableOpacity>

          {/* Location Search Modal */}
          <Modal visible={showLocationModal} animationType="slide">
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <SWText style={styles.modalTitle}>Search Location</SWText>
                <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.locationSearchContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search location..."
                fetchDetails={true}
                onPress={async (data, details) => {
                  console.log('Selected location data:', data);
                  console.log('Selected location details:', details);
                  
                  try {
                    if (details?.geometry?.location) {
                      // Use details if available
                      const { lat, lng } = details.geometry.location;
                      setPickupLocation({ 
                        latitude: lat, 
                        longitude: lng,
                        address: data.description 
                      });
                      setShowLocationModal(false);
                    } else {
                      // Fallback: Fetch details manually using Place ID
                      const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
                      const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.place_id}&fields=geometry&key=${apiKey}`;
                      
                      console.log('Fetching details for place_id:', data.place_id);
                      
                      const response = await fetch(placeDetailsUrl);
                      const detailsData = await response.json();
                      
                      if (detailsData.status === 'OK' && detailsData.result?.geometry?.location) {
                        const { lat, lng } = detailsData.result.geometry.location;
                        setPickupLocation({ 
                          latitude: lat, 
                          longitude: lng,
                          address: data.description 
                        });
                        setShowLocationModal(false);
                      } else {
                        throw new Error('Could not fetch location details');
                      }
                    }
                  } catch (error) {
                    console.error('Error getting location details:', error);
                    // Final fallback: Use default coordinates but keep the address
                    setPickupLocation({ 
                      latitude: 6.9271, // Default to Colombo
                      longitude: 79.8612,
                      address: data.description 
                    });
                    setShowLocationModal(false);
                    Alert.alert('Info', 'Location selected with approximate coordinates. Please adjust on the map if needed.');
                  }
                }}
                onFail={(error) => {
                  console.error('GooglePlacesAutocomplete error:', error);
                  Alert.alert('Error', 'Failed to search locations. Please try again.');
                }}
                onNotFound={() => {
                  console.log('No results found');
                  Alert.alert('No Results', 'No locations found for your search.');
                }}
                query={{
                  key: Constants.expoConfig?.extra?.googleMapsApiKey,
                  language: 'en',
                  location: '6.9271,79.8612', // Bias results towards Colombo
                  radius: 50000, // 50km radius
                  strictbounds: false,
                  components: 'country:lk', // Restrict to Sri Lanka
                }}
                textInputProps={{
                  placeholderTextColor: '#666',
                  autoFocus: true,
                  returnKeyType: 'search',
                }}
                styles={{
                  container: { flex: 1 },
                  textInputContainer: { 
                    width: '100%',
                    backgroundColor: 'transparent',
                    paddingHorizontal: 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    marginBottom: 10,
                  },
                  textInput: { 
                    height: 45, 
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    paddingHorizontal: 15,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    fontSize: 16,
                    color: '#333',
                  },
                  listView: { 
                    backgroundColor: 'white',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    borderRadius: 8,
                    marginTop: 5,
                  },
                  row: {
                    padding: 15,
                    height: 'auto',
                    minHeight: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0',
                  },
                  description: {
                    fontSize: 16,
                    color: '#333',
                    flex: 1,
                  },
                  separator: {
                    height: 0.5,
                    backgroundColor: '#ccc',
                  },
                }}
                enablePoweredByContainer={false}
                debounce={500}
                minLength={3}
                timeout={15000}
                predefinedPlaces={[]}
                listUnderlayColor="transparent"
                suppressDefaultStyles={false}
                keepResultsAfterBlur={true}
                enableHighAccuracyLocation={false}
                keyboardShouldPersistTaps="always" // Change from "handled" to "always" 
                disableScroll={false}
                filterReverseGeocodingByTypes={[
                  'locality',
                  'administrative_area_level_3',
                ]}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry',
                }}

                renderRow={(rowData) => (
                  <TouchableOpacity 
                    style={styles.customRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      console.log('Custom row pressed:', rowData.description);
                      // This should trigger the main onPress
                    }}
                  >
                    <Text style={styles.customRowText}>{rowData.description}</Text>
                  </TouchableOpacity>
                )}
              />
              </View>
              
              <View style={styles.modalFooter}>
                <Button 
                  title="Cancel" 
                  varient="secondary" 
                  onPress={() => setShowLocationModal(false)} 
                />
              </View>
            </SafeAreaView>
          </Modal>

          {/* Map View */}
          <MapView
            style={styles.map}
            region={mapRegion}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {pickupLocation && (
              <Marker 
                coordinate={{
                  latitude: pickupLocation.latitude,
                  longitude: pickupLocation.longitude
                }}
                title="Pickup Location"
                description={pickupLocation.address}
              />
            )}
          </MapView>

          {/* File Upload */}
          <SWText style={styles.label}>Upload Profile Photo</SWText>
          <TouchableOpacity onPress={pickImage} style={styles.uploadContainer}>
            {selectedFile ? (
              <Image source={{ uri: selectedFile.uri }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="camera-outline" size={35} color="#666" />
                <Text style={styles.placeholderText}>Tap to upload profile photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <AddButton text="Add Another Child" onPress={() => router.push('/parent/addChild')} />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button title="Finish" varient="primary" onPress={handleFinish} />
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  uploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  backButton: { padding: 5, marginRight: 15 },
  headerTitle: { fontSize: 18, color: 'white' },
  formContainer: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  dropdownBox: { padding: 10, backgroundColor: '#e0e0e0', borderRadius: 5 },
  map: { width: '100%', height: 200, marginBottom: 20, borderRadius: 10 },
  searchInput: { 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  bottomContainer: { padding: 20, backgroundColor: '#fff' },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  schoolsList: {
    flex: 1,
  },
  schoolItemContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  schoolItem: { 
    padding: 15,
    fontSize: 16,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  
  // Location search styles
  locationSearchButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  locationSearchText: {
    flex: 1,
    color: '#666',
  },
  locationSearchContainer: {
    flex: 1,
    padding: 20,
  },
});

export default AddChild;