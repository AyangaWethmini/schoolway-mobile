import { Stack } from 'expo-router';
import React from 'react';

export default function SignupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="otp" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="steps/step1" />
      <Stack.Screen name="steps/step2" />
      <Stack.Screen name="steps/step3" />
      <Stack.Screen name="steps/driver_step3" />
      <Stack.Screen name="steps/driver_step4" />
    </Stack>
  );
}
