import { ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import NoVanDashboard from './DriverComponents/NoVanDashboard';
import WithVanDashboard from './DriverComponents/WithVanDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.scrollView}>
      {user?.hasVan ? <WithVanDashboard /> : <NoVanDashboard />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FAF8F8',
  },
});