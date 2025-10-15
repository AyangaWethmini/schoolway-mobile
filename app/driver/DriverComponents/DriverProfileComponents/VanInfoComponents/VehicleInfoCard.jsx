import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../../auth/AuthContext';
import SWText from '../../../../components/SWText';
import { useTheme } from '../../../../theme/ThemeContext';
import { vehicleService } from '../services/vehicleService';

const VehicleInfoCard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicleInfo();
  }, []);

  const loadVehicleInfo = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getDriverVehicleInfo(user.id);
      setVehicleData(data);
    } catch (error) {
      console.error('Error loading vehicle info:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    vehicleCard: {
      backgroundColor: '#ffffff',
      margin: 16,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    cardTitle: {
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: 4,
    },
    cardSubtitle: {
      color: '#7f8c8d',
      textAlign: 'center',
      marginBottom: 20,
    },
    vehicleContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    vehicleImageContainer: {
      width: 130,
      height: 90,
      borderRadius: 12,
      overflow: 'hidden',
      marginRight: 20,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    vehicleImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    vehicleDetails: {
      flex: 1,
      justifyContent: 'space-between',
    },
    vehicleName: {
      fontSize: 20,
      color: '#2c3e50',
      marginBottom: 8,
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    detailItem: {
      width: '48%',
      marginBottom: 12,
    },
    detailLabel: {
      color: theme.colors.textgreylight,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    detailValue: {
      color: theme.colors.textdark,
    },
    linkText: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    statusBadge: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    statusText: {
      color: '#ffffff',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 16,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      color: '#7f8c8d',
    },
  });

  if (loading) {
    return (
      <View style={styles.vehicleCard}>
        <SWText style={styles.cardTitle} uberBold lg>Loading Vehicle Information...</SWText>
      </View>
    );
  }

  if (!vehicleData) {
    return (
      <View style={styles.vehicleCard}>
        <SWText style={styles.cardTitle} uberBold lg>No Vehicle Assigned</SWText>
        <SWText style={styles.cardSubtitle} sm regular>Please contact administration</SWText>
      </View>
    );
  }

  return (
    <View style={styles.vehicleCard}>
      <SWText style={styles.cardTitle} uberBold lg>VEHICLE INFORMATION</SWText>
      <SWText style={styles.cardSubtitle} sm regular>Current Assigned Vehicle Details</SWText>
      
      <View style={styles.vehicleContainer}>
        <View style={styles.vehicleImageContainer}>
          <Image 
            source={vehicleData.image ? { uri: vehicleData.image } : require('../../../../../assets/images/dummy/van.jpeg')} 
            style={styles.vehicleImage}
          />
        </View>
        
        <View style={styles.vehicleDetails}>
          <SWText style={styles.vehicleName} xl uberBold>{vehicleData.model}</SWText>
          <SWText style={styles.detailValue} sm>License: {vehicleData.licensePlate}</SWText>
          <View style={styles.statusBadge}>
            <SWText style={styles.statusText} xs bold>{vehicleData.status?.toUpperCase()}</SWText>
          </View>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <SWText style={styles.detailLabel} xs>Vehicle Owner</SWText>
          <TouchableOpacity onPress={() => console.log('Navigate to owner profile')}>
            <SWText style={styles.linkText} sm>{vehicleData.ownerName}</SWText>
          </TouchableOpacity>
        </View>
        <View style={styles.detailItem}>
          <SWText style={styles.detailLabel} xs>Seating Capacity</SWText>
          <SWText style={styles.detailValue} sm>{vehicleData.capacity} Passengers</SWText>
        </View>
        <View style={styles.detailItem}>
          <SWText style={styles.detailLabel} xs>Manufacturing Year</SWText>
          <SWText style={styles.detailValue} sm>{vehicleData.year}</SWText>
        </View>
        <View style={styles.detailItem}>
          <SWText style={styles.detailLabel} xs>Fuel Type</SWText>
          <SWText style={styles.detailValue} sm>{vehicleData.fuelType}</SWText>
        </View>
        <View style={styles.detailItem}>
          <SWText style={styles.detailLabel} xs>Travel Path</SWText>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <SWText style={styles.detailValue} sm>{vehicleData.route?.startLocation}</SWText>
            <Ionicons name="swap-horizontal" size={18} color={theme.colors.primary} />
            <SWText style={styles.detailValue} sm>{vehicleData.route?.endLocation}</SWText>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <SWText style={styles.statValue}>{vehicleData.stats?.studentCount || 0}</SWText>
          <SWText style={styles.statLabel} xs>Students</SWText>
        </View>
        <View style={styles.statItem}>
          <SWText style={styles.statValue}>{vehicleData.stats?.schoolCount || 0}</SWText>
          <SWText style={styles.statLabel} xs>Schools</SWText>
        </View>
        <View style={styles.statItem}>
          <SWText style={styles.statValue}>{vehicleData.stats?.rating || 'N/A'}</SWText>
          <SWText style={styles.statLabel} xs>Rating</SWText>
        </View>
      </View>
    </View>
  );
};

export default VehicleInfoCard;