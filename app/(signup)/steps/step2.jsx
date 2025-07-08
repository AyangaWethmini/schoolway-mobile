import { StyleSheet, Text, View } from 'react-native';
import KeyboardAwareScrollView from '../../components/KeyboardAwareScrollView';

const VerificationStep = ({ formData, onChange, onNext, onBack }) => (
  <>
  {/* <View>
    <TextInput
      placeholder="NIC"
      // value={formData.nic}
      // onChangeText={(val) => onChange('nic', val)}
    />
    <TextInput
      placeholder="Driving License"
      // value={formData.drivingLicense}
      // onChangeText={(val) => onChange('drivingLicense', val)}
    />
    <Button title="Back" onPress={onBack} />
    <Button title="Next" onPress={onNext} />
  </View> */}
  <KeyboardAwareScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View> 
        <Text>
          Hello
        </Text>

      </View>
    </KeyboardAwareScrollView>
</>
);

export default VerificationStep;


const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  form:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 20,
  }
});


