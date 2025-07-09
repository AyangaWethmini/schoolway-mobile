import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SafeAreaView from '../../components/SafeAreaView';
import { Button } from '../../components/button';
import { lightTheme } from '../../theme/theme';

const roles = [
  {
    key: 'vehicleOwner',
    title: 'Vehicle Owner',
    description: 'If you have one or more vehicles to hire, find drivers, and provide transportation, register as a vehicle owner.\n\n*Currenlty available only on Web : SchoolWay.lk ',
  },
  {
    key: 'driver',
    title: 'Driver',
    description: 'If you are a driver, or want to enroll in a van service in SchoolWay, register as a driver and continue your work.',
  },
  {
    key: 'parent',
    title: 'Parent',
    description: 'If you want to track your child, and manage transportation with live updates register as a parent.',
  },
];

export default function RoleSelectionScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleProceed = () => {
    if (!selectedRole) return;
    // navigation.navigate('NextScreen', { role: selectedRole });
    console.log('Proceed with:', selectedRole);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Tell us who you are</Text>

        {roles.map((role) => (
          <TouchableOpacity
            key={role.key}
            style={[
              styles.card,
              selectedRole === role.key && styles.selectedCard,
            ]}
            onPress={() => setSelectedRole(role.key)}
            activeOpacity={0.8}
          >
            <View style={styles.radioRow}>
              <Text style={styles.cardTitle}>{role.title}</Text>
              {selectedRole === role.key ? (
                <Ionicons name="radio-button-on" size={24} color={lightTheme.colors.primary} />
              ) : (
                <Ionicons name="radio-button-off" size={24} color="#ccc" />
              )}
            </View>
            {role.description ? (
              <Text style={styles.cardDescription}>{role.description}</Text>
            ) : null}
          </TouchableOpacity>
        ))}

        {/* <TouchableOpacity
          style={[
            styles.proceedButton,
            !selectedRole && styles.disabledButton,
          ]}
          onPress={handleProceed}
          disabled={!selectedRole}
        >
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity> */}
        <Button 
          title="Proceed"
          varient="primary"
          passstyles={{ marginTop: 20 }}
          // onPress={passwordsMatch ? onNext : undefined}
          // disabled={!passwordsMatch}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
    gap: 20,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#111',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: lightTheme.colors.backgroud,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  selectedCard: {
    // borderColor: '#f9aa33',
    borderColor: lightTheme.colors.primary,
    backgroundColor: '#fff8ed',
    // backgroundColor: lightTheme.colors.backgroud,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  cardDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
  },
  proceedButton: {
    backgroundColor: '#f9aa33',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
  },
});
