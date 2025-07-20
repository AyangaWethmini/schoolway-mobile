import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from "../theme/ThemeContext";

const EditProfile = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [form, setForm] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+94 77 123 4567',
    address: '123 Main St, Colombo',
    driverLicenseNumber: 'DL12345678',
    experience: '2'
  });

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', form);
    // Here you would typically save the data to your backend
    // After successful save, navigate back to profile
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroud,
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    headerTitle: {
      fontSize: theme.fontSizes.large,
      fontWeight: 'bold',
      color: theme.colors.textblack,
      marginLeft: theme.spacing.md,
    },
    formSection: {
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.sm,
    },
    inputContainer: {
      marginBottom: theme.spacing.sm,
    },
    label: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.textgreylight,
      borderRadius: theme.borderRadius.small,
      padding: theme.spacing.sm,
      fontSize: theme.fontSizes.medium,
      color: theme.colors.textblack,
    },
    profileImageContainer: {
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    imageUploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accentblue,
      borderRadius: theme.borderRadius.small,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    imageUploadText: {
      color: 'white',
      marginLeft: theme.spacing.xs,
      fontSize: theme.fontSizes.small,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.small,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    submitButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: theme.fontSizes.medium,
    },
    cancelButton: {
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      padding: theme.spacing.sm,
    },
    cancelButtonText: {
      color: theme.colors.textgreydark,
      fontSize: theme.fontSizes.small,
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textblack} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.profileImageContainer}>
          <Image 
            source={require('../../assets/images/dummy/driver.webp')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.imageUploadButton} onPress={() => console.log('Upload image')}>
            <FontAwesome name="camera" size={16} color="white" />
            <Text style={styles.imageUploadText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              placeholder="First Name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              placeholder="Last Name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Email Address"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Home Address"
              multiline
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Driver Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Driver License Number</Text>
            <TextInput
              style={styles.input}
              value={form.driverLicenseNumber}
              onChangeText={(text) => handleChange('driverLicenseNumber', text)}
              placeholder="Driver License Number"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              value={form.experience}
              onChangeText={(text) => handleChange('experience', text)}
              placeholder="Years of Experience"
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity><Text style={styles.footerText}>By saving changes, you agree to our Terms of Service and Privacy Policy.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
