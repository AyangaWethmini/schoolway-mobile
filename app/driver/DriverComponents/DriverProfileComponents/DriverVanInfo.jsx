import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import AssistantInfoSection from './VanInfoComponents/AssistantInfoSection';
import StudentListSection from './VanInfoComponents/StudentListSection';
import VehicleInfoCard from './VanInfoComponents/VehicleInfoCard';

const VehicleInfo = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
  });
  
  return (
    <ScrollView style={styles.container}>
      <VehicleInfoCard />
      <AssistantInfoSection />
      <StudentListSection />
      {/* <SchoolsRouteSection /> */}
    </ScrollView>
  );
}

export default VehicleInfo;
