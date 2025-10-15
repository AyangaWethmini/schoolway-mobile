import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Dimensions, StyleSheet, Text } from 'react-native';
import useTheme from '../../theme/ThemeContext';

const { height } = Dimensions.get('window');

const LoadingScreen = ({ showMessage=false, message='Loading...' }) => {
  const theme = useTheme();
return (
    <LinearGradient
        colors={[
            // 'rgba(0,153,204,0.2)',
            // 'rgba(0,188,212,0.15)',
            // 'rgba(0,212,170,0.1)'
            '#FAF8F8',
            '#FAF8F8',
            '#FAF8F8',
        ]}
        style={styles.container}
    >
        <LottieView
            source={require('./loading.json')} // You can download a nice one from LottieFiles.com
            autoPlay
            loop
            style={styles.animation}
        />
        {showMessage && (
        <Text style={{ fontSize: 16, color: theme?.colors?.text ?? '#000', marginTop: 20,
          fontSize: 18,
          fontWeight: '600',
          color: '#0099cc',
          marginBottom: 12,
        }}>
            {message}
        </Text>
        )}
    </LinearGradient>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height : height/2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 150,
    height: 150,
  },
});

export default LoadingScreen;
