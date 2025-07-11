import { Ionicons } from '@expo/vector-icons';
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
import Spacer from '../../components/Spacer';
import TextHeader from '../../components/TextHeader';
import { FormContext } from '../../utils/FormContext';

const VerificationStep = ({}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {formData, updateFormData} = useContext(FormContext);
  const [selectedDate, setSelectedDate] = useState('');
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const [imageUri, setImageUri] = useState(null);
  const [nextStep, setNextStep] = useState(formData.role === 'DRIVER' ? true : false);
  const router = useRouter();
  const [Error, setError] = useState(null);
  const [proceed, setProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { 
    // console.log("amor")
    if (formData.birthDate) {
      const date = new Date(formData.birthDate);
      if (checkDate(date)) {
        setError(null);
        setSelectedDate(date.toDateString());
      }
    }

    if (formData.nic_img) {
      setImageUri(formData.nic_img);
    }

    // if (!checkNIC(formData.nic)) {
    //   setProceed(false);
    //   return;
    // }

    // Check if all required fields are filled and valid
    if (formData.nic_img && formData.birthDate && formData.firstname && formData.lastname && formData.nic && formData.address) {
      const nicValid = formData.nic ? checkNIC(formData.nic) : false;
      const dateValid = formData.birthDate ? checkDate(new Date(formData.birthDate)) : false;
      
      
      if (dateValid && nicValid) {
        setProceed(true);
        setError(null);
      } else {
        setProceed(false);
      }
    } else {
      setProceed(false);
    }

    
  }, [formData.firstname, formData.lastname, formData.nic, formData.birthDate, formData.address, formData.nic_img]);

  const checkDate = (date) => {
    const today = new Date();
    const selected = new Date(date);
    console.log('Selected Date:', selected, today);
    if (selected > today || today - selected >  100 * 365 * 24 * 60 * 60 * 1000) {
      setError('Please select a valid date of birth.');
      // console.log('Invalid date:', selected, today);
      return false;
    }else if(today - selected < 18 * 365 * 24 * 60 * 60 * 1000) {
      setError('You must be at least 18 years old to register.');
      return false;
    }
    // setError(null);
    return true;
  }

  const checkNIC = (nic) => {
    // Simple check for NIC format (e.g., 0123456789V or 200232401493)
    console.log("checking the nic vcalidity")
    const nicRegex = /^(\d{9}V|\d{12})$/;
    if (!nicRegex.test(nic)) {
      setError('Please enter a valid NIC number.');
      return false;
    }
    // setError(null);
    return true;
  }

  
  const handleConfirm = (date) => {
    setSelectedDate(date.toDateString());
    updateFormData('birthDate', date.toISOString().split('T')[0]); // Store date in YYYY-MM-DD format
    hideDatePicker();
  };

  const pickImage = async () => {
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
      setImageUri(result.assets[0].uri);
      updateFormData('nic_img', result.assets[0].uri); 
    }
  };

  const onNext = () => {
    console.log('Form Data:', formData);
    router.push('./driver_step4');
  };

  const onSubmitw = () => {
    console.log('Form Data:', formData);
    // router.push('./steps/driver_step3');
    // Here you would typically handle form submission, e.g., send data to your backend
    alert('Account created successfully!');
  };

  
const onSubmit = async () => {
  console.log('Form Data:', formData);

  const payload = new FormData();

  // Append all text fields from formData
  Object.keys(formData).forEach((key) => {
    // Skip image URIs, because we append them as files below
    if (key !== 'nic_img') {
      payload.append(key, formData[key]);
    }
  });

  // Append image files (if available)
  if (formData.nic_img) {
    console.log('Appending NIC image:', formData.nic_img);
    payload.append('nic_img', {
      uri: formData.nic_img,
      name: 'nic_img.jpg',
      type: 'image/jpeg',
    });
  }

  console.log('Final payload (FormData):', payload);
  setIsLoading(true);
  
  try {
    const response = await fetch('http://192.168.1.62:3000/api/mobileAuth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: payload, // ✅ Use payload with all fields + images
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Response:', data);
      alert('Account created successfully!');
    } else {
      const errorData = await response.json();
      console.error('Signup failed:', errorData);
      alert('Signup failed. Check the data and try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while signing up.');
  }
  // Reset form data after submission
  setIsLoading(false);
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
        Personal Information
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
          placeholder="first name"
          label="Full Name"
          value={formData.firstname}
          onChangeText={(val) => updateFormData('firstname', val)}
        />
        <TextInputComponent
          placeholder="last name"
          value={formData.lastname}
          onChangeText={(val) => updateFormData('lastname', val)}
        />
        <TextInputComponent
          placeholder="your current living address"
          label='Address'
          value={formData.address}
          onChangeText={(val) => updateFormData('address', val)}
        />
        <TextInputComponent
          placeholder="your NIC or Passport number"
          label='Identification Number'
          value={formData.nic}
          onChangeText={(val) => updateFormData('nic', val)}
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
              width: '100%',
            }}
          >
          <View style={{ flex: 1 }}>
            <TextInputComponent
              placeholder="date of birth"
              label="Birth date"
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
          <View style={{ flex: 1,alignContent: 'center', justifyContent: 'center', flexDirection: 'row'  }}>
            {imageUri ? (
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  marginLeft: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  // height: 48, 
                  width: "70%",
                }}
              >
                <Image source={{ uri: imageUri }} style={styles.image} />
              </TouchableOpacity>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    marginLeft: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 48, 
                    width: "100%",
                  }}
                >
                  <Ionicons name="camera-outline" size={35} color="#000" />
                </TouchableOpacity>
                <TextHeader style={{ fontSize: 14, textAlign: 'center', marginTop: 10 }}>
                  Tap to upload your NIC or Passport photo
                </TextHeader>
              </View>
            )}
          </View>
          {/* <TouchableOpacity
            onPress={pickImage}
            style={{
              marginLeft: 8,
              alignItems: 'center',
              justifyContent: 'center',
              height: 48, 
              width: 48,
            }}
          >
            <Ionicons name="camera-outline" size={35} color="#000" />
          </TouchableOpacity> */}
        </View>
        <Spacer/>
        <Button 
          title={formData.role==='DRIVER'? "Proceed" : isLoading ? "Processing..." : "Create Account"}
          varient="primary"
          passstyles={{ marginTop: 20 }}
          onPress={nextStep ? onNext : onSubmit}
          disabled={!proceed || isLoading}
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
    aspectRatio: 1, // Makes the image square and responsive
    marginTop: 20, 
    backgroundColor:'#DDD', 
    borderRadius: 10,
    resizeMode: 'contain', // Ensures the whole image is visible
    alignSelf: 'center',
  },
});


