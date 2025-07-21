import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AddButton from '../components/AddButton';
import { Button } from "../components/button";
import { DropdownInput, FileUpload, MultilineTextInput, TextInputComponent } from '../components/inputs';
import { useTheme } from "../theme/ThemeContext";


const AddChild = ({ navigation, onBack }) => {

    const { theme } = useTheme();
    const router = useRouter();  


    const [specialNotes, setSpecialNotes] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    

  const handleBack = () => {
    router.back(); 
  };

    const handleAddPhoto = () => {
      Alert.alert('Add Photo', 'Add photo alert');
    };

    const handleAddAnotherChild = () => {
      Alert.alert('Add Another Child', 'This would add another child form');
    };

    const handleFinish = () => {
      Alert.alert('Success', 'Child information added successfully!');
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.header , { backgroundColor : theme.colors.primary } ]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add child info</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Child's name</Text>
              <TextInputComponent
                placeholder="Enter Child's name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInputComponent
                placeholder="Enter Child's age"
              />
              
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>School</Text>
              <DropdownInput
                placeholder="Select School's name"
                options={[
                  { label: 'Ananda College', value: 'ananda' },
                  { label: 'Royal College', value: 'royal' },
                  { label: 'Visakha Vidyalaya', value: 'visakha' },
                  { label: 'Devi Balika Vidyalaya', value: 'devi' },
                  { label: 'Nalanda College', value: 'nalanda' },
                  { label: 'Dharmaraja College', value: 'dharmaraja' },
                  { label: 'Mahamaya Girls\' College', value: 'mahamaya' },
                ]}
                selectedValue={selectedSchool}
                onSelect={(value) => setSelectedSchool(value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup time</Text>
                <DropdownInput
                  placeholder="Select a time"
                  options={[
                    { label: '11:00 AM', value: '11:00' },
                    { label: '11:30 AM', value: '11:30' },
                    { label: '12:30 PM', value: '12:30' },
                    { label: '1:30 PM', value: '13:30' }, // 24-hour format if needed
                  ]}
                  selectedValue={pickupTime}
                  onSelect={(value) => setPickupTime(value)}
                />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Special Notes</Text>
              <MultilineTextInput
                placeholder="Mention special needs, illnesses, allergies and any other things"
                value={specialNotes}
                onChangeText={setSpecialNotes}
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Add profile photo</Text>
              <FileUpload
                placeholder="Upload Child's Photo"
                selectedFile={selectedFile}
                onFileSelect={(file) => setSelectedFile(file)}
                fileType="image"
              />
            </View>

            <AddButton 
              text={'Add Another Child'}
              onPress={() => router.push('/parent/addChild')}
            />

          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            title="Finish"
            varient="primary"
            onPress={() => console.log('Outlined Black pressed')}
          />
        </View>
      </SafeAreaView>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    scrollView: {
      flex: 1,
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
      fontWeight: 'bold',
      color: '#000',
    },
    formContainer: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
      marginBottom: 8,
    },
    bottomContainer: {
      padding: 20,
      backgroundColor: '#fff',
    }
});

export default AddChild;