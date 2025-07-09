import { StyleSheet, Text, View, Image } from 'react-native'
import { useTheme } from "../theme/ThemeContext";


const DriverProfileOverview = () => {
  
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.backgroud,
    },
    title: {
      fontSize: theme.fontSizes.large,
      fontWeight: 'bold',
      marginBottom: theme.spacing.md,
      color: theme.colors.textblack,
    },
    section: {
      paddingVertical: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.sm,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.textgreylight,
      marginVertical: theme.spacing.sm,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderColor: theme.colors.primary,
      borderWidth: 2, 
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    avatarText: {
      color: 'white',
      fontSize: theme.fontSizes.large + 8,
      fontWeight: 'bold',
    },
    profileInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      fontSize: theme.fontSizes.medium + 2,
      fontWeight: 'bold',
      color: theme.colors.textblack,
      marginBottom: theme.spacing.xs,
    },
    details: {
      fontSize: theme.fontSizes.small + 2,
      color: theme.colors.textgreylight,
      marginBottom: 2,
      fontWeight : 400
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.sm,
    },
    statCard: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.colors.backgroud,
      borderRadius: theme.borderRadius.small,
      paddingVertical: theme.spacing.sm,
      marginHorizontal: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1, // Added border
      borderColor: theme.colors.textgreylight, // Border color
    },
    statValue: {
      fontSize: theme.fontSizes.large,
      fontWeight: 'bold',
      color: theme.colors.textblack,
    },
    statLabel: {
      fontSize: theme.fontSizes.small,
      color: theme.colors.textgreydark,
      marginTop: theme.spacing.xs,
    },
    attribute : {
      color : theme.colors.textgreydark,
    } 
   });

  return (

    <View style={styles.container}>      
      <View style={styles.section}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Image 
              source={require('../../assets/images/dummy/driver.webp')}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.details}><Text style={styles.attribute}>Driver ID: </Text>DRV12345</Text>
            <Text style={styles.details}><Text style={styles.attribute}>Vehicle:</Text> Toyota Hiace (ABC-1234)</Text>
            <Text style={styles.details}><Text style={styles.attribute}>Phone:</Text> +94 77 123 4567</Text>
          </View>
        </View>
      </View>
      
      
      
      <View style={styles.section}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2 yrs</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>
      </View>
      <View style={styles.separator} />
    </View>

  )
}
























export default function Profile() {
  return <DriverProfileOverview />
}
