import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../auth/AuthContext';
import AuthService from '../../auth/AuthService';
import { useTheme } from '../../theme/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const VanRequestItem = ({ request, onAccept, onReject }) => {
  const { theme } = useTheme();

  
return (
  <View style={styles.requestItem}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Text style={styles.requestVehicle}>
        {request.Van.makeAndModel}
      </Text>
      <Text style={[styles.requestDate, { alignSelf: 'flex-start' }]}>
        {new Date(request.createdAt).toLocaleDateString()}
      </Text>
    </View>
    
    <Image
      source={{ uri: request.Van.photoUrl || 'https://via.placeholder.com/40' }}
      style={styles.requestImage}
    />

    <Text style={styles.requestRoute}>
      Route : {request.Van.routeStart} to {request.Van.routeEnd}
    </Text>
    
    <Text style={[styles.requestSalary, { marginBottom: 0 }]}>
      Monthly Salary: {request.proposedSalary?.toLocaleString()}%
    </Text>
    <Text style={[styles.requestRoute, { marginBottom: 15, fontSize:12 }]}>
      ( that's on average {request.Van.studentRating * request.Van.seatingCapacity/2 * 20} LKR )
    </Text>

    {/* Improved Contact Info */}
    <View style={{
      marginBottom: 20,
      paddingHorizontal: 10,
    }}>
      <View style={{
        backgroundColor: '#F7F7F7',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}>
        <Image
          source={{ uri: request.UserProfile_DriverVanJobRequest_vanOwnerIdToUserProfile.dp || `${API_URL}/../${request.UserProfile_DriverVanJobRequest_vanOwnerIdToUserProfile.dp}` }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#e0e0e0',
            marginRight: 10,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#2B3674', marginBottom: 2 }}>
            {request.UserProfile_DriverVanJobRequest_vanOwnerIdToUserProfile.firstname} {request.UserProfile_DriverVanJobRequest_vanOwnerIdToUserProfile.lastname}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const phone = request.UserProfile_DriverVanJobRequest_vanOwnerIdToUserProfile.mobile;
              if (phone) {
                import('react-native').then(({ Linking }) => {
                  Linking.openURL(`tel:${phone}`);
                });
              }
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#007AFF',
              paddingVertical: 7,
              paddingHorizontal: 12,
              borderRadius: 6,
              marginTop: 2,
              alignSelf: 'flex-start',
            }}
          >
            <Ionicons name="call" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              {request.UserProfile_DriverVanJobRequest_vanOwnerIdToUserProfile.mobile}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    <View style={styles.requestActions}>
      <TouchableOpacity 
        style={[styles.actionButton, styles.acceptButton]}
        onPress={onAccept}
      >
        <FontAwesome name="check" size={16} color="white" />
        <Text style={styles.actionButtonText}>Accept</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.rejectButton]}
        onPress={onReject}
      >
        <FontAwesome name="times" size={16} color="white" />
        <Text style={styles.actionButtonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

const NoVanDashboard = () => {
  const { user, setUser } = useAuth();
  const { theme } = useTheme();
  const [vanRequests, setVanRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetchVanRequests();
  }, []);

  const fetchVanRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/mobile/driver/van-offers/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setVanRequests(data.jobOffers || []);
      }
    } catch (error) {
      console.error('Error fetching van requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    console.log('Accepting request:', requestId);
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/mobile/driver/van-offers/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobRequestId: requestId,
          accepted: true, // Mark as accepted
          message : null
        }),
      });
      if (response.ok) {
        // Remove the accepted request from the list
        setVanRequests((prev) => prev.filter((req) => req.id !== requestId));
      } else {
        console.error('Failed to accept the request');
        console.log(await response);
      }
    } catch (error) {
      console.error('Error accepting van request:', error);
    } finally {
      // setUser(user.hasVan=1)
      const updatedUser = {
        ...user,
        hasVan: 1
      };
      
      await AuthService.updateUserInStorage(updatedUser);

      setUser(updatedUser);


      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/mobile/driver/van-offers/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobRequestId: requestId,
          accepted: false, // Mark as rejected
          message : null
        }),
      });
      if (response.ok) {
        // Remove the rejected request from the list
        setVanRequests((prev) => prev.filter((req) => req.id !== requestId));
      } else {
        console.error('Failed to reject the request');
        console.log(await response);
      }
    } catch (error) {
      console.error('Error rejecting van request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.firstname || 'Driver'}!</Text>
      
      <View style={[styles.card, styles.noVanCard]}>
        <FontAwesome name="exclamation-circle" size={24} color="#FFA500" />
        <Text style={styles.noVanTitle}>No Van Assigned</Text>
        <Text style={styles.noVanDesc}>
          You're not currently enrolled in any van. Check your van requests below.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Van Requests ({vanRequests.length})</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading requests...</Text>
        ) : vanRequests.length === 0 ? (
          <Text style={styles.noRequestsText}>No van requests available at the moment.</Text>
        ) : (
          vanRequests.map((request, index) => (
            <VanRequestItem 
              key={request.id || index}
              request={request}
              onAccept={() => handleAcceptRequest(request.id)}
              onReject={() => handleRejectRequest(request.id)}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 15,
  },
  noVanCard: {
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderColor: '#FFECB5',
    borderWidth: 1,
  },
  noVanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginTop: 10,
    marginBottom: 5,
  },
  noVanDesc: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noRequestsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  requestItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    // borderLeftWidth: 4,
    // borderLeftColor: '#2B3674',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestOwner: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B3674',
  },
  requestDate: {
    fontSize: 12,
    color: '#666',
  },
  requestVehicle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  requestRoute: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  requestSalary: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
    marginBottom: 12,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  requestImage: {
    width: 200,
    height: 120,
    // borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default NoVanDashboard;