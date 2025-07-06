import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/button';
import { PasswordInput, TextInputComponent } from '../../components/inputs';
import KeyboardAwareScrollView from '../../components/KeyboardAwareScrollView';
import Spacer from '../../components/Spacer';
import TextHeader from '../../components/TextHeader';
import TextLink from '../../components/TextLink';

const PersonalInfoStep = ({ formData, onChange, onNext }) => {
  // Check if passwords match
  const passwordsMatch = formData.password && formData.confirmPassword && 
                        formData.password === formData.confirmPassword;
  
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
        <Spacer/>
        <TextInputComponent
          placeholder="First Name"
          label="Full Name"
          value={formData.name}
          onChangeText={(val) => onChange('name', val)}
        />
        <TextInputComponent
          placeholder="Last Name"
          value={formData.lastname}
          onChangeText={(val) => onChange('lastname', val)}
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
          onPress={passwordsMatch ? onNext : undefined}
          disabled={!passwordsMatch}
        />
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ paddingLeft:0, marginBottom: 30, color: '#666', fontSize: 12 }}>
            Already have an account? <TextLink href="/privacy">Login</TextLink>.
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


