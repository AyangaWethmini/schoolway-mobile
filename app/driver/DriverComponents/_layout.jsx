import { Stack } from 'expo-router';

export default function DriverComponentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header since EditProfile has its own
      }}
    >
      <Stack.Screen 
        name="EditProfile" 
        options={{
          title: 'Edit Profile',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}