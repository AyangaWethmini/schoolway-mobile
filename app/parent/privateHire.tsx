import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Button } from "../components/button";
import { useTheme } from "../theme/ThemeContext";

const PrivateHire = () => {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('request');
  const [showVanSelection, setShowVanSelection] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Date picker states
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());

  // Form state
  const [formData, setFormData] = useState({
    destination: '',
    pickupLocation: '',
    departureDate: '',
    returnDate: '',
    passengers: '',
    additionalNotes: ''
  });

  // Mock data for available vans
  const [availableVans] = useState([
    {
      id: 1,
      name: 'Premium Van A',
      capacity: 12,
      type: 'Luxury',
      pricePerDay: 15000,
      driver: 'Kamal Perera',
      contact: '+94 77 123 4567',
      features: ['AC', 'WiFi', 'Comfortable Seats', 'Entertainment System'],
      rating: 4.8,
      image: '🚐'
    },
    {
      id: 2,
      name: 'Family Van B',
      capacity: 8,
      type: 'Standard',
      pricePerDay: 10000,
      driver: 'Sunil Silva',
      contact: '+94 71 987 6543',
      features: ['AC', 'Child Seats Available', 'Spacious'],
      rating: 4.5,
      image: '🚙'
    },
    {
      id: 3,
      name: 'Budget Van C',
      capacity: 15,
      type: 'Economy',
      pricePerDay: 8000,
      driver: 'Nimal Fernando',
      contact: '+94 76 555 0123',
      features: ['AC', 'Basic Comfort'],
      rating: 4.2,
      image: '🚌'
    }
  ]);

  // Mock data for hire history
  const [hireHistory] = useState([
    {
      id: 1,
      destination: 'Kandy',
      departureDate: '2024-12-15',
      returnDate: '2024-12-17',
      status: 'Completed',
      vanName: 'Premium Van A',
      totalCost: 45000,
      passengers: 6
    },
    {
      id: 2,
      destination: 'Galle',
      departureDate: '2024-11-20',
      returnDate: '2024-11-22',
      status: 'Completed',
      vanName: 'Family Van B',
      totalCost: 30000,
      passengers: 4
    },
    {
      id: 3,
      destination: 'Nuwara Eliya',
      departureDate: '2025-01-10',
      returnDate: '2025-01-12',
      status: 'Upcoming',
      vanName: 'Premium Van A',
      totalCost: 45000,
      passengers: 8
    },
    {
      id: 4,
      destination: 'Sigiriya',
      departureDate: '2024-10-05',
      returnDate: '2024-10-07',
      status: 'Cancelled',
      vanName: 'Budget Van C',
      totalCost: 24000,
      passengers: 5
    }
  ]);

  // Date formatting function
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle departure date change
  const onDepartureDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || departureDate;
    setShowDeparturePicker(Platform.OS === 'ios');
    setDepartureDate(currentDate);
    setFormData({...formData, departureDate: formatDate(currentDate)});
  };

  // Handle return date change
  const onReturnDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || returnDate;
    setShowReturnPicker(Platform.OS === 'ios');
    setReturnDate(currentDate);
    setFormData({...formData, returnDate: formatDate(currentDate)});
  };

  const handleSearch = () => {
    if (!formData.destination || !formData.pickupLocation || !formData.departureDate || !formData.passengers) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    setShowVanSelection(true);
  };

  const handleVanRequest = (van) => {
    setSelectedVan(van);
    setShowConfirmModal(true);
  };

  const confirmRequest = () => {
    Alert.alert(
      'Request Sent!',
      `Your request for ${selectedVan.name} has been sent to the driver. They will contact you soon.`,
      [{ text: 'OK', onPress: () => {
        setShowConfirmModal(false);
        setShowVanSelection(false);
        setFormData({
          destination: '',
          pickupLocation: '',
          departureDate: '',
          returnDate: '',
          passengers: '',
          additionalNotes: ''
        });
      }}]
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return theme.colors.statusgreen || '#4CAF50';
      case 'upcoming':
        return theme.colors.statusblue || '#2196F3';
      case 'cancelled':
        return theme.colors.statusgrey || '#757575';
      default:
        return '#757575';
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return theme.colors.statusbackgroundgreen || '#E8F5E8';
      case 'upcoming':
        return theme.colors.statusbackgroundblue || '#E3F2FD';
      case 'cancelled':
        return theme.colors.statusbackgroundgrey || '#F5F5F5';
      default:
        return '#F5F5F5';
    }
  };

  const renderRequestTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {!showVanSelection ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Plan Your Trip</Text>
          <Text style={styles.formSubtitle}>Fill in the details to find available vans</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Destination *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Where are you going?"
              value={formData.destination}
              onChangeText={(text) => setFormData({...formData, destination: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pickup Location *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Where should we pick you up?"
              value={formData.pickupLocation}
              onChangeText={(text) => setFormData({...formData, pickupLocation: text})}
            />
          </View>

          <View style={styles.dateRow}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
              <Text style={styles.inputLabel}>Departure Date *</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDeparturePicker(true)}
              >
                <Text style={[styles.dateInputText, !formData.departureDate && styles.placeholderText]}>
                  {formData.departureDate || 'Departure date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
              <Text style={styles.inputLabel}>Return Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowReturnPicker(true)}
              >
                <Text style={[styles.dateInputText, !formData.returnDate && styles.placeholderText]}>
                  {formData.returnDate || 'Return date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Passengers *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="How many people?"
              keyboardType="numeric"
              value={formData.passengers}
              onChangeText={(text) => setFormData({...formData, passengers: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Notes</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Any special requirements or notes..."
              multiline
              numberOfLines={3}
              value={formData.additionalNotes}
              onChangeText={(text) => setFormData({...formData, additionalNotes: text})}
            />
          </View>

          <Button
            title="Search Available Vans"
            varient="outlined-black"
            onPress={handleSearch}
            passstyles={styles.searchButton}
          />

          {/* Date Pickers */}
          {showDeparturePicker && (
            <DateTimePicker
              testID="departureDatePicker"
              value={departureDate}
              mode="date"
              is24Hour={true}
              display="default"
              minimumDate={new Date()}
              onChange={onDepartureDateChange}
            />
          )}

          {showReturnPicker && (
            <DateTimePicker
              testID="returnDatePicker"
              value={returnDate}
              mode="date"
              is24Hour={true}
              display="default"
              minimumDate={departureDate}
              onChange={onReturnDateChange}
            />
          )}
        </View>
      ) : (
        <View style={styles.vanSelectionContainer}>
          <View style={[styles.header , { backgroundColor : theme.colors.primary } ]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowVanSelection(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.resultsTitle}>Available Vans</Text>
            <Text style={styles.resultsSubtitle}>
              {formData.destination} • {formData.departureDate} • {formData.passengers} passengers
            </Text>
          </View>

          {availableVans.map((van) => (
            <View key={van.id} style={styles.vanCard}>
              <View style={styles.vanCardHeader}>
                <View style={styles.vanImageContainer}>
                  <Text style={styles.vanImage}>{van.image}</Text>
                </View>
                <View style={styles.vanInfo}>
                  <Text style={styles.vanName}>{van.name}</Text>
                  <Text style={styles.vanType}>{van.type} • Up to {van.capacity} passengers</Text>
                  <Text style={styles.vanDriver}>Driver: {van.driver}</Text>
                </View>
                <View style={styles.vanPricing}>
                  <Text style={styles.vanPrice}>Rs. {van.pricePerDay.toLocaleString()}</Text>
                  <Text style={styles.vanPriceUnit}>per day</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {van.rating}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.vanFeatures}>
                {van.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.vanActions}>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>📞 Contact</Text>
                </TouchableOpacity>
                <Button
                  title="Request This Van"
                  varient="primary"
                  onPress={() => handleVanRequest(van)}
                  passstyles={styles.requestButton}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
  

  const renderHistoryTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Your Private Hire History</Text>
        <Text style={styles.historySubtitle}>Track all your vacation van bookings</Text>

        {hireHistory.map((hire) => (
          <View key={hire.id} style={styles.historyCard}>
            <View style={styles.historyCardHeader}>
              <View style={styles.historyMainInfo}>
                <Text style={styles.historyDestination}>{hire.destination}</Text>
                <Text style={styles.historyDates}>
                  {hire.departureDate} - {hire.returnDate}
                </Text>
                <Text style={styles.historyDetails}>
                  {hire.vanName} • {hire.passengers} passengers
                </Text>
              </View>
              <View style={styles.historyStatus}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBackgroundColor(hire.status) }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(hire.status) }
                  ]}>
                    {hire.status}
                  </Text>
                </View>
                <Text style={styles.historyCost}>Rs. {hire.totalCost.toLocaleString()}</Text>
              </View>
            </View>

            {hire.status === 'Upcoming' && (
              <View style={styles.historyActions}>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
        <View style={[styles.header , { backgroundColor : theme.colors.primary } ]}>
          <TouchableOpacity onPress={() => { router.back()}} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Private Hire</Text>
        </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'request' && styles.activeTab]}
          onPress={() => setActiveTab('request')}
        >
          <Text style={[styles.tabText, activeTab === 'request' && styles.activeTabText]}>
            Request Van
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            My Bookings
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'request' ? renderRequestTab() : renderHistoryTab()}

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Request</Text>
            {selectedVan && (
              <>
                <Text style={styles.modalText}>
                  You're about to request <Text style={styles.modalBold}>{selectedVan.name}</Text> for your trip to <Text style={styles.modalBold}>{formData.destination}</Text>.
                </Text>
                <Text style={styles.modalDetails}>
                  • Departure: {formData.departureDate}
                  {formData.returnDate && `\n• Return: ${formData.returnDate}`}
                  {`\n• Passengers: ${formData.passengers}`}
                  {`\n• Driver: ${selectedVan.driver}`}
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowConfirmModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={confirmRequest}
                  >
                    <Text style={styles.modalConfirmText}>Send Request</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PrivateHire;

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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSpacer: {
    width: 60,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#eee',
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateRow: {
    flexDirection: 'row',
  },
  dateInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  searchButton: {
    marginTop: 20,
  },
  vanSelectionContainer: {
    padding: 16,
  },
  searchResultsHeader: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: '500',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  vanCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vanCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  vanImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vanImage: {
    fontSize: 24,
  },
  vanInfo: {
    flex: 1,
  },
  vanName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  vanType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  vanDriver: {
    fontSize: 14,
    color: '#333',
  },
  vanPricing: {
    alignItems: 'flex-end',
  },
  vanPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
  },
  vanPriceUnit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 12,
    color: '#333',
  },
  vanFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  featureTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#008080',
    fontWeight: '500',
  },
  vanActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  contactButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  requestButton: {
    flex: 0,
    paddingHorizontal: 24,
  },
  historyContainer: {
    padding: 16,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  historySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyMainInfo: {
    flex: 1,
  },
  historyDestination: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  historyDates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  historyDetails: {
    fontSize: 14,
    color: '#333',
  },
  historyStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  historyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modifyButton: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  modifyButtonText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f8d7da',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  cancelButtonText: {
    color: '#721c24',
    fontSize: 14,
    fontWeight: '500',
  },
  rebookButton: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  rebookButtonText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '500',
  },
  reviewButton: {
    backgroundColor: '#d1ecf1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  reviewButtonText: {
    color: '#0c5460',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalBold: {
    fontWeight: '600',
    color: '#008080',
  },
  modalDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalCancelText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#008080',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalConfirmText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
});