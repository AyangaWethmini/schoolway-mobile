import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import useTheme from '../theme/ThemeContext';
import SWText from './SWText';

const { width } = Dimensions.get('window');
const theme = useTheme;

const CurvedHeader = ({ title, theme }) => {
 return (
    <View style={headerStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0099cc" />
      
      <LinearGradient
        colors={['#0099cc', '#00bcd4', '#00d4aa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={headerStyles.gradientContainer}
      >
        <SafeAreaView style={headerStyles.safeArea}>
          <View style={headerStyles.headerContent}>
            <SWText uberBold style={headerStyles.title}>{title}</SWText>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <Svg
        height={40}
        width={width}
        style={headerStyles.wave}
        viewBox={`0 0 ${width} 40`}
      >
        <Path
          d={`M0,10 Q${width/4},35 ${width/2},10 T${width},10 L${width},0 L0,0 Z`}
          fill="#00d4aa"
        />
      </Svg>
    </View>
  );
}

const headerStyles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1000,
    },
    gradientContainer: {
        paddingBottom: 0,
    },
    safeArea: {
        paddingHorizontal: 20,
    },
    headerContent: {
        paddingTop: 20,
        paddingBottom: 18,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        color: '#ffffff',
    },
    wave: {
        position: 'absolute',
        top: 67.6,
        left: 0,
    },
});

export default CurvedHeader;