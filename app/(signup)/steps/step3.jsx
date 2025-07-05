import { Button, Text, View } from 'react-native';

const SummaryStep = ({ formData, onSubmit, onBack }) => (
  <View>
    <Text>Name: {formData.name}</Text>
    <Text>Email: {formData.email}</Text>
    <Text>NIC: {formData.nic}</Text>
    <Text>Driving License: {formData.drivingLicense}</Text>
    <Button title="Back" onPress={onBack} />
    <Button title="Submit" onPress={onSubmit} />
  </View>
);

export default SummaryStep;
