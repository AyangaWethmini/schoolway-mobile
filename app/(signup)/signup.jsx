// SignUpScreen.tsx (Main container)

import { useState } from 'react';
import SafeAreaView from '../components/SafeAreaView';
import PersonalInfoStep from './steps/step1';
import VerificationStep from './steps/step2';
import SummaryStep from './steps/step3';

const SignUpScreen = () => {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password:'',
    confirmPassword: '',
    phone: '',
    nic: '',
    drivingLicense: '',
    // ... more fields if needed
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://your-api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        // navigate to home or success page
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      {step === 0 && <PersonalInfoStep formData={formData} onChange={handleChange} onNext={handleNext} />}
      {step === 1 && <VerificationStep formData={formData} onChange={handleChange} onNext={handleNext} onBack={handleBack} />}
      {step === 2 && <SummaryStep formData={formData} onSubmit={handleSubmit} onBack={handleBack} />}
    </SafeAreaView>
  );
};

export default SignUpScreen;
