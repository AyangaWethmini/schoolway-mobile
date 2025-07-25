import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import SWText from './SWText';

const { width } = Dimensions.get('window');

const CurvedHeader = ({ title, theme }) => {
 return (
    <View style={headerStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#a855f7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={headerStyles.gradientContainer}
      >
        <SafeAreaView style={headerStyles.safeArea}>
          <View style={headerStyles.headerContent}>
            <SWText style={headerStyles.title}>{title}</SWText>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Wavy Bottom using SVG */}
      <Svg
        height={40}
        width={width}
        style={headerStyles.wave}
        viewBox={`0 0 ${width} 40`}
      >
        <Defs>
          <SvgLinearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6366f1" />
            <Stop offset="50%" stopColor="#8b5cf6" />
            <Stop offset="100%" stopColor="#a855f7" />
          </SvgLinearGradient>
        </Defs>
        {/* Wavy pattern */}
        <Path
          d={`M0,10 Q${width/4},35 ${width/2},10 T${width},10 L${width},0 L0,0 Z`}
          fill="url(#headerGradient)"
        />
      </Svg>
    </View>
  );
}

// Header styles
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
        paddingTop: 15,
        paddingBottom: 20,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'UberMove-Bold',
    },
    wave: {
        position: 'absolute',
        top: 67.6,
        left: 0,
    },
});

export default CurvedHeader;