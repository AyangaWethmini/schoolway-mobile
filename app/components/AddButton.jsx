import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from "../theme/ThemeContext";
import SWText from './SWText';



const AddButton = ({ onPress,text, ...props}) => {

  const {theme} = useTheme();

  
  const styles = StyleSheet.create({
    buttonContainer:{
      flexDirection: 'row',
      alignItems:'center',
      justifyContent:'center'
    },  
    button: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accentblue,
      borderRadius: 25,
      paddingHorizontal: 18,
      paddingVertical: 10,
      alignItems: 'center',
    },
    icon: {
      marginRight: 8,
    },
  });


  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons name="add" size={15} color="white" style={styles.icon} />
        <SWText button white>{text}</SWText>
      </TouchableOpacity>
    </View>
  );
};

export default AddButton;
