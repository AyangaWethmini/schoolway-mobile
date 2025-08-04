import { Ionicons } from '@expo/vector-icons';
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
  const [pickupLocation, setPickupLocation] = useState(null); // {latitude, longitude}
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

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
    const filtered = schools.filter(s =>
      s.schoolName.toLowerCase().includes(query.toLowerCase())
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
          <NumberInput placeholder="Enter Child's age" value={age} hideButtons={false} onChangeText={setAge} />
          <NumberInput placeholder="Enter Child's Grade" value={grade} hideButtons={false} onChangeText={setGrade} />

          {/* Searchable School Dropdown */}
          <TouchableOpacity onPress={() => setShowModal(true)} style={styles.inputGroup}>
            <SWText style={styles.label}>Select School</SWText>
            <View style={styles.dropdownBox}>
              <SWText>{selectedSchool ? selectedSchool.schoolName : 'Tap to select a school'}</SWText>
            </View>
          </TouchableOpacity>

          {/* Modal for School Search */}
          <Modal visible={showModal} animationType="slide">
            <View style={{ flex: 1, padding: 20 }}>
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
                  <TouchableOpacity onPress={() => {
                    setSelectedSchool(item);
                    setShowModal(false);
                  }}>
                    <Text style={styles.schoolItem}>{item.schoolName}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="Close" varient="secondary" onPress={() => setShowModal(false)} />
            </View>
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
            { label: '01:00 PM', value: '13:00' }
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
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 6.9271,
              longitude: 79.8612,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress}
          >
            {pickupLocation && (
              <Marker coordinate={pickupLocation} />
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
  map: { width: '100%', height: 200, marginBottom: 20 },
  searchInput: { borderWidth: 1, padding: 10, marginBottom: 10 },
  schoolItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  bottomContainer: { padding: 20, backgroundColor: '#fff' }
});

export default AddChild;
