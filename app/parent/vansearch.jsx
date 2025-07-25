import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button } from "../components/button";
import { DropdownInput } from '../components/inputs';
import Spacer from '../components/Spacer';
import SWText from '../components/SWText';
import { useTheme } from "../theme/ThemeContext";


const SchoolVanScreen = ({ navigation }) => {

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const router = useRouter();

  const { theme } = useTheme();

  const schoolVans = [
    {
      id: 1,
      name: 'Nimsara School Service',
      time: 'Weekdays 7:00 AM',
      route: 'Galle to Mathara',
      drivers: [
        { id: 1, initial: 'J' },
        { id: 2, initial: 'M' },
      ],
      rating: 4.8,
    },
    {
      id: 2,
      name: 'SafeRide School Service',
      time: 'Weekdays 6:30 AM',
      route: 'Hendala to Colombo 13',
      drivers: [
        { id: 3, initial: 'S' },
        { id: 4, initial: 'R' },
      ],
      rating: 4.9,
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleRequest = (vanId) => {
    console.log(`Requesting van with ID: ${vanId}`);
  };

  const renderDriverImages = (drivers) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
    
    return (
      <View style={styles.driversContainer}>
        {drivers.map((driver, index) => (
          <View
            key={driver.id}
            style={[
              styles.driverAvatar,
              { 
                marginLeft: index > 0 ? -8 : 0,
                backgroundColor: colors[driver.id % colors.length]
              },
            ]}
          >
            <SWText style={styles.driverInitial}>{driver.initial}</SWText>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={[styles.header, { backgroundColor : theme.colors.primary } ]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <SWText style={styles.headerTitle}>School Van Booking</SWText>
        </View>

        <View style={styles.locationSection}>
          <View style={styles.locationRow}>
            <View style={styles.locationItem}>
              <SWText style={styles.locationLabel}>Pickup</SWText>
              <DropdownInput
                placeholder="Pickup location"
                options={[
                  { label: 'Borella', value: 'borella' },
                  { label: 'Wellawatte', value: 'wellawatte' },
                  { label: 'Rajagiriya', value: 'rajagiriya' },
                  { label: 'Kiribathgoda', value: 'kiribathgoda' },
                  { label: 'Kollupitiya', value: 'kollupitiya' },
                ]}
                selectedValue={pickupLocation}
                onSelect={(value) => setPickupLocation(value)}
              />
              
            </View>
            <View style={styles.locationItem}>
              <SWText style={styles.locationLabel}>Drop-off</SWText>
              <DropdownInput
                placeholder="Drop-Off location"
                options={[
                  { label: 'Royal College', value: 'Royal college' },
                  { label: 'Ananda College', value: 'Ananda College' },
                  { label: 'Nalanda College', value: 'Nalanda College' },
                  { label: 'Visakha College', value: 'Visakha College' },
                  { label: 'Musaeus College', value: 'musaeus College' },
                ]}
                selectedValue={dropoffLocation}
                onSelect={(value) => setDropoffLocation(value)}
              />
            </View>
          </View>

          <Button
              title="Find School Vans"
              varient="outlined-black"
          />
        </View>

        <View style={styles.pickedSection}>
          <SWText h2> Picked For You </SWText>
          <Spacer/>
          {schoolVans.map((van) => (
            <View key={van.id} style={styles.vanCard}>
              <View style={styles.vanHeader}>
                <SWText style={styles.vanName}>{van.name}</SWText>
                {renderDriverImages(van.drivers)}
              </View>
              
              <View style={styles.vanDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <SWText style={styles.detailText}>{van.time}</SWText>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <SWText style={styles.detailText}>{van.route}</SWText>
                </View>
              </View>

              <Button
                title="Request"
                varient="secondary"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight:'bold',
    color: '#000',
  },
  locationSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationItem: {
    flex: 0.48,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  findButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickedSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  vanCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  vanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  vanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  driversContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverInitial: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  vanDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  requestButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SchoolVanScreen;