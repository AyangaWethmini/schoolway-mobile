import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../../auth/AuthContext';
import SWText from '../../../../components/SWText';
import { useTheme } from '../../../../theme/ThemeContext';
import { vehicleService } from '../services/vehicleService';
const AssistantInfoSection = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showAssistantInfo, setShowAssistantInfo] = useState(false);
  const [assistantData, setAssistantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleToggle = async () => {
    setShowAssistantInfo(!showAssistantInfo);
    
    // Only load data when expanding for the first time
    if (!showAssistantInfo && !dataLoaded) {
      setLoading(true);
      try {
        const data = await vehicleService.getAssistantInfo(user.id);
        setAssistantData(data);
        setDataLoaded(true);
        console.log('Assistant data loaded:', data);
      } catch (error) {
        console.error('Error loading assistant info:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const styles = StyleSheet.create({
    sectionCard: {
      backgroundColor: '#ffffff',
      margin: 16,
      marginTop: 0,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ecf0f1',
    },
    sectionHeaderCollapsed: {
      borderBottomWidth: 0,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    sectionTitleText: {
      color: '#2c3e50',
      marginLeft: 8,
    },
    sectionContent: {
      padding: 20,
    },
    assistantDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    detailItem: {
      width: '48%',
      marginBottom: 12,
    },
    detailLabel: {
      color: '#7f8c8d',
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    detailValue: {
      color: '#2c3e50',
    },
  });

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity 
        style={[styles.sectionHeader, !showAssistantInfo && styles.sectionHeaderCollapsed]}
        onPress={handleToggle}
      >
        <View style={styles.sectionTitle}>
          <FontAwesome name="user-plus" size={18} color={theme.colors.primary} />
          <SWText style={styles.sectionTitleText} md uberBold>Assistant Information</SWText>
        </View>
        <FontAwesome 
          name={showAssistantInfo ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#7f8c8d" 
        />
      </TouchableOpacity>
      
      {showAssistantInfo && (
        <View style={styles.sectionContent}>
          {loading ? (
            <SWText style={styles.detailValue} sm>Loading assistant information...</SWText>
          ) : assistantData ? (
            <>
              {/* Profile row: avatar + basic info */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                {assistantData.photoUrl || assistantData.profilePic ? (
                  <Image
                    source={{ uri: assistantData.photoUrl || assistantData.profilePic }}
                    style={{ width: 64, height: 64, borderRadius: 32, marginRight: 12 }}
                  />
                ) : (
                  <View style={{ width: 64, height: 64, borderRadius: 32, marginRight: 12, backgroundColor: '#bdc3c7', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesome name="user" size={32} color="#fff" />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <SWText style={styles.detailLabel} xs>Full Name</SWText>
                  <SWText style={styles.detailValue} sm>{assistantData.fullName}</SWText>
                  {assistantData.title ? (
                    <SWText style={{ color: '#7f8c8d', marginTop: 4 }} sm>{assistantData.title}</SWText>
                  ) : null}
                </View>
              </View>

              <View style={styles.assistantDetails}>
                <View style={styles.detailItem}>
                  <SWText style={styles.detailLabel} xs>Contact Number</SWText>
                  <SWText style={styles.detailValue} sm>{assistantData.phone || '—'}</SWText>
                </View>
                {/* <View style={styles.detailItem}>
                  <SWText style={styles.detailLabel} xs>Name</SWText>
                  <SWText style={styles.detailValue} sm>{assistantData.fullName || '—'}</SWText>
                </View> */}
              </View>
            </>
          ) : (
            <SWText style={styles.detailValue} sm>No assistant assigned to this vehicle.</SWText>
          )}
        </View>
      )}
    </View>
  );
};

export default AssistantInfoSection;