import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "./components/button";
import {
  CodeInput,
  DropdownInput,
  MultilineTextInput,
  PasswordInput,
  TextInputComponent
} from "./components/inputs";
import Spacer from "./components/Spacer";
import SWText from "./components/SWText";

export default function Index() {
  const router = useRouter();
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
        <TouchableOpacity 
          style={{ marginBottom: 20 }}
          onPress={() => router.push('/driver' as any)}
        >
          <Text style={{ color: '#2e78b7' }}>Driver Dashboard</Text>
        </TouchableOpacity>
              


        <Spacer/>
        
        <Link href ='/steps/step3' >Parent Step 3</Link>
        
        <TouchableOpacity 
          style={{ marginBottom: 20 }}
          onPress={() => router.push('/steps/driver_step4' as any)}
        >
          <Text>Driver Step 3</Text>
        </TouchableOpacity>
        <Link href='/steps/step2'>Step 2</Link>

        <TouchableOpacity 
          style={{ margin: 20  }}
          onPress={() => router.push('/parent/home/dashboard' as any)}
        >
          <Text style={{ color: '#008080' }}>Parent Dashboard</Text>
        </TouchableOpacity>

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
          </View>{/* Button Components Section */}
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
        

        
        {/* Text Component Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Components</Text>
          
          <View style={styles.typographyContainer}>
            {/* Headings */}
            <SWText h1>H1 Heading Component</SWText>
            <SWText h2>H2 Heading Component</SWText>
            <SWText h3>H3 Heading Component</SWText>
            
            <Spacer />
            
            {/* Body Text Variations */}
            <SWText md>Regular body text</SWText>
            <SWText md bold>Bold body text</SWText>
            <SWText md semibold>Semibold body text</SWText>
            
            <Spacer />
            
            {/* Text Sizes */}
            <SWText sm>Small text (sm)</SWText>
            <SWText md>Medium text (md - default)</SWText>
            <SWText lg>Large text (lg)</SWText>
            <SWText xs>Extra small text (xs)</SWText>
            <SWText xl>Extra large text (xl)</SWText>
            
            <Spacer />
            
            {/* Special Roles */}
            <SWText button>Button text</SWText>
            <SWText label>Form label text</SWText>
            <SWText caption>Caption text</SWText>
            
            <Spacer />
            
            {/* Colors */}
            <SWText h2 primary>Primary Color Text</SWText>
            <SWText md blue>Blue Text</SWText>
            <SWText md grayd>Dark Gray Text</SWText>
            <SWText md grayl>Light Gray Text</SWText>
            <SWText md white style={{backgroundColor: '#333', padding: 8}}>
              White text on dark background
            </SWText>
            
            <Spacer />
            
            {/* Font Families */}
            <SWText md regular>Regular Font</SWText>
            <SWText md uberMedium>Uber Medium Font</SWText>
            <SWText md uberBold>Uber Bold Font</SWText>
            
            <Spacer />
            
            {/* Text Alignment */}
            <SWText md left>Left Aligned Text (default)</SWText>
            <SWText md center>Center Aligned Text</SWText>
            <SWText md right>Right Aligned Text</SWText>
            
            <Spacer />
            
            {/* Text Styling */}
            <SWText md italic>Italic Text</SWText>
            <SWText md underline>Underlined Text</SWText>
            <SWText md italic underline>Italic and Underlined</SWText>
            
            <Spacer />
            
            {/* Combined Examples */}
            <SWText lg uberBold center primary>
              Large, Uber Bold, Centered Primary Text
            </SWText>
            
            <SWText 
              md 
              white 
              center 
              bold
              style={{
                backgroundColor: '#333', 
                padding: 10, 
                borderRadius: 5,
                marginTop: 8
              }}
            >
              Custom Styled Text with Additional Props
            </SWText>
          </View>
        </View>
        <View>
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

