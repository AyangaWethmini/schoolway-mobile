import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from "../theme/ThemeContext";


const TextHeading = ({passstyle, children, ...props}) => {

  const {theme} = useTheme();

  return (
    <View>
      <Text
        style={[{
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 20,
          color: theme.colors.textblack 
        }, passstyle]}
        {...props}
      >
        {children}
    </Text>
    </View>
  )
}

export default TextHeading

const styles = StyleSheet.create({})