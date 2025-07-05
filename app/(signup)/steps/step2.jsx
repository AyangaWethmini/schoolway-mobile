import { Button, TextInput, View } from 'react-native';

const VerificationStep = ({ formData, onChange, onNext, onBack }) => (
  <View>
    <TextInput
      placeholder="NIC"
      value={formData.nic}
      onChangeText={(val) => onChange('nic', val)}
    />
    <TextInput
      placeholder="Driving License"
      value={formData.drivingLicense}
      onChangeText={(val) => onChange('drivingLicense', val)}
    />
    <Button title="Back" onPress={onBack} />
    <Button title="Next" onPress={onNext} />
  </View>
);

export default VerificationStep;
