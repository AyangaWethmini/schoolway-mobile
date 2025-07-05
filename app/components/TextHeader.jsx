import { StyleSheet, Text, View } from 'react-native'

const TextHeader = ({passstyle, children, ...props}) => {
  return (
    <View>
      <Text
        style={[{
          fontSize: 24,
          fontWeight: 'bold',
          marginVertical: 20,
          color: '#333',
        }, passstyle]}
        {...props}
      >
        {children}
    </Text>
    </View>
  )
}

export default TextHeader

const styles = StyleSheet.create({})