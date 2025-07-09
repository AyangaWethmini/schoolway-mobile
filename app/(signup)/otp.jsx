import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from '../components/button';
import { CodeInput } from '../components/Inputs';
import { useRouter } from 'expo-router';



const OTPScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerification = async () => {
    // Add verification logic here
    console.log('Verification code:', code);
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Enter Verification Code</Text>

      <CodeInput
        onCodeChange={setCode}
      />
      
      <Button 
        title="Continue"
        varient="primary"
        onPress={handleVerification}
        disabled={false}
      />

      <Text style={styles.resendText}>
        Didn&#39;t recieve the code?{' '}
        <Text
          style={styles.resendlink}
          onPress={() => router.push('/signup')}
        >
          Resend OTP
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  resendlink: { 
    color: '#339CFF', 
    fontWeight: 'bold',
  },
  resendText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  }
});

export default OTPScreen;