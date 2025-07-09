import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "./components/button";
import {
  CodeInput,
  DropdownInput,
  MultilineTextInput,
  PasswordInput,
  TextInputComponent
} from "./components/Inputs";
import Spacer from "./components/Spacer";

export default function Index() {
  const [selectedAge, setSelectedAge] = useState<string | number>('');
  const [selectedSchool, setSelectedSchool] = useState<string | number>('');
  const [code, setCode] = useState('');

  const ageOptions = Array.from({ length: 13 }, (_, i) => ({
    label: `${i + 6} years`,
    value: i + 6,
  }));

  const schoolOptions = [
    { label: 'Good Shephard Convent - Colombo 13', value: 'good-shephard' },
    { label: 'Royal College - Colombo 7', value: 'royal-college' },
    { label: 'Ladies College - Colombo 7', value: 'ladies-college' },
    { label: 'Trinity College - Kandy', value: 'trinity-college' },
  ];

  console.log('Selected values:', { selectedAge, selectedSchool, code }); 

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Components</Text>
        
        <Link href="/signup" style={{ marginBottom: 20 }}>Signup</Link>
        <Link href="/usersession" style={{ marginBottom: 20 }}>userData</Link>
        <Link href="/otp" style={{ marginBottom: 20 }}>otp</Link>
        
        <Link href="/login/login" style={{ marginBottom: 20 }}>Login form</Link>
        <Link href='/profile' style={{ marginBottom: 20 }}>Driver Profile</Link>
              


        <Spacer/>
        <Link href='/steps/step2'>Step 2</Link>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Components</Text>
          
          <TextInputComponent
            label="Name"
            placeholder="Enter your name"
          />
          
          <TextInputComponent
            label="Email Address"
            placeholder="name@email.com"
            keyboardType="email-address"
          />
          
          <TextInputComponent
            label="NIC"
            placeholder="200212345678"
            keyboardType="numeric"
          />
          
          <TextInputComponent
            label="Phone"
            placeholder="Add number"
            keyboardType="phone-pad"
          />
          
          <PasswordInput
            label="Password"
            placeholder="Create a password"
          />
          
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
          />
          
          <DropdownInput
            label="Age"
            placeholder="Select age"
            options={ageOptions}
            selectedValue={selectedAge}
            onSelect={setSelectedAge}
          />
          
          <DropdownInput
            label="School"
            placeholder="Select school"
            options={schoolOptions}
            selectedValue={selectedSchool}
            onSelect={setSelectedSchool}
          />
          
          <CodeInput
            label="Enter confirmation code"
            onCodeChange={setCode}
          />
          
          <MultilineTextInput
            label="Special Notes"
            placeholder="Mention special needs, illnesses, allergies and any other things"
            numberOfLines={4}
          />
        </View>

        {/* Button Components Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button Components</Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Primary Button" 
              varient="primary"
              onPress={() => console.log('Primary pressed')}
            />
            
            <Button 
              title="Secondary Button" 
              varient="secondary"
              onPress={() => console.log('Secondary pressed')}
            />
            
            <Button 
              title="Outlined Yellow" 
              varient="outlined-yellow"
              onPress={() => console.log('Outlined Yellow pressed')}
            />
            
            <Button 
              title="Outlined Black" 
              varient="outlined-black"
              onPress={() => console.log('Outlined Black pressed')}
            />
            
            <Button 
              title="Disabled Button" 
              varient="primary"
              disabled={true}
              onPress={() => console.log('This should not fire')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF8F8',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2B3674',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
});
