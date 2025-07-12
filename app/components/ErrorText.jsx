import { Text } from 'react-native'

const ErrorText = ({Error, passstyle}) => {
  return (
      <Text style={[{ padding:0, margin:0, marginBottom: 5, color: 'red', fontSize: 12 }, passstyle]}>{Error}</Text>
  )
}

export default ErrorText