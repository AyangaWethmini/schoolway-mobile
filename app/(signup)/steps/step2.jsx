import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SafeAreaView from '../../components/SafeAreaView';
import { Button } from '../../components/button';
import { lightTheme } from '../../theme/theme';
import { FormContext } from '../../utils/FormContext';

const roles = [
  {
    key: 'SERVICE',
    title: 'Vehicle Owner',
    description: 'If you have one or more vehicles to hire, find drivers, and provide transportation, register as a vehicle owner.\n\n*Currenlty available only on Web : SchoolWay.lk ',
  },
  {
    key: 'DRIVER',
    title: 'Driver',
    description: 'If you are a driver, or want to enroll in a van service in SchoolWay, register as a driver and continue your work.',
  },
  {
    key: 'PARENT',
    title: 'Parent',
    description: 'If you want to track your child, and manage transportation with live updates register as a parent.',
  },
];

const RoleSelectionScreen = ({}) => {
  const { formData, updateFormData } = useContext(FormContext);
  const [selectedRole, setSelectedRole] = useState('');
  const router = useRouter();
  const [proceed, setProceed] = useState(false);

  useEffect(() => {
    if (formData.role) {
      setSelectedRole(formData.role);
      setProceed(true);
    }
  }, [formData.role]);

  const handleProceed = () => {
    if (!selectedRole) return;
    // navigation.navigate('NextScreen', { role: selectedRole });
    console.log('Proceed with:', selectedRole);
  };

  const onClick = () => {
    console.log('Selected Role:', selectedRole);
    console.log('Proceeding to next step...', formData);
    router.push('./step3');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Tell us who you are</Text>

        {roles.map((role) => (
          <TouchableOpacity
            key={role.key}
            style={[
              styles.card,
              formData.role === role.key && styles.selectedCard,
            ]}
            onPress={() => updateFormData('role',role.key)}
            activeOpacity={0.8}
          >
            <View style={styles.radioRow}>
              <Text style={styles.cardTitle}>{role.title}</Text>
              {formData.role === role.key ? (
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
          disabled={!proceed}
          passstyles={{ marginTop: 20 }}
          onPress={proceed ? onClick : undefined}
          // disabled={!passwordsMatch}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default RoleSelectionScreen;

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
