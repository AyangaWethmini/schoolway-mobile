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
  const [frontImageUri, setFrontImageUri] = useState(null);
  const [backImageUri, setBackImageUri] = useState(null);

  const handleConfirm = (date) => {
    setSelectedDate(date.toDateString());
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
      } else {
        setBackImageUri(result.assets[0].uri);
      }
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
          // value={formData.address}
          // onChangeText={(val) => onChange('address', val)}
        />
        {/* Date of Birth Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <TextInputComponent
              placeholder="select expiry date"
              label="License Expiry Date"
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
          <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <TextHeader style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
              Upload License Images
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
    aspectRatio: 1.6, // Makes the image rectangular for license card aspect ratio
    marginTop: 10, 
    backgroundColor:'#DDD', 
    borderRadius: 10,
    resizeMode: 'contain', // Ensures the whole image is visible
    alignSelf: 'center',
  },
});


