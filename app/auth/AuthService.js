import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE_URL = 'http://192.168.23.116:3000'; // Replace with your actual backend URL to web server

class AuthService {
  // Sign in function - uses custom mobile endpoint
  async signIn(email, password) {
    try {
      console.log('Signing in with email:', email);
      const response = await fetch(`${API_BASE_URL}/api/mobileAuth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && (data.success || data.session)) {
        // Store session data
        await AsyncStorage.setItem('user_session', JSON.stringify(data.session));
        return { success: true, data: data.session };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Get stored session from local storage
  async getStoredSession() {
    try {
      const session = await AsyncStorage.getItem('user_session');
      console.log('Accessing Stored session:', session);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      return null;
    }
  }

  // Get current session
  async getSession() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
      });

      const session = await response.json();
      
      if (session && session.user) {
        await AsyncStorage.setItem('user_session', JSON.stringify(session));
        return session;
      }
      return null;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }

  // Sign out
  async signOut() {
    try {
      // mightbe needed for push notifications to clear any device tokens
      // await fetch(`${API_BASE_URL}/api/mobileAuth/signout`, {
      //   method: 'POST',
      //   credentials: 'include',
      // });
      
      // Clear local storage
      console.log('Signing out, clearing local storage');
      await AsyncStorage.removeItem('user_session');
      // return { success: true };
      router.replace('/login/login'); // Redirect to login page after sign out
    } catch (error) {
      // Still clear local storage even if network request fails
      await AsyncStorage.removeItem('user_session');
      return { success: false, error: 'Network error' };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const session = await this.getStoredSession();
    return !!session;
  }
}

export default new AuthService();