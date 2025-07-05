import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeAreaView = ({style, ...props}) => {
    const insets = useSafeAreaInsets();

  return (
    <View
            style={[{ 
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
             }, style
            ]}
            {...props}
        />
  )
}

export default SafeAreaView

const styles = StyleSheet.create({})