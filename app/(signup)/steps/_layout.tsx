import { Stack } from 'expo-router';
import React from 'react';

export default function StepsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step1" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
      <Stack.Screen name="driver_step3" />
      <Stack.Screen name="driver_step4" />
    </Stack>
  );
}
