import { StyleSheet, View } from 'react-native'

const Spacer = ({ height = 20, width = "100%" }) => {
  return (
    <View style={{ height: height, width: width }} />
  );
};

export default Spacer