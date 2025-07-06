import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.62:3000'; 

class AuthService {
  // Sign in function
  async signIn(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          redirect: false,
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        // Store session data
        await AsyncStorage.setItem('user_session', JSON.stringify(data));
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Network error' };
    }
  }

  // Alternative approach using NextAuth's signin endpoint
  async signInWithCredentials(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/[...nextauth]/route.ts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        //   callbackUrl: `${API_BASE_URL}/dashboard`, // or wherever you want to redirect
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store session info
        await AsyncStorage.setItem('user_session', JSON.stringify(data));
        return { success: true, data };
      } else {
        
        console.log('Error during sign-in is :', error);
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (error) {
        console.log('Error during sign-in:', error);
      return { success: false, error: error.message || 'Network error' };
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
      await fetch(`${API_BASE_URL}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear local storage
      await AsyncStorage.removeItem('user_session');
      return { success: true };
    } catch (error) {
      // Still clear local storage even if network request fails
      await AsyncStorage.removeItem('user_session');
      return { success: false, error: 'Network error' };
    }
  }

  // Get stored session from local storage
  async getStoredSession() {
    try {
      const session = await AsyncStorage.getItem('user_session');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const session = await this.getStoredSession();
    return !!session;
  }
}

export default new AuthService();