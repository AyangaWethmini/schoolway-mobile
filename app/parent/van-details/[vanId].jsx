import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import SWText from '../../components/SWText';
import { useTheme } from "../../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const VanDetailsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [vanDetails, setVanDetails] = useState(null);
  const { vanId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchVanDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/vans/child/van-search/vanInfo/${vanId}`);
        const data = await response.json();
        setVanDetails(data);
      } catch (error) {
        console.error("Error fetching van details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVanDetails();
  }, [vanId]);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < Math.floor(rating) ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
      />
    ));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <SWText uberBold style={styles.headerTitle}>Van Details</SWText>
      </View>

      <ScrollView style={styles.content}>
        {vanDetails && (
          <>
            {/* Vehicle Photo */}
            {vanDetails.photoUrl && (
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: vanDetails.photoUrl }}
                  style={styles.vanPhoto}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Rating Summary */}
            <View style={styles.ratingSection}>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingStars}>
                  {renderRatingStars(vanDetails.averageReviewRating)}
                </View>
                <SWText style={styles.ratingText}>
                  {vanDetails.averageReviewRating} ({vanDetails.reviewCount} reviews)
                </SWText>
              </View>
            </View>

            {/* Vehicle Information */}
            <View style={styles.section}>
              <SWText style={styles.sectionTitle}>Vehicle Information</SWText>
              <View style={styles.infoCard}>
                <InfoRow icon="car" label="Make & Model" value={vanDetails.model} />
                <InfoRow icon="card" label="Registration" value={vanDetails.registrationNumber} />
                <InfoRow icon="people" label="Capacity" value={`${vanDetails.capacity} seats (${vanDetails.seatsAvailable} available)`} />
                <InfoRow icon="snow" label="AC" value={vanDetails.acCondition ? "Available" : "Not Available"} />
                <InfoRow icon="person-add" label="Assistant" value={vanDetails.hasAssistant ? "Available" : "Not Available"} />
                <InfoRow icon="star" label="Student Rate" value={`Rs. ${vanDetails.studentRating}/month`} />
              </View>
            </View>

            {/* Route Information */}
            {vanDetails.route && (
              <View style={styles.section}>
                <SWText style={styles.sectionTitle}>Route Information</SWText>
                <View style={styles.infoCard}>
                  <View style={styles.routeInfo}>
                    <View style={styles.routePoint}>
                      <Ionicons name="location" size={20} color={theme.colors.primary} />
                      <View style={styles.routeTextContainer}>
                        <SWText style={styles.routeLabel}>Start Point</SWText>
                        <SWText style={styles.routeValue}>{vanDetails.route.routeStart}</SWText>
                      </View>
                    </View>

                    {vanDetails.route.waypoints && vanDetails.route.waypoints.length > 0 && (
                      <View style={styles.waypoints}>
                        <SWText style={styles.waypointsLabel}>Areas Covered:</SWText>
                        {vanDetails.route.waypoints.map((point, index) => (
                          <View key={index} style={styles.waypointItem}>
                            <Ionicons name="radio-button-on" size={12} color="#666" />
                            <SWText style={styles.waypointText}>{point.name}</SWText>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.routePoint}>
                      <Ionicons name="location" size={20} color="#FF4444" />
                      <View style={styles.routeTextContainer}>
                        <SWText style={styles.routeLabel}>End Point</SWText>
                        <SWText style={styles.routeValue}>{vanDetails.route.routeEnd}</SWText>
                      </View>
                    </View>

                    <View style={styles.routeStats}>
                      <View style={styles.routeStat}>
                        <Ionicons name="map" size={16} color="#666" />
                        <SWText style={styles.routeStatText}>
                          {vanDetails.route.totalDistance.toFixed(1)} km
                        </SWText>
                      </View>
                      <View style={styles.routeStat}>
                        <Ionicons name="time" size={16} color="#666" />
                        <SWText style={styles.routeStatText}>
                          {vanDetails.route.estimatedDuration} min
                        </SWText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Owner Information */}
            <View style={styles.section}>
              <SWText style={styles.sectionTitle}>Owner Details</SWText>
              <View style={styles.infoCard}>
                <View style={styles.profileRow}>
                  {vanDetails.owner.profilePicture && (
                    <Image
                      source={{ uri: vanDetails.owner.profilePicture }}
                      style={styles.profilePic}
                    />
                  )}
                  <View style={styles.profileInfo}>
                    <InfoRow icon="person" label="Name" value={vanDetails.owner.name} />
                    <TouchableOpacity onPress={() => handleCall(vanDetails.owner.mobile)}>
                      <InfoRow icon="call" label="Phone" value={vanDetails.owner.mobile} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Driver Information */}
            {vanDetails.driver && (
              <View style={styles.section}>
                <SWText style={styles.sectionTitle}>Driver Details</SWText>
                <View style={styles.infoCard}>
                  <View style={styles.profileRow}>
                    {vanDetails.driver.profilePicture && (
                      <Image
                        source={{ uri: vanDetails.driver.profilePicture }}
                        style={styles.profilePic}
                      />
                    )}
                    <View style={styles.profileInfo}>
                      <InfoRow icon="person" label="Name" value={vanDetails.driver.name} />
                      <TouchableOpacity onPress={() => handleCall(vanDetails.driver.mobile)}>
                        <InfoRow icon="call" label="Phone" value={vanDetails.driver.mobile} />
                      </TouchableOpacity>
                      {/* <InfoRow icon="card" label="License" value={vanDetails.driver.licenseNumber} /> */}
                      <InfoRow icon="time" label="Experience" value={`${vanDetails.driver.yearsOfExperience} years`} />
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Assistant Information */}
            {vanDetails.assistant && (
              <View style={styles.section}>
                <SWText style={styles.sectionTitle}>Assistant Details</SWText>
                <View style={styles.infoCard}>
                  <View style={styles.profileRow}>
                    {vanDetails.assistant.profilePicture && (
                      <Image
                        source={{ uri: vanDetails.assistant.profilePicture }}
                        style={styles.profilePic}
                      />
                    )}
                    <View style={styles.profileInfo}>
                      <InfoRow icon="person" label="Name" value={vanDetails.assistant.name} />
                      <TouchableOpacity onPress={() => handleCall(vanDetails.assistant.contact)}>
                        <InfoRow icon="call" label="Phone" value={vanDetails.assistant.contact} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Reviews Section */}
            {vanDetails.recentReviews && vanDetails.recentReviews.length > 0 && (
              <View style={styles.section}>
                <SWText style={styles.sectionTitle}>Reviews</SWText>
                {vanDetails.recentReviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewerInfo}>
                        <View style={styles.ratingStars}>
                          {renderRatingStars(review.rating)}
                        </View>
                        <SWText style={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </SWText>
                      </View>
                    </View>
                    <SWText style={styles.reviewComment}>{review.comment}</SWText>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#666" style={styles.infoIcon} />
    <SWText style={styles.infoLabel}>{label}:</SWText>
    <SWText style={styles.infoValue}>{value}</SWText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    marginLeft: 15,
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    width: 100,
    color: '#666',
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  vanPhoto: {
    width: '100%',
    height: '100%',
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
  },
  profileRow: {
    flexDirection: 'row',
    padding: 10,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  routeInfo: {
    padding: 10,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  routeTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  routeValue: {
    fontSize: 14,
    color: '#333',
  },
  waypoints: {
    marginLeft: 30,
    marginVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 15,
  },
  waypointsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  waypointText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 8,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 15,
    paddingTop: 15,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
});

export default VanDetailsScreen;