import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { ThemeProvider } from './theme/ThemeContext';
import { SplashScreenSchoolway } from './components/SplashScreen';
import { Stack } from 'expo-router';


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
    <ThemeProvider>
      {isReady ? (
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      ) : (
        <SplashScreenSchoolway />
      )}
    </ThemeProvider>
  );
}