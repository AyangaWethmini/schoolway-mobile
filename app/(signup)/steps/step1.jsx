import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/button';
import ErrorText from '../../components/ErrorText';
import { PasswordInput, TextInputComponent } from '../../components/inputs';
import KeyboardAwareScrollView from '../../components/KeyboardAwareScrollView';
import Spacer from '../../components/Spacer';
import TextHeader from '../../components/TextHeader';
import TextLink from '../../components/TextLink';
import { FormContext } from '../../utils/FormContext';

const PersonalInfoStep = ({}) => {
  const {formData , updateFormData} = useContext(FormContext);
  const [proceed, setProceed] = useState(false);
  const [Error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);
  const isPasswordStrong = formData.password && formData.password.length >= 6;
  const doPasswordsMatch = formData.password === formData.confirmPassword;

  if (isEmailValid && isPasswordStrong && doPasswordsMatch) {
    setProceed(true);
    setError(null);
  } else {
    setProceed(false);
    if(formData.email && formData.password && formData.confirmPassword) {
      if (!isEmailValid) {
        setError('Please enter a valid email address.');
      } else if (!isPasswordStrong) {
        setError('Password must be at least 6 characters long.');
      } else if (!doPasswordsMatch) {
        setError('Passwords do not match.');
        console.log('Passwords do not match:', formData.password, formData.confirmPassword);
      } else {
        setError(null);
      }
    }
  }
}, [formData.email, formData.password, formData.confirmPassword]);

  const onNext = () => {
    console.log('Form Data:', formData);
    router.push('./steps/step2');
  };
  
  return (
    <KeyboardAwareScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.form}>
        <TextHeader passstyle={{ marginBottom: 0 }}>
          Sign Up
        </TextHeader>
        <Text style={{ marginBottom: 20, color:'#666' }}>Create an account to get started</Text>
        {
          Error &&
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <ErrorText Error={Error}></ErrorText>
        </View>}
        
        <Spacer/>
        
        {/* <TextInputComponent
          placeholder="First Name"
          label="Full Name"
          value={formData.name}
          onChangeText={(val) => onChange('name', val)}
        />
        <TextInputComponent
          placeholder="Last Name"
          value={formData.lastname}
          onChangeText={(val) => onChange('lastname', val)}
        /> */}
        <TextInputComponent
          placeholder="Email"
          label="Email Address"
          value={formData.email}
          onChangeText={(val) => updateFormData('email', val)}
        />
        <PasswordInput
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChangeText={(val) => updateFormData('password', val)}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChangeText={(val) => updateFormData('confirmPassword',val)}
        />
        {/* // add an input to get the birth date as a date picker */}
        <Text style={{ paddingLeft:0, marginBottom: 30, color: '#666', fontSize: 12 }}>
          By signing up, you agree to our <TextLink href="/terms">Terms of Service</TextLink> and <TextLink href="/privacy">Privacy Policy</TextLink>.
        </Text>
        <Button 
          title="Continue"
          varient="primary"
          onPress={proceed ? onNext : undefined}
          disabled={!proceed}
        />
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
          <Text style={{ paddingLeft:0, marginBottom: 30, color: '#666', fontSize: 12 }}>
            Already have an account? 
            {/* <Text 
              style={{ color: '#007AFF' }} 
              onPress={() => router.push('../../login/login')}
            > Log in</Text> */}
            <TextLink 
              href="/login/login"
              passstyle={{ fontSize:14}} 
            > Log in</TextLink>
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PersonalInfoStep;

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
  }
});


