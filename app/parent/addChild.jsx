import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from "../components/button";
import { useTheme } from "../theme/ThemeContext";


const AddChild = ({ navigation, onBack }) => {

    const { theme } = useTheme();


    const [childName, setChildName] = useState('Lehan');
    const [age, setAge] = useState('');
    const [school, setSchool] = useState('Good Shepherd Convent - Colombo 13');
    const [pickupTime, setPickupTime] = useState('Morning');
    const [dropoffTime, setDropoffTime] = useState('12:30');
    const [specialNotes, setSpecialNotes] = useState('');
    const [showPickupDropdown, setShowPickupDropdown] = useState(false);
    const [showAgeDropdown, setShowAgeDropdown] = useState(false);

    const pickupOptions = ['Morning', 'Afternoon', 'Evening'];
    const ageOptions = Array.from({ length: 15 }, (_, i) => (i + 3).toString()); // Ages 3-17

    const handleBack = () => {
      if (navigation && navigation.goBack) {
        navigation.goBack();
      } else if (onBack) {
        onBack();
      } else {
        console.log('No navigation method provided');
      }
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

    const renderDropdown = (value, options, onSelect, showDropdown, setShowDropdown) => {
      return (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
              {value || 'Select...'}
            </Text>
            <Ionicons 
              name={showDropdown ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          
          {showDropdown && (
            <View style={styles.dropdownOptions}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => {
                    onSelect(option);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      );
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
              <TextInput
                style={styles.textInput}
                value={childName}
                onChangeText={setChildName}
                placeholder="Enter child's name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              {renderDropdown(
                age,
                ageOptions,
                setAge,
                showAgeDropdown,
                setShowAgeDropdown
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>School</Text>
              <TextInput
                style={styles.textInput}
                value={school}
                onChangeText={setSchool}
                placeholder="Enter school name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup time</Text>
              <View style={styles.timeRow}>
                <View style={styles.timeInputContainer}>
                  {renderDropdown(
                    pickupTime,
                    pickupOptions,
                    setPickupTime,
                    showPickupDropdown,
                    setShowPickupDropdown
                  )}
                </View>
                <View style={styles.timeInputContainer}>
                  <TextInput
                    style={styles.timeInput}
                    value={dropoffTime}
                    onChangeText={setDropoffTime}
                    placeholder="Time"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Special Notes</Text>
              <TextInput
                style={styles.textArea}
                value={specialNotes}
                onChangeText={setSpecialNotes}
                placeholder="Mention special needs, illnesses, allergies and any other things"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Add profile photo</Text>
              <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
                <Text style={styles.photoButtonText}>Add Photo</Text>
                <View style={styles.photoIcon}>
                  <Ionicons name="camera" size={16} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addChildButton} onPress={handleAddAnotherChild}>
              <View style={styles.addChildIcon}>
                <Ionicons name="add" size={20} color="#000" />
              </View>
              <Text style={styles.addChildText}>Add another child</Text>
            </TouchableOpacity>
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
      fontWeight: '600',
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
    textInput: {
      borderWidth: 1,
      borderColor: '#FFA500',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    dropdownContainer: {
      position: 'relative',
    },
    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      backgroundColor: '#fff',
    },
    dropdownText: {
      fontSize: 16,
      color: '#000',
    },
    placeholderText: {
      color: '#999',
    },
    dropdownOptions: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      marginTop: 4,
      maxHeight: 200,
      zIndex: 1000,
    },
    dropdownOption: {
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    dropdownOptionText: {
      fontSize: 16,
      color: '#000',
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    timeInputContainer: {
      flex: 1,
    },
    timeInput: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    textArea: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: '#fff',
      minHeight: 100,
    },
    photoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      backgroundColor: '#fff',
    },
    photoButtonText: {
      fontSize: 16,
      color: '#999',
    },
    photoIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addChildButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      marginTop: 10,
    },
    addChildIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    addChildText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
    },
    bottomContainer: {
      padding: 20,
      backgroundColor: '#fff',
    },
    finishButton: {
      backgroundColor: '#FFA500',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    finishButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
});

export default AddChild;