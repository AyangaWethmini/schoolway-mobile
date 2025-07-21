import { Stack } from 'expo-router';

export default function DriverComponentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for all DriverComponents screens
      }}
    >
      <Stack.Screen 
        name="EditProfile" 
        options={{
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="travelPage" 
        options={{
          headerShown: false,
        }} 
      />
    </Stack>
  );
}