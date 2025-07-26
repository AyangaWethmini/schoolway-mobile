import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

const IdImagesSection = ({ frontImage, backImage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#ecf0f1',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2c3e50',
      flex: 1,
    },
    expandButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    expandText: {
      fontSize: 12,
      color: theme.colors.primary,
      marginRight: 4,
    },
    imagesContainer: {
      marginTop: 12,
    },
    imageRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    imageItem: {
      flex: 1,
      alignItems: 'center',
    },
    imageLabel: {
      fontSize: 12,
      color: '#7f8c8d',
      fontWeight: '600',
      marginBottom: 8,
      textAlign: 'center',
    },
    licenseImage: {
      width: '100%',
      height: 120,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      resizeMode: 'cover',
    },
    noImageContainer: {
      width: '100%',
      height: 120,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      backgroundColor: '#f8f9fa',
      justifyContent: 'center',
      alignItems: 'center',
    },
    noImageText: {
      fontSize: 12,
      color: '#7f8c8d',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.sectionTitle}>License Images</Text>
        <View style={styles.expandButton}>
          <Text style={styles.expandText}>
            {isExpanded ? 'Hide' : 'View'}
          </Text>
          <FontAwesome 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={12} 
            color={theme.colors.primary} 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.imagesContainer}>
          <View style={styles.imageRow}>
            <View style={styles.imageItem}>
              <Text style={styles.imageLabel}>License Front</Text>
              {frontImage ? (
                <Image 
                  source={{ uri: frontImage }} 
                  style={styles.licenseImage}
                />
              ) : (
                <View style={styles.noImageContainer}>
                  <FontAwesome name="image" size={24} color="#bdc3c7" />
                  <Text style={styles.noImageText}>No image uploaded</Text>
                </View>
              )}
            </View>

            <View style={styles.imageItem}>
              <Text style={styles.imageLabel}>License Back</Text>
              {backImage ? (
                <Image 
                  source={{ uri: backImage }} 
                  style={styles.licenseImage}
                />
              ) : (
                <View style={styles.noImageContainer}>
                  <FontAwesome name="image" size={24} color="#bdc3c7" />
                  <Text style={styles.noImageText}>No image uploaded</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};


export default IdImagesSection;