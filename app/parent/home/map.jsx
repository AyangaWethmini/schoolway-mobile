import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from "../../theme/ThemeContext";


const Map = () => {
  const {theme} = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text ,{ color : theme.colors.textgreylight}]}>Your Map will appear in this page.</Text>
    </View>
  )
}

export default Map

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
  },

  text:{
    fontSize: 18,
  }
})