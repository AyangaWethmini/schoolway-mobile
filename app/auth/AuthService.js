import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.56.1:3000'; 

class AuthService {
  // Sign in function
  async signIn(email, password) {
    try {
        
console.log('Response from before fetch signIn:', email, password);
      const response = await fetch(`${API_BASE_URL}/api/signup`, {
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
console.log('Response from signIn:', response);
      const data = await response.json();

      if (response.ok && data.ok) {
        // Store session data
        console.log('Sign in successful:', data);
        // await AsyncStorage.setItem('user_session', JSON.stringify(data));
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  // Test Next.js API endpoint with CORS headers
  async signInWithCredentials(email, password) {
    try {
        console.log('Testing Next.js API endpoint with CORS:', email, password);
        
        // Add timeout and better error handling
        // const controller = new AbortController();
        // const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_BASE_URL}/api/mobiletest`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'email': "lehanss@ss.com"
          },
        //   signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Response data from Next.js API:', data);
          
          // Store session info if successful
          await AsyncStorage.setItem('user_session', JSON.stringify(data));
          return { success: true, data };
        } else {
          console.error('Response not ok:', response.status, response.statusText);
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          return { success: false, error: errorData.error || 'Authentication failed' };
        }
    } catch (error) {
      console.error('Network error in signInWithCredentials:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout - server not responding' };
      }
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

  // Test connectivity to the server
  async testConnection() {
    try {
      console.log('Testing connection to:', `${API_BASE_URL}/api/mobiletest`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/api/mobiletest`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Connection test result:', response.status, response.ok);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Connection test data:', data);
        return { success: true, status: response.status, data };
      } else {
        return { success: false, status: response.status, error: 'Connection failed' };
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const session = await this.getStoredSession();
    return !!session;
  }
}

export default new AuthService();