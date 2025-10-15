import { LinearGradient } from 'expo-linear-gradient';

const GradientBackground = ({ children, style }) => {
  return (
    <LinearGradient
      colors={['#0099cc', '#4A90E2', '#00d4aa']} // Your gradient colors
      start={{ x: 0, y: 0 }}
      end={{ x: 1.2, y: 0 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;