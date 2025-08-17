import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import CurvedHeader from '../components/CurvedHeader';
import SWText from '../components/SWText';
import { useTheme } from "../theme/ThemeContext";
import VehicleInfo from './DriverComponents/DriverProfileComponents/DriverVanInfo';
import DriverProfileOverview from './DriverComponents/DriverProfileComponents/ProfileInfo';
import LicenseAndVehicleCheckups from './DriverComponents/DriverProfileComponents/VehicleCheckUps';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const LogoutButton = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  
  return (
    <>
      <View style={{ height: 1, backgroundColor: '#e0e0e0', flex: 1, margin: 8, marginTop: 20 }} />
      <TouchableOpacity 
        onPress={logout}
        style={{  
          justifyContent: 'center', 
          alignItems: 'center', 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 8, 
          backgroundColor: theme.colors.primary, 
          width: '30%', 
          alignSelf: 'center', 
          padding: 12, 
          borderRadius: 8 
        }}
      >
        <Ionicons name="log-out-outline" size={24} style={{fontWeight: '600', color: 'white' }} />
        <SWText style={{ color: 'white' }} uberBold md>Logout</SWText>
      </TouchableOpacity>
    </>
  );
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const { theme } = useTheme();
   
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAF8F8',
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: '#fff',
    },
    tab: {
      flex: 1,
      paddingTop: 15,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: '#eee',
    },
    tabText: {
      // fontSize: 14,
      color: '#888',
    },
    activeTabText: {
      // fontWeight: 'bold',
      color: '#000',
    },
    tabIndicator: {
      height: 5,
      width: '100%',
      backgroundColor: '#000',
      marginTop: 12,
    },
    inactiveTabIndicator: {
      height: 5,
      width: '100%',
      backgroundColor: '#eee',
      marginTop: 12,
    },
    content: {
      flex: 1,
    },
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal Info':
        return <DriverProfileOverview />;
      case 'Van Info':
        return <VehicleInfo />;
      case 'Checkups':
        return <LicenseAndVehicleCheckups />;
      default:
        return <DriverProfileOverview />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CurvedHeader 
          title="Payments" 
          theme={theme}
        />

      <View style={styles.tabs}>
        {['Personal Info', 'Van Info', 'Checkups'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <SWText
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
              sm = {activeTab === tab}
              xs  ={!(activeTab === tab)}
              uberBold={activeTab === tab}
            >
              {tab}
            </SWText>
            <View 
              style={[
                activeTab !== tab && styles.inactiveTabIndicator, 
                activeTab === tab && styles.tabIndicator
              ]} 
            />
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {renderTabContent()}
        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
}
