import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button } from "../../components/button";
import { DropdownInput } from '../../components/inputs';
import Spacer from '../../components/Spacer';
import SWText from '../../components/SWText';
import { useTheme } from "../../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const SchoolVanScreen = ({ navigation }) => {

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [vanRequest, setVanRequest] = useState(null);

  const router = useRouter();

  const { id } = useLocalSearchParams();

  const { theme } = useTheme();

  const [schoolVans, setSchoolVans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const childId = id;
        const reqRes = await fetch(`${API_URL}/vans/child/van-request/childRequest/${childId}`);
        const reqData = await reqRes.json();
        setVanRequest(reqData && Object.keys(reqData).length ? reqData : null);
        
        // 2. Fetch available vans
        const vansRes = await fetch(`${API_URL}/vans/child/van-search/${childId}`);
        const vansData = await vansRes.json();
        setSchoolVans(vansData || {});

        console.log("Fetched vans:", vansData);
        console.log("Fetched request:", vanRequest);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <ActivityIndicator size="large" color="#000" />
  //       <SWText h2>Loading vans...</SWText>
  //     </SafeAreaView>
  //   );
  // }

  const handleBack = () => {
    router.back();
  };

  const handleRequest = async (vanId,estimatedFare) => {
    try {

      const childId = id ;

      console.log("Creating request for vanId:", vanId, "and childId:", childId);

      const res = await fetch(`${API_URL}/vans/child/van-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          { vanId, childId , estimatedFare}
        ),
      });

      if (!res.ok) throw new Error("Failed to create request");

      const data = await res.json();
      console.log("Van request created:", data);
      setVanRequest(data);
      alert("Request sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  const handleDelete = async () => {
    try {
      const childId = id;

      const res = await fetch(`${API_URL}/vans/child/van-request/childRequest/${childId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete request");

      setVanRequest(null); // reset UI
      alert("Request deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting request");
    }
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
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <SWText uberBold style={styles.headerTitle}>School Van Booking</SWText>
        </View>

        {/* If van request exists */}
        {vanRequest ? (
          <View style={styles.vanCard}>
            <SWText h2>Current Request</SWText>
            <SWText style={styles.vanName}>
              {vanRequest.van.makeAndModel} ({vanRequest.van.licensePlateNumber})
            </SWText>
            <SWText>Status: {vanRequest.status}</SWText>
            
            <Spacer/>

            <Button
              title="Delete Request"
              varient="outlined-secondary"
              onPress={handleDelete}
            />
          </View>
        ) : (
          <>
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
                  varient="outlined-secondary"
              />
            </View>

            <View style={styles.pickedSection}>
              <SWText h2> Picked For You </SWText>
              <Spacer/>
              {schoolVans.map((van) => (
                <View key={van.id} style={styles.vanCard}>
                  {/* Header Section with Image and Basic Info */}
                  <View style={styles.cardHeader}>
                    {van.photoUrl && (
                      <Image
                        source={{ uri: van.photoUrl }}
                        style={styles.vanImage}
                        resizeMode="cover"
                      />
                    )}
                    
                    <View style={styles.headerInfo}>
                      <SWText style={styles.vanName}>
                        {van.makeAndModel}
                      </SWText>
                      <SWText style={styles.licensePlate}>
                        {van.licensePlateNumber}
                      </SWText>
                      
                      {/* Owner Info */}
                      <View style={styles.ownerRow}>
                        <Ionicons name="person-circle-outline" size={16} color="#666" />
                        <SWText style={styles.ownerText}>
                          {van.UserProfile?.firstname} {van.UserProfile?.lastname}
                        </SWText>
                      </View>
                    </View>
                  </View>

                  {/* Key Features - Compact Grid */}
                  <View style={styles.featuresGrid}>
                    <View style={styles.featureItem}>
                      <Ionicons name="people" size={18} color="#4CAF50" />
                      <SWText style={styles.featureText}>{van.seatingCapacity} seats</SWText>
                    </View>
                    
                    <View style={styles.featureItem}>
                      <Ionicons 
                        name={van.acCondition ? "snow" : "close-circle"} 
                        size={18} 
                        color={van.acCondition ? "#2196F3" : "#999"} 
                      />
                      <SWText style={styles.featureText}>
                        {van.acCondition ? "AC" : "Non-AC"}
                      </SWText>
                    </View>
                    
                    <View style={styles.featureItem}>
                      <Ionicons 
                        name="car-sport" 
                        size={18} 
                        color={van.hasDriver ? "#4CAF50" : "#999"} 
                      />
                      <SWText style={styles.featureText}>
                        {van.hasDriver ? "Driver" : "No Driver"}
                      </SWText>
                    </View>
                    
                    <View style={styles.featureItem}>
                      <Ionicons 
                        name="person-add" 
                        size={18} 
                        color={van.hasAssistant ? "#4CAF50" : "#999"} 
                      />
                      <SWText style={styles.featureText}>
                        {van.hasAssistant ? "Assistant" : "No Asst."}
                      </SWText>
                    </View>
                  </View>

                  {/* Route & Pricing Row */}
                  <View style={styles.routePriceRow}>
                    <View style={styles.routeInfo}>
                      <Ionicons name="navigate-circle" size={16} color="#FF9800" />
                      <SWText style={styles.routeText}>
                        {van.Path 
                          ? `${van.Path.totalDistance.toFixed(1)} km • ${van.Path.estimatedDuration} min`
                          : 'Route not assigned'}
                      </SWText>
                    </View>
                    
                    <View style={styles.priceTag}>
                      <SWText style={styles.priceLabel}>Fare</SWText>
                      <SWText style={styles.priceAmount}>
                        Rs. {van.estimatedFare.toFixed(2)}
                      </SWText>
                    </View>
                  </View>

                  {/* Ratings Row */}
                  <View style={styles.ratingsRow}>
                    <View style={styles.ratingItem}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <SWText style={styles.ratingText}>
                        Private: Rs. {van.privateRating}/km
                      </SWText>
                    </View>
                    <View style={styles.ratingDivider} />
                    <View style={styles.ratingItem}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <SWText style={styles.ratingText}>
                        Student: Rs. {van.studentRating}/km
                      </SWText>
                    </View>
                  </View>

                  {/* Action Button */}
                  <Button
                    title="Request This Van"
                    varient="secondary"
                    onPress={() => handleRequest(van.id, van.estimatedFare) }
                  />
                </View>
              ))}
            </View>
          </>
          )}
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
    color: 'white',
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
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  vanImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vanName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  licensePlate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ownerText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
  },
  routePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  priceTag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    borderRadius: 6,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  ratingDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },

});

export default SchoolVanScreen;