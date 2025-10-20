import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="vansearch/[id]" />
      <Stack.Screen name="van-details/[vanId]" />
    </Stack>
  );
}