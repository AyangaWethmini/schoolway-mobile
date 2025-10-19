import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="vansearch/[id]" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="van-details/[vanId]" 
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}