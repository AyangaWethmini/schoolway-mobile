import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import SWText from '../../../components/SWText';
import { useTheme } from '../../../theme/ThemeContext';

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
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);
  const [showVehicleCheckups, setShowVehicleCheckups] = useState(false);
  
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
  });

  return (
    <ScrollView style={styles.container}>
      {/* Warning Cards for Critical States */}
      {(licenseAlertLevel === 'expired' || checkupAlertLevel === 'critical') && (
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
      )}

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
            <View style={styles.alertStatus}>
              <View style={[styles.statusDot, { backgroundColor: licenseAlertColor }]} />
              <SWText style={[styles.statusText, { color: licenseAlertColor }]} sm uberBold>
                {licenseAlertLevel === 'expired' ? 'License Expired' :
                 licenseAlertLevel === 'urgent' ? 'Expiring Soon' :
                 licenseAlertLevel === 'warning' ? 'Renewal Recommended' : 'Valid'}
              </SWText>
            </View>
            
            <SWText style={styles.dateInfo} sm>
              <SWText uberBold>Expiry Date:</SWText> {formatDate(licenseExpiryDate)}
            </SWText>
            
            {daysUntilExpiry > 0 ? (
              <SWText style={styles.alertInfo} sm>
                Your driving license will expire in {daysUntilExpiry} days. 
                {daysUntilExpiry <= 30 ? ' Please renew it as soon as possible.' : ' Plan for renewal ahead of time.'}
              </SWText>
            ) : (
              <SWText style={styles.alertInfo} sm>
                Your driving license has expired. You must renew it immediately before continuing to drive.
              </SWText>
            )}
            
            {(daysUntilExpiry <= 30 || daysUntilExpiry < 0) && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => console.log('Upload new license document')}
              >
                <SWText style={styles.actionButtonText} sm uberBold>Upload New License Document</SWText>
              </TouchableOpacity>
            )}
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
              <SWText uberBold>Last Checkup:</SWText> {formatDate(lastCheckupDate)}
            </SWText>
            
            <SWText style={styles.dateInfo} sm>
              <SWText uberBold>Next Due:</SWText> {formatDate(nextCheckupDate)}
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