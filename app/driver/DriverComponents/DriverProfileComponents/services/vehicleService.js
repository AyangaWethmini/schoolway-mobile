import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
};

// Helper function to handle fetch requests
const makeRequest = async (endpoint) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/mobile/driver/vanInfo/${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const vehicleService = {
  // Load basic vehicle info (always loaded - no lazy loading)
  async getDriverVehicleInfo(driverId) {
    return await makeRequest(`${driverId}?section=vaninfo`);
  },

  // Load assistant info (lazy loaded - only when user expands section)
  async getAssistantInfo(driverId) {
    return await makeRequest(`${driverId}?section=assistant`);
  },

  // Load students (lazy loaded - only when user expands section)
  async getAssignedStudents(driverId) {
    return await makeRequest(`${driverId}?section=students`);
  },

  // Load schools and route (lazy loaded - only when user expands section)
  async getRouteAndSchools(driverId) {
    return await makeRequest(`${driverId}?section=route`);
  }
};