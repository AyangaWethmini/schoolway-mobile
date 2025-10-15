import { ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import CurvedHeader from '../components/CurvedHeader';
import { useTheme } from '../theme/ThemeContext';
import NoVanDashboard from './DriverComponents/NoVanDashboard';
import WithVanDashboard from './DriverComponents/WithVanDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  return (
    <ScrollView style={styles.scrollView}
  contentContainerStyle={{ paddingBottom: 40 }}
  keyboardShouldPersistTaps="handled">
    <CurvedHeader 
              title="SchoolWay" 
              theme={theme}
            />
      {user?.hasVan ? <WithVanDashboard /> : <NoVanDashboard />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FAF8F8',
  },
});