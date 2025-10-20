import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import { Button } from "../../components/button";
import { NumberInput, TextInputComponent, } from '../../components/inputs';
import SWText from '../../components/SWText';
import { useTheme } from "../../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const { width } = Dimensions.get('window');

const ChildView = ({ navigation, route }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [attendanceType, setAttendanceType] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [childAttendance,setChildAttendance] = useState({}); 

  useEffect(() => {
    if (!id) return;
    fetchStudent();
    fetchSchools();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await fetch(`${API_URL}/child/childView/${id}`);
      if (!response.ok) throw new Error('Failed to fetch child data');
      const responseData = await response.json();
      const data = responseData.child;

      const studentInfo = {
        name: data.name,
        age: data.age.toString(),
        grade: data.grade,
        school: data.School.schoolName,
        schoolId: data.schoolID,
        gateId: data.gateID,
        gateName: data.School.gateName || '',
        pickupAddress: data.pickupAddress || 'Not Provided',
        dropoffAddress: data.School.schoolName || 'Not Assigned',
        parentContact: data.UserProfile.mobile || 'Not Provided',
        emergencyContact: data.emergencyContact || 'Not Provided',
        specialNotes: data.specialNotes || 'Not Provided',
        hasVan: data.Van ? true : false,
        vanModel: data.Van?.makeAndModel || 'Not Assigned',
        vanRoute: data.Van?.route || 'Not Assigned',
        monthlyFee: data.feeAmount ? `Rs. ${data.feeAmount}` : 'Not Assigned',
        profilePicture: data.profilePicture,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        schoolStartTime: data.schoolStartTime,
        schoolEndTime: data.schoolEndTime,
      };
      setStudentData(studentInfo);
      setEditData(studentInfo);
      console.log(responseData.attendance);
      setChildAttendance(responseData.attendance);

      if (data.pickupLat && data.pickupLng) {
        setPickupLocation({
          latitude: parseFloat(data.pickupLat),
          longitude: parseFloat(data.pickupLng),
          address: data.pickupAddress,
        });
        setMapRegion({
          latitude: parseFloat(data.pickupLat),
          longitude: parseFloat(data.pickupLng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${API_URL}/schools`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSchools(data);
        setFilteredSchools(data);
      } else {
        console.error('Schools data is not an array');
        setSchools([]);
        setFilteredSchools([]);
      }
    } catch (error) {
      console.error('Failed to fetch schools', error);
      setSchools([]);
      setFilteredSchools([]);
    }
  };

  const handleSchoolSearch = (query) => {
    setSchoolSearchQuery(query);
    if (!schools || !Array.isArray(schools) || schools.length === 0) {
      setFilteredSchools([]);
      return;
    }
    const filtered = schools.filter(s =>
      s.schoolName?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSchools(filtered);
  };

  const selectSchool = (school) => {
    setEditData(prev => ({
      ...prev,
      school: school.schoolName,
      schoolId: school.schoolId,
      gateId: school.gateId,
      gateName: school.gateName || '',
      dropoffAddress: school.schoolName,
    }));
    setShowSchoolModal(false);
    setSchoolSearchQuery('');
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
      if (!apiKey) throw new Error('Google Maps API key not found');

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en`
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results?.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setPickupLocation({
      latitude,
      longitude,
      address: 'Loading address...',
    });

    try {
      const address = await getAddressFromCoordinates(latitude, longitude);
      setPickupLocation({
        latitude,
        longitude,
        address,
      });
      setEditData(prev => ({
        ...prev,
        pickupAddress: address,
        pickupLat: latitude,
        pickupLng: longitude,
      }));
    } catch (error) {
      console.error('Failed to get address:', error);
      setPickupLocation({
        latitude,
        longitude,
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      });
    }
  };

  const pickImage = async () => {
    console.log("hello");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant media access to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      setSelectedFile(result.assets[0]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      
      const gradeCandidate = (editData.grade ?? '').toString();
      const gradeValue = parseInt(gradeCandidate.replace(/[^\d]/g, ''), 10);
      if (isNaN(gradeValue) || gradeValue < 1 || gradeValue > 13) {
        Alert.alert('Validation Error', 'Please enter a valid grade between 1 and 13.');
        setLoading(false);
        return;
      }


      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('age', editData.age);
      formData.append('grade', editData.grade.replace('Grade ', ''));
      formData.append('specialNotes', editData.specialNotes);
      formData.append('pickupLocation', pickupLocation?.address || editData.pickupAddress);
      formData.append('pickupLat', pickupLocation?.latitude || editData.pickupLat || '0');
      formData.append('pickupLng', pickupLocation?.longitude || editData.pickupLng || '0');
      formData.append('schoolID', editData.schoolId?.toString());
      formData.append('gateID', editData.gateId?.toString());
      formData.append('schoolStartTime', editData.schoolStartTime);
      formData.append('schoolEndTime', editData.schoolEndTime);

      if (selectedFile && typeof selectedFile !== 'string') {
        formData.append('profilePicture', {
          uri: selectedFile.uri,
          type: selectedFile.mimeType || 'image/jpeg',
          name: selectedFile.fileName || 'profile.jpg',
        });
      }

      const response = await fetch(`${API_URL}/child/update/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update student details');

      Alert.alert('Success', 'Student details updated successfully!');
      setIsEditMode(false);
      setSelectedFile(null);
      fetchStudent();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditData(studentData);
    setSelectedFile(null);
    if (studentData.pickupLat && studentData.pickupLng) {
      setPickupLocation({
        latitude: typeof studentData.pickupLat === 'string' ? parseFloat(studentData.pickupLat) : studentData.pickupLat,
        longitude: typeof studentData.pickupLng === 'string' ? parseFloat(studentData.pickupLng) : studentData.pickupLng,
        address: studentData.pickupAddress,
      });
    }
  };

  const handleBack = () => router.back();
  const handleEdit = () => {
    if (isEditMode) {
      handleCancel();
    } else {
      setIsEditMode(true);
    }
  };

  const handleMarkAttendance = () => setShowAttendanceModal(true);

  const submitAttendance = async () => {
    try {
      if (!attendanceType) return;

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const localDate = tomorrow.toLocaleDateString('en-CA'); // "YYYY-MM-DD" in local timezone

      console.log("Tomorrow local date:", localDate);

      const response = await fetch(`${API_URL}/childAttendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: id,
          date: localDate,
          attendanceType,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to mark attendance');
      Alert.alert('Success', 'Attendance marked successfully!');
      setShowAttendanceModal(false);
      setAttendanceType('');
      setChildAttendance(result.attendance);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };



  const InfoRow = ({ label, value, field }) => (
    <View style={styles.infoRow}>
      <SWText style={styles.infoLabel}>{label}:</SWText>
      {isEditMode && ['name', 'age', 'specialNotes', 'pickupAddress'].includes(field) ? (
        <TextInputComponent
          style={styles.editInput}
          value={editData[field]}
          onChangeText={(text) => setEditData(prev => ({ ...prev, [field]: text }))}
          multiline={field === 'pickupAddress' || field === 'specialNotes'}
        />
      ) : (
        <SWText style={styles.infoValue}>{editData[field] || value}</SWText>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <SWText style={{ marginTop: 10, color: '#666' }}>Loading student data...</SWText>
      </SafeAreaView>
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
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <SWText uberBold style={styles.headerTitle}>Student Details</SWText>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons name={isEditMode ? "close" : "create"} size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={[styles.profileCard, styles.scrollableCard]} pointerEvents="box-none">
          <View style={styles.avatarContainer} pointerEvents="none">
            {isEditMode && selectedFile ? (
              <Image
                source={{ uri: selectedFile.uri }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
                resizeMode="cover"
              />
            ) : editData.profilePicture ? (
              <Image
                source={{ uri: editData.profilePicture }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-circle" size={80} color={'grey'} />
            )}
            {isEditMode && (
              <TouchableOpacity style={[styles.cameraIcon, { zIndex: 10, elevation: 10 }]} activeOpacity={0.7} onPress={pickImage}>
                <Ionicons name="camera" size={30} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <SWText h1 style={styles.studentName}>{editData.name}</SWText>
          <SWText style={styles.studentGrade}>Grade {editData.grade} • {editData.school}</SWText>
        </View>

       {!isEditMode && studentData.hasVan && (
          <View style={styles.quickActions}>
            {childAttendance?.routeType ? (
              // If attendance is already marked
              <>
                <View style={[styles.actionButton, { flexDirection: 'column' }]}>
                  <SWText style={styles.actionText}>
                    Marked for {childAttendance.routeType.toLowerCase() === 'both'
                      ? 'Morning & Evening'
                      : childAttendance.routeType.toLowerCase() === 'morning_pickup'
                      ? 'Morning Ride'
                      : 'Evening Ride'}
                  </SWText>
                </View>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                  onPress={async () => {
                    try {
                      const response = await fetch(`${API_URL}/childAttendance/unmark`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(
                          { 
                            id: childAttendance.id 

                          }
                        ),
                      });
                      const result = await response.json();
                      if (!response.ok) throw new Error(result.error || 'Failed to unmark attendance');

                      Alert.alert('Success', 'Attendance unmarked successfully!');
                      setChildAttendance({}); 
                    } catch (error) {
                      Alert.alert('Error', error.message);
                    }
                  }}
                >
                  <SWText style={[styles.actionText, { color: '#fff' }]}>Unmark Attendance</SWText>
                </TouchableOpacity>
              </>
            ) : (
              // If attendance not marked
              <TouchableOpacity style={styles.actionButton} onPress={handleMarkAttendance}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.backgroundLightGreen} />
                <SWText style={styles.actionText}>Mark Attendance</SWText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/parent/childAttendance/${id}`)}
            >
              <Ionicons name="calendar" size={24} color={theme.colors.accentblue} />
              <SWText style={styles.actionText}>View Calendar</SWText>
            </TouchableOpacity>
          </View>
        )}

        {!isEditMode && (
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/parent/generateQR/${id}`)}
            >
              <Ionicons name="qr-code" size={24} color={theme.colors.accentblue} />
              <SWText style={styles.actionText}>Generate a QR code</SWText>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.infoCard, styles.scrollableCard]}>
          <SWText style={styles.sectionTitle}>Personal Information</SWText>
          <InfoRow label="Full Name" value={studentData.name} field="name" />
          {isEditMode ? (
            <View style={styles.infoRow}>
              <SWText style={styles.infoLabel}>Grade:</SWText>
              <NumberInput
                style={styles.editInput}
                placeholder="Enter Child's Grade"
                value={editData.grade}
                onChangeText={(text) => setEditData(prev => ({ ...prev, grade: text }))}
              />
            </View>
          ) : (
            <InfoRow label="Grade" value={studentData.grade} field="grade" />
          )}
          {isEditMode && !studentData.hasVan ? (
            <View style={styles.infoRow}>
              <SWText style={styles.infoLabel}>School:</SWText>
              <TouchableOpacity
                onPress={() => setShowSchoolModal(true)}
                style={styles.editInput}
              >
                <SWText style={{ color: '#333', paddingVertical: 10 }}>
                  {editData.school || 'Tap to select a school'}
                </SWText>
              </TouchableOpacity>
            </View>
          ) : (
            <InfoRow label="School" value={studentData.school} field="school" />
          )}
          <InfoRow label="Special Notes" value={studentData.specialNotes} field="specialNotes" />
        </View>

        <View style={[styles.infoCard, styles.scrollableCard]}>
          <SWText style={styles.sectionTitle}>Transport Information</SWText>
          <InfoRow label="Pickup Address" value={studentData.pickupAddress} field="pickupAddress" />
          {isEditMode ? (
            <View style={styles.infoRow}>
              <SWText style={styles.infoLabel}>Drop-off Address:</SWText>
              <SWText style={styles.infoValue}>{editData.dropoffAddress}</SWText>
            </View>
          ) : (
            <InfoRow label="Drop-off Address" value={studentData.dropoffAddress} field="dropoffAddress" />
          )}

          {isEditMode && !studentData.hasVan && (
            <>
              <SWText style={{ fontSize: 14, fontWeight: '600', marginTop: 15, marginBottom: 10, color: '#333' }}>
                Select Pickup Location
              </SWText>
              <TouchableOpacity
                onPress={() => setShowLocationModal(true)}
                style={styles.editInput}
              >
                <SWText style={{ color: '#666' }}>
                  {pickupLocation?.address || 'Tap to search location'}
                </SWText>
              </TouchableOpacity>
              <MapView
                style={styles.map}
                region={mapRegion}
                onPress={handleMapPress}
              >
                {pickupLocation && (
                  <Marker
                    coordinate={{
                      latitude: pickupLocation.latitude,
                      longitude: pickupLocation.longitude,
                    }}
                    title="Pickup Location"
                    description={pickupLocation.address}
                  />
                )}
              </MapView>
            </>
          )}

          {studentData.hasVan && (
            <>
              <InfoRow label="Van Number" value={studentData.vanModel} field="vanModel" />
              <InfoRow label="Monthly Fee" value={studentData.monthlyFee} field="monthlyFee" />
              {!isEditMode && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Button
                    title="Add a Review"
                    varient="outlined-primary"
                    onPress={() => router.push(`/parent/addReview/${id}`)}
                  />
                </View>
              )}
            </>
          )}

          {!studentData.hasVan && !isEditMode && (
            <Button
              title="Assign to Van"
              varient="secondary"
              onPress={() => router.push(`/parent/vansearch/${id}`)}
            />
          )}
        </View>

        <View style={[styles.infoCard, styles.scrollableCard]}>
          <SWText style={styles.sectionTitle}>Contact Information</SWText>
          <InfoRow label="Parent Contact" value={studentData.parentContact} field="parentContact" />
          <InfoRow label="Emergency Contact" value={studentData.emergencyContact} field="emergencyContact" />
        </View>

        {isEditMode && (
          <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 20 }}>
            <TouchableOpacity
              style={[styles.saveButton, { flex: 1, backgroundColor: '#ccc' }]}
              onPress={handleCancel}
            >
              <SWText style={styles.saveButtonText}>Cancel</SWText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { flex: 1 }]}
              onPress={handleSave}
            >
              <SWText style={styles.saveButtonText}>Save Changes</SWText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* School Selection Modal */}
      <Modal visible={showSchoolModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <SWText style={styles.modalTitle}>Select School</SWText>
            <TouchableOpacity onPress={() => setShowSchoolModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Search school..."
            value={schoolSearchQuery}
            onChangeText={handleSchoolSearch}
            style={styles.searchInput}
          />

          <FlatList
            data={filteredSchools}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectSchool(item)}
                style={styles.schoolItemContainer}
              >
                <SWText style={styles.schoolItem}>
                  {item.schoolName} {item.gateName ? `(${item.gateName})` : ''}
                </SWText>
              </TouchableOpacity>
            )}
            style={styles.schoolsList}
          />

          <View style={styles.modalFooter}>
            <Button title="Close" varient="secondary" onPress={() => setShowSchoolModal(false)} />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Location Selection Modal */}
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
                try {
                  if (details?.geometry?.location) {
                    const { lat, lng } = details.geometry.location;
                    setPickupLocation({
                      latitude: lat,
                      longitude: lng,
                      address: data.description,
                    });
                    setEditData(prev => ({
                      ...prev,
                      pickupAddress: data.description,
                      pickupLat: lat,
                      pickupLng: lng,
                    }));
                    setShowLocationModal(false);
                  }
                  else {
                      // Fallback: Fetch details manually using Place ID
                      const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
                      const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.place_id}&fields=geometry&key=${apiKey}`;
                                            
                      const response = await fetch(placeDetailsUrl);
                      const detailsData = await response.json();
                      
                      if (detailsData.status === 'OK' && detailsData.result?.geometry?.location) {
                        const { lat, lng } = detailsData.result.geometry.location;
                        setPickupLocation({ 
                          latitude: lat, 
                          longitude: lng,
                          address: data.description 
                        });
                        setEditData(prev => ({
                          ...prev,
                          pickupAddress: data.description,
                          pickupLat: lat,
                          pickupLng: lng,
                        }));
                        setShowLocationModal(false);
                      } else {
                        throw new Error('Could not fetch location details');
                      }
                    }
                }
                catch (error) {
                  console.error('Error getting location details:', error);
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
                location: '6.9271,79.8612',
                radius: 50000,
                components: 'country:lk',
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

      {/* Attendance Modal */}
      <Modal visible={showAttendanceModal} transparent={true} animationType="slide" onRequestClose={() => setShowAttendanceModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SWText style={styles.modalTitle}>Mark Tomorrow's Attendance</SWText>
            <SWText style={styles.modalSubtitle}>for {editData.name}</SWText>

            <View style={styles.attendanceOptions}>
              <TouchableOpacity
                style={[styles.attendanceOption, attendanceType === 'morning_pickup' && styles.selectedOption]}
                onPress={() => setAttendanceType('morning_pickup')}
              >
                <SWText style={styles.optionText}>Morning Ride</SWText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.attendanceOption, attendanceType === 'evening_dropoff' && styles.selectedOption]}
                onPress={() => setAttendanceType('evening_dropoff')}
              >
                <SWText style={styles.optionText}>Evening Ride</SWText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.attendanceOption, attendanceType === 'both' && styles.selectedOption]}
                onPress={() => setAttendanceType('both')}
              >
                <SWText style={styles.optionText}>Both</SWText>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAttendanceModal(false)}>
                <SWText style={styles.cancelButtonText}>Cancel</SWText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, !attendanceType && styles.disabledButton]}
                onPress={submitAttendance}
                disabled={!attendanceType}
              >
                <SWText style={styles.confirmButtonText}>Confirm</SWText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  scrollableCard: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: { padding: 5 },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginLeft: -29,
  },
  editButton: { padding: 5 },
  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: { marginBottom: 10, position: 'relative' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0351bd',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentName: { color: '#333', marginBottom: 5 },
  studentGrade: { fontSize: 16, color: '#666' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginBottom: 20 },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: { marginTop: 5, fontSize: 12, color: '#333', fontWeight: '600' ,textAlign : 'center'},
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  infoRow: { marginBottom: 15 },
  infoLabel: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: '600' },
  infoValue: { fontSize: 16, color: '#333' },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  map: { width: '100%', height: 200, marginVertical: 15, borderRadius: 10 },
  saveButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: width * 0.9, maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#333' },
  modalSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666' },
  attendanceOptions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  attendanceOption: { alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', flex: 1, marginHorizontal: 5 },
  selectedOption: { borderColor: '#0351bdff', backgroundColor: '#fafdffff' },
  optionText: { marginTop: 5, fontSize: 14, fontWeight: '600', color: '#333' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { flex: 1, padding: 15, borderRadius: 8, backgroundColor: '#f0f0f0', alignItems: 'center', marginRight: 10 },
  cancelButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
  confirmButton: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginLeft: 10 ,backgroundColor: '#44c92dff'},
  confirmButtonText: { color: '#016007ff', fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#ccc' },

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
  searchInput: {
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  locationSearchContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default ChildView;