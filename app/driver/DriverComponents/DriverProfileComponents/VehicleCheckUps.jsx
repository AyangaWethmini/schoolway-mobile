import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.textgreylight,
    },
    documentName: {
      fontSize: theme.fontSizes.small + 1,
      fontWeight: '500',
      color: theme.colors.textblack,
      marginBottom: 2,
    },
    documentDate: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
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
      borderRadius: theme.borderRadius.small,
      marginLeft: 6,
    },
    smallButtonText: {
      color: 'white',
      fontSize: theme.fontSizes.small - 1,
      marginLeft: 4,
      fontWeight: '500',
    }
  });

  return (
    <View style={styles.documentItem}>
      <View style={{ flex: 1 }}>
        <SWText style={styles.documentName}>{name}</SWText>
        <SWText style={styles.documentDate}>Valid until: {validUntil}</SWText>
      </View>
      <View style={styles.documentActions}>
        <TouchableOpacity 
          style={[styles.smallButton, { backgroundColor: theme.colors.primary }]}
          onPress={onUpload}
        >
          <FontAwesome name="upload" size={12} color="white" />
          <SWText style={styles.smallButtonText}>{uploadLabel}</SWText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.smallButton, { backgroundColor: theme.colors.accentblue }]}
          onPress={onRemind}
        >
          <FontAwesome name="bell" size={12} color="white" />
          <SWText style={styles.smallButtonText}>{remindLabel}</SWText>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const LicenseAndVehicleCheckups = () => {
  const { theme } = useTheme();
  const [showLicenseInfo, setShowLicenseInfo] = useState(true);
  const [showVehicleCheckups, setShowVehicleCheckups] = useState(true);
  
  // Mock data - in real app this would come from API or state
  const licenseExpiryDate = "2024-07-15"; // Format: YYYY-MM-DD
  const lastCheckupDate = "2024-07-09"; // Format: YYYY-MM-DD
  const nextCheckupDate = "2025-09-09"; // Format: YYYY-MM-DD (2 months from current date)
  
  // Calculate days until license expiry
  const today = new Date();
  const expiryDate = new Date(licenseExpiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  // Last checkup reference (used for display only)
  
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
    if (daysUntilNextCheckup > 30) return 'healthy'; // 2+ months is a healthy state
    return 'ok';
  };
  
  const licenseAlertLevel = getLicenseAlertLevel();
  const checkupAlertLevel = getCheckupAlertLevel();
  
  // Get appropriate colors based on alert level
  const getLicenseAlertColor = () => {
    switch (licenseAlertLevel) {
      case 'expired': return theme.colors.error;
      case 'urgent': return '#FF6B00'; // Orange
      case 'warning': return theme.colors.primary; // Yellow
      default: return '#4CAF50'; // Green
    }
  };
  
  const getCheckupAlertColor = () => {
    switch (checkupAlertLevel) {
      case 'critical': return '#8B0000'; // Dark Red for critical/severe warning
      case 'overdue': return theme.colors.error;
      case 'upcoming': return '#FF6B00'; // Orange
      case 'healthy': return '#4CAF50'; // Bright green for healthy status
      default: return '#4CAF50'; // Green
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
      backgroundColor: theme.colors.backgroud,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.sm,
    },
    alertContainer: {
      borderRadius: theme.borderRadius.small,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    alertTitle: {
      fontSize: theme.fontSizes.medium - 2,
      fontWeight: '600',
      color: theme.colors.textblack,
    },
    alertInfo: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.sm,
    },
    alertStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.xs,
    },
    statusText: {
      fontSize: theme.fontSizes.small,
      fontWeight: '500',
    },
    dateInfo: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      marginBottom: theme.spacing.xs,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.textgreylight,
      marginVertical: theme.spacing.sm,
    },
    button: {
      backgroundColor: theme.colors.accentblue,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.small,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    buttonText: {
      color: theme.colors.textwhite,
      fontWeight: '600',
      fontSize: theme.fontSizes.small,
    },
    dropdownHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    dropdownTitle: {
      fontSize: theme.fontSizes.small + 1,
      fontWeight: '600',
      color: theme.colors.textblack,
    },
    contentContainer: {
      backgroundColor: theme.colors.backgroud,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.small,
      borderWidth: 1,
      borderColor: theme.colors.textgreylight,
    },
    // Document list container styles (only keeping container styles)
    documentList: {
      marginTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.textgreylight,
      paddingTop: theme.spacing.sm,
    },
    documentListTitle: {
      fontSize: theme.fontSizes.small + 2,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.sm,
    }
  });

  return (
    <View style={styles.container}>
      <SWText style={styles.sectionTitle}>License & Vehicle Status</SWText>
      
      {/* License Expiration Section */}
      <TouchableOpacity 
        style={[styles.contentContainer, { borderLeftWidth: 3, borderLeftColor: licenseAlertColor }]
        }
        onPress={() => setShowLicenseInfo(!showLicenseInfo)}
      >
        <View style={styles.dropdownHeader}>
          <SWText style={styles.dropdownTitle}>Driving License Status</SWText>
          <FontAwesome 
            name={showLicenseInfo ? "chevron-up" : "chevron-down"} 
            size={12} 
            color={theme.colors.textgreydark} 
          />
        </View>
        
        {showLicenseInfo && (
          <>
            <View style={styles.alertStatus}>
              <View style={[styles.statusDot, { backgroundColor: licenseAlertColor }]} />
              <SWText style={[styles.statusText, { color: licenseAlertColor }]}>
                {licenseAlertLevel === 'expired' ? 'License Expired' :
                 licenseAlertLevel === 'urgent' ? 'Expiring Soon' :
                 licenseAlertLevel === 'warning' ? 'Renewal Recommended' : 'Valid'}
              </SWText>
            </View>
            
            <SWText style={styles.dateInfo}>
              <SWText style={{ fontWeight: '500' }}>Expiry Date:</SWText> {formatDate(licenseExpiryDate)}
            </SWText>
            
            {daysUntilExpiry > 0 ? (
              <SWText style={styles.alertInfo}>Your driving license will expire in {daysUntilExpiry} days. {daysUntilExpiry <= 30 ? 'Please renew it as soon as possible.' : 'Plan for renewal ahead of time.'}</SWText>
            ) : (
              <SWText style={styles.alertInfo}>Your driving license has expired. You must renew it immediately before continuing to drive.</SWText>
            )}
            
            {(daysUntilExpiry <= 30 || daysUntilExpiry < 0) && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => console.log('Upload new license document')}
              >
                <SWText style={styles.buttonText}>Upload New License Document</SWText>
              </TouchableOpacity>
            )}
          </>
        )}
      </TouchableOpacity>
      
      <View style={styles.separator} />
      
      {/* Vehicle Checkups Section */}
      <TouchableOpacity 
        style={[styles.contentContainer, { borderLeftWidth: 3, borderLeftColor: checkupAlertColor }]
        }
        onPress={() => setShowVehicleCheckups(!showVehicleCheckups)}
      >
        <View style={styles.dropdownHeader}>
          <SWText style={styles.dropdownTitle}>Vehicle Condition Status</SWText>
          <FontAwesome 
            name={showVehicleCheckups ? "chevron-up" : "chevron-down"} 
            size={12} 
            color={theme.colors.textgreydark} 
          />
        </View>
        
        {showVehicleCheckups && (
          <>
            <View style={styles.alertStatus}>
              <View style={[styles.statusDot, { backgroundColor: checkupAlertColor }]} />
              <SWText style={[styles.statusText, { color: checkupAlertColor }]}>
                {checkupAlertLevel === 'critical' ? 'Critical: Severely Overdue' :
                 checkupAlertLevel === 'overdue' ? 'Checkup Overdue' :
                 checkupAlertLevel === 'upcoming' ? 'Checkup Soon' : 
                 checkupAlertLevel === 'healthy' ? 'Vehicle in Good Standing' : 'Status Good'}
              </SWText>
            </View>
            
            <SWText style={styles.dateInfo}>
              <SWText style={{ fontWeight: '500' }}>Last Checkup:</SWText> {formatDate(lastCheckupDate)}
            </SWText>
            
            <SWText style={styles.dateInfo}>
              <SWText style={{ fontWeight: '500' }}>Next Due:</SWText> {formatDate(nextCheckupDate)}
            </SWText>
            
            {daysUntilNextCheckup > 0 ? (
              <>
                <SWText style={styles.alertInfo}>
                  Next vehicle condition test is in {daysUntilNextCheckup} days. 
                  {daysUntilNextCheckup <= 30 
                    ? 'Please prepare for the test.' 
                    : 'Your vehicle is up to date with required inspections.'}
                </SWText>
                {daysUntilNextCheckup > 30 && (
                  <SWText style={[styles.alertInfo, { color: '#4CAF50', fontWeight: '500' }]}>
                    STATUS: Vehicle is in good condition and compliant with all requirements.
                  </SWText>
                )}
              </>
            ) : (
              <>
                <SWText style={styles.alertInfo}>Your vehicle condition test is overdue by {Math.abs(daysUntilNextCheckup)} days. Please schedule it immediately.</SWText>
                {Math.abs(daysUntilNextCheckup) > 30 && (
                  <SWText style={[styles.alertInfo, { color: theme.colors.error, fontWeight: '600' }]}>
                    WARNING: Vehicle condition check is overdue by more than 30 days. Vehicle operation may be restricted until inspection is completed.
                  </SWText>
                )}
              </>
            )}
            
            <View style={styles.documentList}>
              <SWText style={styles.documentListTitle}>Required Documents</SWText>
              
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
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.md }}>
              <TouchableOpacity 
                style={[
                  styles.button, 
                  { 
                    flex: 1, 
                    marginRight: daysUntilNextCheckup <= 0 ? 8 : 0,
                    backgroundColor: daysUntilNextCheckup > 30 ? '#4CAF50' : theme.colors.accentblue 
                  }
                ]} 
                onPress={() => console.log('Remind owner')}
              >
                <SWText style={styles.buttonText}>
                  {daysUntilNextCheckup > 30 ? 'Set General Reminder' : 'Remind Owner'}
                </SWText>
              </TouchableOpacity>
              
              {daysUntilNextCheckup <= 0 && (
                <TouchableOpacity 
                  style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: theme.colors.primary }]} 
                  onPress={() => console.log('Schedule inspection')}
                >
                  <SWText style={[styles.buttonText, { color: theme.colors.textblack }]}>Schedule Inspection</SWText>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default LicenseAndVehicleCheckups;