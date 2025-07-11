import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import KeyboardAvoidingView from './components/KeyboardAvoidingView.jsx';
import SafeAreaView from './components/SafeAreaView.jsx';
import { SplashScreenSchoolway } from './components/SplashScreen.tsx';
import { ThemeProvider } from './theme/ThemeContext.tsx';


SplashScreen.preventAutoHideAsync(); // Prevent native splash screen from auto-hiding

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts or other resources here
        await Font.loadAsync({
          'Inter': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
          // 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'UberMove-Bold': require('../assets/fonts/UberMoveBold.otf'),
          'UberMove-Medium': require('../assets/fonts/UberMoveMedium.otf'),
        });

        // Set default font for all Text components globally
        // // @ts-ignore - TypeScript doesn't recognize defaultProps but it works at runtime
        // if (Text.defaultProps == null) Text.defaultProps = {};
        // // @ts-ignore
        // Text.defaultProps.style = {
        //   fontFamily: 'UberMove-Medium',
        // };

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
      <StatusBar barStyle={'default'}/>
      <ThemeProvider>
        <SafeAreaView backgroundColor="#FAF8F8" style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            backgroundColor="#FAF8F8"
            scrollEnabled={true}
            dismissKeyboardOnTap={true}
          >
            {isReady ? (
                <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(signup)" />
                <Stack.Screen name="login/login" />
                <Stack.Screen name="driver" />
                <Stack.Screen name="(signup)/steps/[...catchAll]" />
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