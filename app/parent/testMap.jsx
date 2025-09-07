import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet
} from 'react-native';
import 'react-native-get-random-values';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';
import SWText from '../components/SWText';
import { useTheme } from "../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const TestMap = () => {
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
  const [pickupLocation, setPickupLocation] = useState(null); // {latitude, longitude}
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const testGooglePlacesApi = async () => {
    const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
    const testUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Colombo&key=${apiKey}`;

    try {
      const response = await fetch(testUrl);
      const data = await response.json();

      if (data.status === 'OK') {
        console.log('Google Places API is working:', data.predictions);
      } else {
        console.warn('Google Places API error:', data.status, data.error_message);
        Alert.alert('Google Places API error', `${data.status}: ${data.error_message}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Network error', 'Failed to reach Google Places API');
    }
  };

  useEffect(() => {
    testGooglePlacesApi();
  }, []);


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

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPickupLocation({ latitude, longitude });
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
    formData.append('schoolID', selectedSchool.id.toString());
    formData.append('schoolStartTime', schoolStartTime);
    formData.append('schoolEndTime', schoolEndTime);
    formData.append('pickupLat', pickupLocation.latitude.toString());
    formData.append('pickupLng', pickupLocation.longitude.toString());
    formData.append('specialNotes', specialNotes);

    const imageType = selectedFile.mimeType || 'image/jpeg'; 
    formData.append('profilePicture', {
      uri: selectedFile.uri,
      type: imageType,
      name: selectedFile.fileName || 'profile.jpg',
    });

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
      <>
          {/* Map for Pickup Location */}
          <SWText style={styles.label}>Select Pickup Location</SWText>
           <GooglePlacesAutocomplete
            placeholder="Search location..."
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (details?.geometry?.location) {
                const { lat, lng } = details.geometry.location;
                setPickupLocation({ latitude: lat, longitude: lng });
              }
            }}
            query={{
              key: Constants.expoConfig?.extra?.googleMapsApiKey,
              language: 'en',
              types: '(cities)',
            }}
            textInputProps={{
              onFocus: () => console.log('TextInput focused'), // Explicitly define onFocus
              onBlur: () => console.log('TextInput blurred'), // Optional: for debugging
              placeholderTextColor: '#666', // Ensure placeholder is styled
            }}
            styles={{
              container: { flex: 0, zIndex: 1000 },
              textInputContainer: { width: '100%' },
              textInput: { height: 40, borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 10 },
              listView: { backgroundColor: 'white' },
            }}
            enablePoweredByContainer={false}
            debounce={200}
            predefinedPlaces={[]} // 👈 Add this line to fix the error
          />
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 6.9271,
              longitude: 79.8612,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={pickupLocation ? {
              ...pickupLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            } : undefined}
            onPress={handleMapPress}
          >
            {pickupLocation && (
              <Marker coordinate={pickupLocation} />
            )}
          </MapView>
          </>
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
  map: { width: '100%', height: 200, marginBottom: 20 },
  searchInput: { borderWidth: 1, padding: 10, marginBottom: 10 },
  schoolItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  bottomContainer: { padding: 20, backgroundColor: '#fff' }
});

export default TestMap;
