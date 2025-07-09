import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button } from '../../components/button';
import { TextInputComponent } from '../../components/inputs';
import KeyboardAwareScrollView from '../../components/KeyboardAwareScrollView';
import SafeAreaView from '../../components/SafeAreaView';
import TextHeader from '../../components/TextHeader';
const VerificationStep = ({ formData, onChange, onNext, onBack }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const [imageUri, setImageUri] = useState(null);

  const handleConfirm = (date) => {
    setSelectedDate(date.toDateString());
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
        Personal Information
       </TextHeader>
        
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
    
        <TextInputComponent
          placeholder="first name"
          label="Full Name"
          // value={formData.name}
          // onChangeText={(val) => onChange('name', val)}
        />
        <TextInputComponent
          placeholder="last name"
          // value={formData.lastname}
          // onChangeText={(val) => onChange('lastname', val)}
        />
        <TextInputComponent
          placeholder="your current living address"
          label='Address'
          // value={formData.address}
          // onChangeText={(val) => onChange('address', val)}
        />
        <TextInputComponent
          placeholder="your NIC or Passport number"
          label='National Identification Number'
          // value={formData.address}
          // onChangeText={(val) => onChange('address', val)}
        />

        {/* Date of Birth Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <TextInputComponent
              placeholder="date of birth"
              label="Birth date"
              value={selectedDate}
              // onChangeText={(val) => onChange('name', val)}
            />
          </View>
          <TouchableOpacity
            onPress={showDatePicker}
            style={{
              marginLeft: 8,
              alignItems: 'center',
              justifyContent: 'center',
              height: 48, 
              width: 48,
            }}
          >
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
        <Button 
          title="Create Account"
          varient="primary"
          passstyles={{ marginTop: 20 }}
          // onPress={passwordsMatch ? onNext : undefined}
          // disabled={!passwordsMatch}
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


