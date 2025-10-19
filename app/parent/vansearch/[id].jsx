import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, // Add this import
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button } from "../../components/button";
import Spacer from '../../components/Spacer';
import SWText from '../../components/SWText';
import { useTheme } from "../../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const SchoolVanScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true); // Add this line
  const [vanRequest, setVanRequest] = useState(null);

  const router = useRouter();

  const { id } = useLocalSearchParams();

  const { theme } = useTheme();

  const [schoolVans, setSchoolVans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childId = id;
        
        // 1. Fetch van request
        const reqRes = await fetch(`${API_URL}/vans/child/van-request/childRequest/${childId}`);
        const reqData = await reqRes.json();
        
        // Only set vanRequest if we have valid data with a van object
        if (reqData && reqData.van) {
          setVanRequest(reqData);
        } else {
          setVanRequest(null);
          console.log("No active van request found");
        }
        
        // 2. Fetch available vans
        const vansRes = await fetch(`${API_URL}/vans/child/van-search/${childId}`);
        const vansData = await vansRes.json();
        setSchoolVans(Array.isArray(vansData) ? vansData : []);

        console.log("Fetched vans:", vansData);

      } catch (error) {
        console.error("Error fetching data:", error);
        setVanRequest(null);
        setSchoolVans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Add id to dependency array

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <SWText h2 style={{textAlign: 'center', marginTop: 20}}>Loading vans...</SWText>
      </SafeAreaView>
    );
  }

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
        {vanRequest && vanRequest.van ? (
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
            <View style={styles.pickedSection}>
              <View style={styles.titleContainer}>
                <SWText h2>Available School Vans</SWText>
              </View>
              <Spacer/>
              {schoolVans.length > 0 ? (
                schoolVans.map((van) => (
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
                          {van.registrationNumber}
                        </SWText>
                        
                        {/* Owner Info */}
                        <View style={styles.ownerRow}>
                          <Ionicons name="person-circle-outline" size={16} color="#666" />
                          <SWText style={styles.ownerText}>
                            {van.UserProfile_Van_ownerIdToUserProfile?.firstname} {van.UserProfile_Van_ownerIdToUserProfile?.lastname}
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
                          {van.hasDriver ? `Driver: ${van.UserProfile_Van_assignedDriverIdToUserProfile?.firstname}` : "No Driver"}
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
                        <SWText style={styles.priceLabel}>Estimated Fare</SWText>
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
                          Student: Rs. {van.studentRating}/month
                        </SWText>
                      </View>
                    </View>

                    {/* Action Button */}
                    {van.requestStatus === 'PENDING' ? (
                      <View>
                        <Button
                          title="Request Pending"
                          varient="outlined-secondary"
                          disabled={true}
                        />
                        <SWText style={styles.pendingText}>Your request is being reviewed</SWText>
                      </View>
                    ) : (
                      <Button
                        title="Request This Van"
                        varient="secondary"
                        onPress={() => handleRequest(van.id, van.estimatedFare)}
                      />
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.noVansContainer}>
                  <Ionicons name="bus-outline" size={80} color="#ccc" /> {/* Increased icon size */}
                  <SWText style={styles.noVansTitle}>No Vans Available</SWText>
                  <SWText style={styles.noVansText}>
                    Currently, there are no school vans operating in proximity to your child's school journey.
                  </SWText>
                </View>
              )}
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
  pickedSection: {
    paddingHorizontal: 20,
    flex: 1, // Add this to allow centering of child elements
  },
  titleContainer: {
    paddingVertical: 20, // Add padding around the title
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
  pendingText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  },
  noVansContainer: {
    flex: 1, // Add this
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20, // Add this for better spacing
    minHeight: 400, // Add this to ensure container has enough height
  },
  noVansTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  noVansText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  }

});

export default SchoolVanScreen;