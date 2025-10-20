import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../auth/AuthContext';
import SWText from '../../../components/SWText';
import { useTheme } from '../../../theme/ThemeContext';

// Add API_URL constant at the top
const API_URL = Constants.expoConfig?.extra?.apiUrl;

const DocumentItem = ({ 
  name, 
  validUntil, 
  onUpload, 
  onRemind,
  uploadLabel = "Upload", 
  remindLabel = "Remind Owner" 
}) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    documentItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ecf0f1',
    },
    documentInfo: {
      flex: 1,
    },
    documentName: {
      color: '#2c3e50',
      marginBottom: 2,
    },
    documentDate: {
      color: '#7f8c8d',
    },
    documentActions: {
      flexDirection: 'row',
    },
    smallButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      marginLeft: 6,
    },
    smallButtonText: {
      color: 'white',
      marginLeft: 4,
    }
  });

  return (
    <View style={styles.documentItem}>
      <View style={styles.documentInfo}>
        <SWText style={styles.documentName} sm uberBold>{name}</SWText>
        <SWText style={styles.documentDate} xs>Valid until: {validUntil}</SWText>
      </View>
      <View style={styles.documentActions}>
        <TouchableOpacity 
          style={[styles.smallButton, { backgroundColor: theme.colors.primary }]}
          onPress={onUpload}
        >
          <FontAwesome name="upload" size={12} color="white" />
          <SWText style={styles.smallButtonText} xs uberBold>{uploadLabel}</SWText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.smallButton, { backgroundColor: '#3498db' }]}
          onPress={onRemind}
        >
          <FontAwesome name="bell" size={10} color="white" />
          <SWText style={styles.smallButtonText} xs uberBold>{remindLabel}</SWText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LicenseAndVehicleCheckups = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);
  const [showVehicleCheckups, setShowVehicleCheckups] = useState(false);
  const [licenseData, setLicenseData] = useState(null);
  const [isLicenseLoading, setIsLicenseLoading] = useState(true);
  
  // Mock data - in real app this would come from API or state
  const licenseExpiryDate = "2024-07-15"; // Format: YYYY-MM-DD
  const lastCheckupDate = "2024-07-09"; // Format: YYYY-MM-DD
  const nextCheckupDate = "2025-09-09"; // Format: YYYY-MM-DD (2 months from current date)
  
  // Calculate days until license expiry
  const today = new Date();
  const expiryDate = new Date(licenseExpiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  // Calculate days until next checkup
  const nextCheckupDateObj = new Date(nextCheckupDate);
  const daysUntilNextCheckup = Math.ceil((nextCheckupDateObj - today) / (1000 * 60 * 60 * 24));
  
  // Determine alert levels
  const getLicenseAlertLevel = () => {
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'urgent';
    if (daysUntilExpiry <= 60) return 'warning';
    return 'ok';
  };
  
  const getCheckupAlertLevel = () => {
    if (daysUntilNextCheckup < 0 && Math.abs(daysUntilNextCheckup) > 30) return 'critical';
    if (daysUntilNextCheckup < 0) return 'overdue';
    if (daysUntilNextCheckup <= 30) return 'upcoming';
    if (daysUntilNextCheckup > 30) return 'healthy';
    return 'ok';
  };
  
  const licenseAlertLevel = getLicenseAlertLevel();
  const checkupAlertLevel = getCheckupAlertLevel();
  
  // Get appropriate colors based on alert level
  const getLicenseAlertColor = () => {
    switch (licenseAlertLevel) {
      case 'expired': return '#e74c3c';
      case 'urgent': return '#FF6B00';
      case 'warning': return '#f39c12';
      default: return '#27ae60';
    }
  };
  
  const getCheckupAlertColor = () => {
    switch (checkupAlertLevel) {
      case 'critical': return '#8B0000';
      case 'overdue': return '#e74c3c';
      case 'upcoming': return '#FF6B00';
      case 'healthy': return '#27ae60';
      default: return '#27ae60';
    }
  };
  
  const licenseAlertColor = getLicenseAlertColor();
  const checkupAlertColor = getCheckupAlertColor();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Add helper functions
  const getLicenseStatusColor = (status) => {
    switch (status) {
      case 'expired': return '#e74c3c';
      case 'expiring_soon': return '#FF6B00';
      case 'warning': return '#f39c12';
      case 'valid': return '#27ae60';
      default: return '#7f8c8d';
    }
  };

  const getLicenseStatusText = (status) => {
    switch (status) {
      case 'expired': return 'License Expired';
      case 'expiring_soon': return 'Expiring Soon';
      case 'warning': return 'Renewal Recommended';
      case 'valid': return 'Valid';
      default: return 'Unknown Status';
    }
  };

  const handleViewImage = (imageUrl) => {
    // Implement image viewing functionality
    console.log('View image:', imageUrl);
  };

  const handleUploadLicense = () => {
    // Implement license upload functionality
    console.log('Upload new license');
  };

  // Add useEffect to fetch license data
  useEffect(() => {
    const fetchLicenseData = async () => {
      setIsLicenseLoading(true);
      try {
        const response = await fetch(`${API_URL}/mobile/driver/licenses/${user.id}`);
        const data = await response.json();
        setLicenseData(data.license);
      } catch (error) {
        console.error('Error fetching license data:', error);
      } finally {
        setIsLicenseLoading(false);
      }
    };

    if (showLicenseInfo) {
      fetchLicenseData();
    }
  }, [showLicenseInfo, user.id]);

  // Update the license section content
  const renderLicenseContent = () => {
    if (isLicenseLoading) {
      return <SWText style={styles.alertInfo} sm>Loading license information...</SWText>;
    }

    if (!licenseData) {
      return <SWText style={styles.alertInfo} sm>Failed to load license information.</SWText>;
    }

    return (
      <>
        <View style={styles.alertStatus}>
          <View style={[styles.statusDot, { backgroundColor: getLicenseStatusColor(licenseData.status) }]} />
          <SWText style={[styles.statusText, { color: getLicenseStatusColor(licenseData.status) }]} sm uberBold>
            {getLicenseStatusText(licenseData.status)}
          </SWText>
        </View>
        
        <SWText style={styles.dateInfo} sm>
          <SWText sm>License ID:</SWText> {licenseData.id}
        </SWText>

        <SWText style={styles.dateInfo} sm>
          <SWText sm>Expiry Date:</SWText> {formatDate(licenseData.expiryDate)}
        </SWText>

        <SWText style={styles.dateInfo} sm>
          <SWText sm>License Types:</SWText> {licenseData.type.join(", ")}
        </SWText>
        
        {licenseData.daysUntilExpiry > 0 ? (
          <SWText style={styles.alertInfo} sm>
            Your driving license will expire in {licenseData.daysUntilExpiry} days. 
            {licenseData.daysUntilExpiry <= 30 ? ' Please renew it as soon as possible.' : ' Plan for renewal ahead of time.'}
          </SWText>
        ) : (
          <SWText style={styles.alertInfo} sm>
            Your driving license has expired. You must renew it immediately before continuing to drive.
          </SWText>
        )}

        <View style={styles.imageRow}>
          <TouchableOpacity style={styles.licenseImage} onPress={() => handleViewImage(licenseData.images.front)}>
            <Image 
              source={{ uri: licenseData.images.front }}
              style={styles.licenseImagePreview}
            />
            <SWText style={styles.imageLabel} xs>Front</SWText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.licenseImage} onPress={() => handleViewImage(licenseData.images.back)}>
            <Image 
              source={{ uri: licenseData.images.back }}
              style={styles.licenseImagePreview}
            />
            <SWText style={styles.imageLabel} xs>Back</SWText>
          </TouchableOpacity>
        </View>
        
        {(licenseData.daysUntilExpiry <= 30 || licenseData.daysUntilExpiry < 0) && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleUploadLicense()}
          >
            <SWText style={styles.actionButtonText} sm uberBold>Upload New License Document</SWText>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
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
    alertStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    statusText: {
      fontWeight: '500',
    },
    dateInfo: {
      color: '#7f8c8d',
      marginBottom: 8,
    },
    alertInfo: {
      color: '#7f8c8d',
      marginBottom: 16,
      lineHeight: 20,
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    actionButtonText: {
      color: '#ffffff',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    buttonHalf: {
      flex: 1,
      marginHorizontal: 4,
    },
    documentList: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#ecf0f1',
    },
    documentListTitle: {
      color: '#2c3e50',
      marginBottom: 12,
    },
    warningCard: {
      backgroundColor: '#fff3cd',
      margin: 16,
      borderRadius: 8,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#ffc107',
      flexDirection: 'row',
      alignItems: 'center',
    },
    criticalCard: {
      backgroundColor: '#f8d7da',
      borderLeftColor: '#dc3545',
    },
    warningText: {
      color: '#856404',
      flex: 1,
      marginLeft: 8,
    },
    criticalText: {
      color: '#721c24',
    },
    imageRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      marginBottom: 16,
    },
    licenseImage: {
      width: '48%',
      aspectRatio: 1.6,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#f1f1f1',
    },
    licenseImagePreview: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageLabel: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    }
  });

  return (
    <ScrollView style={styles.container}>
      {/* Warning Cards for Critical States */}
      {/* {(licenseAlertLevel === 'expired' || checkupAlertLevel === 'critical') && (
        <View style={[styles.warningCard, licenseAlertLevel === 'expired' && styles.criticalCard]}>
          <FontAwesome 
            name="exclamation-triangle" 
            size={18} 
            color={licenseAlertLevel === 'expired' ? "#dc3545" : "#ffc107"} 
          />
          <SWText style={[styles.warningText, licenseAlertLevel === 'expired' && styles.criticalText]} sm uberBold>
            {licenseAlertLevel === 'expired' 
              ? "URGENT: Your driving license has expired! You must renew immediately."
              : "WARNING: Vehicle inspection is severely overdue. Please schedule immediately."
            }
          </SWText>
        </View>
      )} */}

      {/* License Status Section */}
      <View style={styles.sectionCard}>
        <TouchableOpacity 
          style={[styles.sectionHeader, !showLicenseInfo && styles.sectionHeaderCollapsed]}
          onPress={() => setShowLicenseInfo(!showLicenseInfo)}
        >
          <View style={styles.sectionTitle}>
            <FontAwesome name="id-card" size={18} color={theme.colors.primary} />
            <SWText style={styles.sectionTitleText} md uberBold>Driving License Status</SWText>
          </View>
          <FontAwesome 
            name={showLicenseInfo ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#7f8c8d" 
          />
        </TouchableOpacity>
        
        {showLicenseInfo && (
          <View style={styles.sectionContent}>
            {renderLicenseContent()}
          </View>
        )}
      </View>
      
      {/* Vehicle Checkups Section */}
      <View style={styles.sectionCard}>
        <TouchableOpacity 
          style={[styles.sectionHeader, !showVehicleCheckups && styles.sectionHeaderCollapsed]}
          onPress={() => setShowVehicleCheckups(!showVehicleCheckups)}
        >
          <View style={styles.sectionTitle}>
            <FontAwesome name="car" size={18} color={theme.colors.primary} />
            <SWText style={styles.sectionTitleText} md uberBold>Vehicle Condition Status</SWText>
          </View>
          <FontAwesome 
            name={showVehicleCheckups ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#7f8c8d" 
          />
        </TouchableOpacity>
        
        {showVehicleCheckups && (
          <View style={styles.sectionContent}>
            <View style={styles.alertStatus}>
              <View style={[styles.statusDot, { backgroundColor: checkupAlertColor }]} />
              <SWText style={[styles.statusText, { color: checkupAlertColor }]} sm uberBold>
                {checkupAlertLevel === 'critical' ? 'Critical: Severely Overdue' :
                 checkupAlertLevel === 'overdue' ? 'Checkup Overdue' :
                 checkupAlertLevel === 'upcoming' ? 'Checkup Soon' : 
                 checkupAlertLevel === 'healthy' ? 'Vehicle in Good Standing' : 'Status Good'}
              </SWText>
            </View>
            
            <SWText style={styles.dateInfo} sm>
              <SWText sm>Last Checkup:</SWText> {formatDate(lastCheckupDate)}
            </SWText>
            
            <SWText style={styles.dateInfo} sm>
              <SWText sm>Next Due:</SWText> {formatDate(nextCheckupDate)}
            </SWText>
            
            {daysUntilNextCheckup > 0 ? (
              <>
                <SWText style={styles.alertInfo} sm>
                  Next vehicle condition test is in {daysUntilNextCheckup} days. 
                  {daysUntilNextCheckup <= 30 
                    ? ' Please prepare for the test.' 
                    : ' Your vehicle is up to date with required inspections.'}
                </SWText>
                {daysUntilNextCheckup > 30 && (
                  <SWText style={[styles.alertInfo, { color: '#27ae60' }]} sm bold>
                    STATUS: Vehicle is in good condition and compliant with all requirements.
                  </SWText>
                )}
              </>
            ) : (
              <>
                <SWText style={styles.alertInfo} sm>
                  Your vehicle condition test is overdue by {Math.abs(daysUntilNextCheckup)} days. Please schedule it immediately.
                </SWText>
                {Math.abs(daysUntilNextCheckup) > 30 && (
                  <SWText style={[styles.alertInfo, { color: '#e74c3c' }]} sm bold>
                    WARNING: Vehicle condition check is overdue by more than 30 days. Vehicle operation may be restricted until inspection is completed.
                  </SWText>
                )}
              </>
            )}
            
            <View style={styles.documentList}>
              <SWText style={styles.documentListTitle} md uberBold>Required Documents</SWText>
              
              <DocumentItem 
                name="Emissions Test" 
                validUntil="Oct 9, 2025" 
                onUpload={() => console.log('Upload emissions document')}
                onRemind={() => console.log('Remind owner about emissions')}
              />
              
              <DocumentItem 
                name="Insurance" 
                validUntil="Nov 15, 2025" 
                onUpload={() => console.log('Upload insurance document')}
                onRemind={() => console.log('Remind owner about insurance')}
              />
              
              <DocumentItem 
                name="Road Tax" 
                validUntil="Dec 31, 2025" 
                onUpload={() => console.log('Upload road tax document')}
                onRemind={() => console.log('Remind owner about road tax')}
              />
              
              <DocumentItem 
                name="Vehicle Fitness Certificate" 
                validUntil="Aug 10, 2025" 
                onUpload={() => console.log('Upload fitness certificate')}
                onRemind={() => console.log('Remind owner about fitness certificate')}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.buttonHalf,
                  { backgroundColor: daysUntilNextCheckup > 30 ? '#27ae60' : '#3498db' }
                ]} 
                onPress={() => console.log('Remind owner')}
              >
                <SWText style={styles.actionButtonText} sm uberBold>
                  {daysUntilNextCheckup > 30 ? 'Set General Reminder' : 'Remind Owner'}
                </SWText>
              </TouchableOpacity>
              
              {daysUntilNextCheckup <= 0 && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.buttonHalf, { backgroundColor: theme.colors.primary }]} 
                  onPress={() => console.log('Schedule inspection')}
                >
                  <SWText style={styles.actionButtonText} sm bold>Schedule Inspection</SWText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default LicenseAndVehicleCheckups;