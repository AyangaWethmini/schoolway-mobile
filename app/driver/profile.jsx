import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from "../theme/ThemeContext";
import VehicleInfo from './DriverComponents/DriverProfileComponents/DriverVanInfo';
import DriverProfileOverview from './DriverComponents/DriverProfileComponents/ProfileInfo';
import LicenseAndVehicleCheckups from './DriverComponents/DriverProfileComponents/VehicleCheckUps';
const API_URL = Constants.expoConfig?.extra?.apiUrl;

const LogoutButton = () => {
  const { logout, user } = useAuth();
  return (
    <>
    <View style={{ height: 1, backgroundColor: '#e0e0e0', flex: 1, margin: 8, marginTop: 20 }} />
    <View style={{  justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 8, backgroundColor: `${useTheme().theme.colors.primary}`, width: '30%' , alignSelf: 'center', padding: 12, borderRadius: 8 }} >
         <Ionicons name="log-out-outline" size = {24} onPress={logout} style={{fontWeight: '600', color: 'white' }} />
         <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>Logout</Text>
      </View>
    </>
  )
};


export default function Profile() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAF8F8',
    }
  });

  return (
    <ScrollView style={styles.container}>
      <DriverProfileOverview />
      <VehicleInfo />
      <LicenseAndVehicleCheckups />
      <LogoutButton />
    </ScrollView>
  )
}
