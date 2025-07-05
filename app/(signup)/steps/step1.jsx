import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/button';
import { PasswordInput, TextInputComponent } from '../../components/inputs';
import SafeAreaView from '../../components/SafeAreaView';
import Spacer from '../../components/Spacer';
import TextHeader from '../../components/TextHeader';
import TextLink from '../../components/TextLink';

const PersonalInfoStep = ({ formData, onChange, onNext }) => {
  // Check if passwords match
  const passwordsMatch = formData.password && formData.confirmPassword && 
                        formData.password === formData.confirmPassword;
  
  return (

  <SafeAreaView style={styles.container}>
    <View style={styles.form}>
      <TextHeader passstyle={{ marginBottom: 0 }}>
        Sign Up
      </TextHeader>
      <Text style={{ marginBottom: 20, color:'#666' }}>Create an account to get started</Text>
      <Spacer/>
      <TextInputComponent
        placeholder="First Name"
        label="Full Name"
        value={formData.name}
        onChangeText={(val) => onChange('name', val)}
        // passstyle={[{ marginBottom: 10, width: '40%'}]}
      /><TextInputComponent
        placeholder="Last Name"
        value={formData.name}
        onChangeText={(val) => onChange('lastname', val)}
        // passstyle={[{ marginBottom: 10, width: '40%'}]}
      />
      <TextInputComponent
        placeholder="Email"
        label="Email Address"
        value={formData.email}
        onChangeText={(val) => onChange('email', val)}
      />
      <PasswordInput
        label="Password"
        placeholder="Create a password"
        value={formData.password}
        onChange={(val) => onChange('password', val)}
      />
      <PasswordInput
        // label="Confirm Password"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={(val) => onChange('confirmPassword', val)}
      />
      <Text style={{ paddingLeft:0, marginBottom: 30, color: '#666', fontSize: 12 }}>
        By signing up, you agree to our <TextLink href="/terms">Terms of Service</TextLink> and <TextLink href="/privacy">Privacy Policy</TextLink>.
      </Text>
      <Button 
        title="Continue"
        varient="primary"
        // disabled={passwordsMatch? false : true }
        onPress={passwordsMatch ? onNext : undefined}
        disabled={!passwordsMatch}
      />
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
        <Text style={{ paddingLeft:0, marginBottom: 30, color: '#666', fontSize: 12 }}>
          Already have an account? <TextLink href="/privacy">Login</TextLink>.
        </Text>
      </View>
      
      {/* <Button title="Contitnue" onPress={onNext} /> */}

    </View>
  </SafeAreaView>
  );
};

export default PersonalInfoStep;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form:{
    flex: 1,
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
  }
});


