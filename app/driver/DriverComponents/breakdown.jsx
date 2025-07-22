import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../theme/ThemeContext';

const BreakdownPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const [selectedVans, setSelectedVans] = useState([]);

  // Sample backup vans data
  const [availableVans, setAvailableVans] = useState([
    {
      id: '1',
      ownerName: 'Samantha Perera',
      vehicleModel: 'Toyota Hiace',
      vehicleNumber: 'ABC-1234',
      capacity: 15,
      distance: '2.3 km away',
      arrivalTime: '15 mins',
      rating: 4.8,
      pricePerStudent: 150,
      profileImage: 'https://i.pravatar.cc/150?img=10',
      route: 'Kaluthara - Colombo',
      phoneNumber: '+94 77 123 4567'
    },
    {
      id: '2',
      ownerName: 'Ruwan Silva',
      vehicleModel: 'Nissan Caravan',
      vehicleNumber: 'XYZ-5678',
      capacity: 12,
      distance: '3.1 km away',
      arrivalTime: '20 mins',
      rating: 4.6,
      pricePerStudent: 120,
      profileImage: 'https://i.pravatar.cc/150?img=11',
      route: 'Panadura - Colombo',
      phoneNumber: '+94 71 234 5678'
    },
    {
      id: '3',
      ownerName: 'Nimal Fernando',
      vehicleModel: 'Toyota KDH',
      vehicleNumber: 'DEF-9012',
      capacity: 18,
      distance: '1.8 km away',
      arrivalTime: '12 mins',
      rating: 4.9,
      pricePerStudent: 180,
      profileImage: 'https://i.pravatar.cc/150?img=12',
      route: 'Moratuwa - Colombo',
      phoneNumber: '+94 76 345 6789'
    }
  ]);

  const studentsNeedingTransport = [
    { id: '1', name: 'Sasmitha Silva', pickupLocation: 'Kaluthara Junction' },
    { id: '2', name: 'Duleepa Anjana', pickupLocation: 'Panadura Station' },
    { id: '3', name: 'Sahan Fernando', pickupLocation: 'Moratuwa Bus Stand' }
  ];

  const handleRequestVan = (vanId, vanOwner) => {
    Alert.alert(
      'Request Backup Van',
      `Send request to ${vanOwner} to help transport remaining students?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => {
            setSelectedVans(prev => [...prev, vanId]);
            Alert.alert(
              'Request Sent!',
              `Your request has been sent to ${vanOwner}. They will be notified and can accept or decline.`
            );
          }
        }
      ]
    );
  };

  const handleContactOwner = (phoneNumber, ownerName) => {
    Alert.alert(
      'Contact Van Owner',
      `Call ${ownerName} at ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            console.log(`Calling ${phoneNumber}`);
          }
        }
      ]
    );
  };

  const VanCard = ({ van }) => {
    const isRequested = selectedVans.includes(van.id);

    return (
      <View style={styles.vanCard}>
        <View style={styles.vanHeader}>
          <View style={styles.ownerInfo}>
            <Image 
              source={{ uri: van.profileImage }}
              style={styles.ownerImage}
            />
            <View style={styles.ownerDetails}>
              <Text style={styles.ownerName}>{van.ownerName}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.rating}>{van.rating}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleContactOwner(van.phoneNumber, van.ownerName)}
          >
            <Ionicons name="call" size={18} color="#2B3674" />
          </TouchableOpacity>
        </View>

        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleModel}>{van.vehicleModel}</Text>
          <Text style={styles.vehicleNumber}>{van.vehicleNumber}</Text>
          <Text style={styles.route}>{van.route}</Text>
        </View>

        <View style={styles.vanDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Free Capacity: {van.capacity} students</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{van.distance}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>ETA: {van.arrivalTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Rs. {van.pricePerStudent}/student</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.requestButton,
            isRequested && styles.requestedButton
          ]}
          onPress={() => handleRequestVan(van.id, van.ownerName)}
          disabled={isRequested}
        >
          <Ionicons 
            name={isRequested ? "checkmark-circle" : "send-outline"} 
            size={18} 
            color="white" 
          />
          <Text style={styles.requestButtonText}>
            {isRequested ? 'Request Sent' : 'Request Help'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2B3674" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Breakdown</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emergencyBanner}>
          <Ionicons name="warning" size={24} color="#dc3545" />
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency Situation</Text>
            <Text style={styles.emergencyDesc}>
              Your vehicle has broken down. Request nearby vans to transport remaining students.
            </Text>
          </View>
        </View>

        <View style={styles.studentsSection}>
          <Text style={styles.sectionTitle}>
            Students Needing Transport ({studentsNeedingTransport.length})
          </Text>
          {studentsNeedingTransport.map((student) => (
            // <View key={student.id} style={styles.studentItem}>
            <View key={student.id}>
              <Text style={[styles.studentName,{paddingTop:0, marginBottom:0}]}>{student.name}</Text>
              <Text style={[styles.studentLocation,{paddingBottom:10, paddingTop:0,  margin:0}]}>{student.pickupLocation}</Text>
            </View>
          ))}
        </View>

        <View style={styles.vansSection}>
          <Text style={styles.sectionTitle}>
            Available Backup Vans ({availableVans.length})
          </Text>
          {availableVans.map((van) => (
            <VanCard key={van.id} van={van} />
          ))}
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>Emergency Protocol:</Text>
          <Text style={styles.instructionText}>
            Calm Down, and take a Breath....{'\n\n'}
            1. Ensure all students are safe{'\n'}
            2. Contact parents about the situation if needed{'\n'}
            3. Request backup vans from nearby drivers{'\n'}
            4. Coordinate pickup locations{'\n'}
            5. Update trip status once resolved
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B3674',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emergencyBanner: {
    flexDirection: 'row',
    backgroundColor: '#fff5f5',
    borderColor: '#dc3545',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  emergencyText: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 4,
  },
  emergencyDesc: {
    fontSize: 14,
    color: '#dc3545',
    lineHeight: 20,
  },
  studentsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 15,
  },
  studentItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B3674',
    marginBottom: 2,
  },
  studentLocation: {
    fontSize: 14,
    color: '#666',
  },
  vansSection: {
    marginBottom: 25,
  },
  vanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ownerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B3674',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  callButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  vehicleInfo: {
    marginBottom: 12,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B3674',
    marginBottom: 2,
  },
  vehicleNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  route: {
    fontSize: 14,
    color: '#666',
  },
  vanDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  requestButton: {
    backgroundColor: '#2B3674',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  requestedButton: {
    backgroundColor: '#28a745',
  },
  requestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  instructionsSection: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 22,
  },
});

export default BreakdownPage;