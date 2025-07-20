import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button } from '../../components/button';
import ErrorText from '../../components/ErrorText';
import { TextInputComponent } from '../../components/inputs';
import KeyboardAwareScrollView from '../../components/KeyboardAwareScrollView';
import SafeAreaView from '../../components/SafeAreaView';
import TextHeader from '../../components/TextHeader';
import { FormContext } from '../../utils/FormContext';
const API_URL = Constants.expoConfig?.extra?.apiUrl;

const VerificationStep = ({}) => {
  const { formData, updateFormData } = useContext(FormContext);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const [frontImageUri, setFrontImageUri] = useState(null);
  const [backImageUri, setBackImageUri] = useState(null);
  const [proceed, setProceed] = useState(false);
  const [Error, setError] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (formData.licenseId && formData.licenseExpiry && frontImageUri && backImageUri) {
      const isExpiryValid = chekExpiry(formData.licenseExpiry);
      if (!isExpiryValid) {
        setError(null);
        setProceed(true);
        return;
      }
      setProceed(true);
    } else {
      setProceed(false);
    }
  }, [formData.licenseExpiry, frontImageUri, backImageUri]);

  const chekExpiry = (date) => {
    const today = new Date();
    const selected = new Date(date);
    console.log('Selected Date:', selected, today);
    if (selected < today || today - selected <  10 * 365 * 24 * 60 * 60 * 1000) {
      setError('Please select a valid date of expiry.');
      return false;
    }else {
      return true;
    }

  }

  const handleConfirm = (date) => {
    setSelectedDate(date.toDateString());
    updateFormData('licenseExpiry', date.toISOString().split('T')[0]); // Store date in YYYY-MM-DD format
    hideDatePicker();
  };

  const pickImage = async (imageType) => {
    // Ask permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (imageType === 'front') {
        setFrontImageUri(result.assets[0].uri);
        updateFormData('licenseFront', result.assets[0].uri);
      } else {
        setBackImageUri(result.assets[0].uri);
        updateFormData('licenseBack', result.assets[0].uri); 
      }
    }
  };

const onSubmit = async () => {
  console.log('Form Data:', formData);
  setIsLoading(true);
  setError(null);
  try {
    // Create fresh FormData inside the try block
    const payload = new FormData();

    // Append all text fields from formData
    Object.keys(formData).forEach((key) => {
      if (key !== 'licenseFront' && key !== 'licenseBack' && key !== 'nic_img') {
        payload.append(key, formData[key]);
      }
    });

    // Append image files (if available)
    if (frontImageUri) {
      payload.append('licenseFront', {
        uri: frontImageUri,
        name: 'license_front.jpg',
        type: 'image/jpeg',
      });
    }

    if (backImageUri) {
      payload.append('licenseBack', {
        uri: backImageUri,
        name: 'license_back.jpg',
        type: 'image/jpeg',
      });
    }

    if (formData.nic_img) {
      console.log('Appending NIC image:', formData.nic_img);
      payload.append('nic_img', {
        uri: formData.nic_img,
        name: 'nic_img.jpg',
        type: 'image/jpeg',
      });
    }

    console.log('Final payload (FormData):', payload);

    const response = await fetch(`${API_URL}/mobileAuth/signup`, {
      method: 'POST',
      body: payload,  
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });

    console.log('Response Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Response:', data);
      alert('Account created successfully!');
      router.push('/login/login');
    } else {
      const errorData = await response.json();
      console.error('Signup failed:', errorData);
      alert('Signup failed. Check the data and try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while signing up.');
  } finally {
    // Always reset loading state
    setIsLoading(false);
  }
};



 return ( 
  <SafeAreaView> 
    <KeyboardAwareScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.form}>
       <TextHeader>
        Driving License Information
       </TextHeader>

       {
          Error &&
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <ErrorText Error={Error}></ErrorText>
        </View>}
        
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        
        <TextInputComponent
          placeholder="id in your driving license"
          label='License ID number'
          keyboardType='numeric'
          value={formData.licenseId}
          onChangeText={(val) => updateFormData('licenseId', val)}
        />
        {/* Date of Birth Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity
            onPress={showDatePicker}
            style={{
              // marginLeft: 8,
              gap: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              // height: 48, 
              // width: 48,
            }}
          >
          <View style={{ flex: 1 }}>
            <TextInputComponent
              placeholder="select expiry date"
              label="License Expiry Date"
              value={selectedDate}
              disabled={true}
              passstyle={{backgroundColor: '#FAF8F8'}}
              // onChangeText={(val) => onChange('name', val)}
            />
          </View>
          
            <Ionicons name="calendar-outline" size={35} color="#000" />
          </TouchableOpacity>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <TextHeader style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
              Images of Both sides of License
            </TextHeader>
            
            {/* Front Image */}
            <View style={{ marginBottom: 20 }}>
              <TextHeader style={{ fontSize: 14, textAlign: 'center', marginBottom: 10 }}>
                Front Side
              </TextHeader>
              {frontImageUri ? (
                <TouchableOpacity
                  onPress={() => pickImage('front')}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "100%",
                  }}
                >
                  <Image source={{ uri: frontImageUri }} style={styles.image} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => pickImage('front')}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 100,
                    width: "100%",
                    backgroundColor: '#F5F5F5',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#DDD',
                    borderStyle: 'dashed',
                  }}
                >
                  <Ionicons name="camera-outline" size={35} color="#666" />
                  <TextHeader style={{ fontSize: 12, textAlign: 'center', marginTop: 5, color: '#666' }}>
                    Tap to upload front side
                  </TextHeader>
                </TouchableOpacity>
              )}
            </View>

            {/* Back Image */}
            <View style={{ marginBottom: 20 }}>
              <TextHeader style={{ fontSize: 14, textAlign: 'center', marginBottom: 10 }}>
                Back Side
              </TextHeader>
              {backImageUri ? (
                <TouchableOpacity
                  onPress={() => pickImage('back')}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "100%",
                  }}
                >
                  <Image source={{ uri: backImageUri }} style={styles.image} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => pickImage('back')}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 100,
                    width: "100%",
                    backgroundColor: '#F5F5F5',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#DDD',
                    borderStyle: 'dashed',
                  }}
                >
                  <Ionicons name="camera-outline" size={35} color="#666" />
                  <TextHeader style={{ fontSize: 12, textAlign: 'center', marginTop: 5, color: '#666' }}>
                    Tap to upload back side
                  </TextHeader>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <Button 
          title={isloading ? "Processing..." : "Create Account"}
          varient="primary"
          passstyles={{ marginTop: 20 }}
          onPress={onSubmit}
          disabled={!proceed || isloading}
        />
      
    </View>
        
        
    </KeyboardAwareScrollView>
  </SafeAreaView>
 );
};

export default VerificationStep;


const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  form:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  image: { 
    width: "100%", 
    aspectRatio: 1.6, // Makes the image rectangular for license card aspect ratio
    marginTop: 10, 
    backgroundColor:'#DDD', 
    borderRadius: 10,
    resizeMode: 'contain', // Ensures the whole image is visible
    alignSelf: 'center',
  },
});


