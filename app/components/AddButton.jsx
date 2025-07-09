import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AddButton = ({ onPress,text, ...props}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons name="add" size={15} color="white" style={styles.icon} />
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center'
  },  
  button: {
    flexDirection: 'row',
    backgroundColor: 'black',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AddButton;
