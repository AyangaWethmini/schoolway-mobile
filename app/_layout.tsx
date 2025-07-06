import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import KeyboardAvoidingView from './components/KeyboardAvoidingView.jsx';
import SafeAreaView from './components/SafeAreaView.jsx';
import { SplashScreenSchoolway } from './components/SplashScreen';
import { ThemeProvider } from './theme/ThemeContext';


SplashScreen.preventAutoHideAsync(); // Prevent native splash screen from auto-hiding

export default function RootLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts or other resources here
        await Font.loadAsync({
          // Example: Add custom fonts if needed
          // 'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        });

        // Simulate other async tasks (e.g., API calls) for demo only !!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeAreaView backgroundColor="#FAF8F8" style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            backgroundColor="#FAF8F8"
            scrollEnabled={true}
            dismissKeyboardOnTap={true}
          >
            {isReady ? (
              <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="(signup)/signup" options={{headerShown: false}}/>
              </Stack>
            ) : (
              <SplashScreenSchoolway />
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}