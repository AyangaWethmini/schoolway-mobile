import * as Font from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './auth/AuthContext';
import KeyboardAvoidingView from './components/KeyboardAvoidingView.jsx';
import SafeAreaView from './components/SafeAreaView.jsx';
import { SplashScreenSchoolway } from './components/SplashScreen';
import { ThemeProvider } from './theme/ThemeContext';
import { FormProvider } from './utils/FormContext';

SplashScreen.preventAutoHideAsync(); // Prevent native splash screen from auto-hiding
SystemUI.setBackgroundColorAsync('black');

// Separate component that uses the auth context
function AppNavigator() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts or other resources here
        await Font.loadAsync({
          // Example: Add custom fonts if needed
          // 'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
          // 'UberMove-medium': require('../../assets/fonts/UberMoveMedium.otf'),
          // 'UberMove-bold': require('../../assets/fonts/UberMoveBold.otf')
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

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (isReady && !isLoading && isAuthenticated && user?.role) {
      const userRole = user.role;
      
      switch (userRole) {
        case 'DRIVER':
          router.replace({pathname :'driver' as any});
          break;
        case 'PARENT':
          router.replace('parent/home' as any);
          break;
        default:
          // For unknown roles, redirect to login
          router.replace('login/login' as any);
          break;
      }
    } else if (isReady && !isLoading && !isAuthenticated) {
      // Redirect unauthenticated users to login
      router.replace('login/login' as any);
    }
  }, [isReady, isLoading, isAuthenticated, user?.role]);

  // Show splash screen while loading auth or app resources
  if (!isReady || isLoading) {
    return <SplashScreenSchoolway />;
  }

  return (
    <FormProvider>
      {isReady ? (
          <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ href: null }}/>
          <Stack.Screen name="(signup)/steps" />
          <Stack.Screen name="login/login" />
          <Stack.Screen name="driver" />
          </Stack>
      ) : (
        <SplashScreenSchoolway />
      )}
    </FormProvider>
  );
}

// Main layout component that provides the auth context
export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={'default'} />
        <ThemeProvider>
          <SafeAreaView backgroundColor="#FAF8F8" style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
            <KeyboardAvoidingView 
              style={{ flex: 1 }} 
              backgroundColor="#FAF8F8"
              scrollEnabled={true}
              dismissKeyboardOnTap={true}
            >
              <AppNavigator />
            </KeyboardAvoidingView>
          </SafeAreaView>
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}