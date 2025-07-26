import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const LoadingScreen = ({ 
  message = "Loading...", 
  showMessage = true,
  style = {} 
}) => {
  const { width, height } = Dimensions.get('window');
  
  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotation animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Pulse animation for the inner circles
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Scale animation for the whole loader
    const scaleAnimation = Animated.timing(scaleValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    // Fade in animation
    const fadeAnimation = Animated.timing(fadeValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    // Start all animations
    spinAnimation.start();
    pulseAnimation.start();
    scaleAnimation.start();
    fadeAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  // Interpolate rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const LoadingCircle = ({ size, delay = 0, colors }) => {
    const circleScale = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(circleScale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(circleScale, {
            toValue: 0.7,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }, [delay]);

    return (
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            transform: [{ scale: circleScale }],
          },
        ]}
      >
        <LinearGradient
          colors={colors}
          style={[styles.gradientCircle, { width: size, height: size }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { width, height }, style]}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.background}
      >
        <Animated.View
          style={[
            styles.loaderContainer,
            {
              opacity: fadeValue,
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* Outer rotating ring */}
          <Animated.View
            style={[
              styles.outerRing,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <LinearGradient
              colors={['#0099cc', '#00bcd4', '#00d4aa']}
              style={styles.gradientRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Inner pulsing circles */}
          <Animated.View
            style={[
              styles.innerContainer,
              {
                transform: [{ scale: pulseValue }],
              },
            ]}
          >
            <LoadingCircle 
              size={60} 
              delay={0} 
              colors={['#0099cc', '#00bcd4']} 
            />
            <LoadingCircle 
              size={40} 
              delay={200} 
              colors={['#00bcd4', '#00d4aa']} 
            />
            <LoadingCircle 
              size={20} 
              delay={400} 
              colors={['#00d4aa', '#0099cc']} 
            />
          </Animated.View>

          {/* Floating dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [
                      { rotate: spin },
                      { translateX: 80 },
                      { rotate: spin },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={index % 2 === 0 ? ['#0099cc', '#00bcd4'] : ['#00bcd4', '#00d4aa']}
                  style={styles.gradientDot}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Loading text */}
        {showMessage && (
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeValue,
              },
            ]}
          >
            <Text style={styles.loadingText}>{message}</Text>
            <View style={styles.progressDots}>
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.progressDot,
                    {
                      opacity: pulseValue,
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    position: 'absolute',
  },
  gradientRing: {
    flex: 1,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    borderRadius: 50,
    position: 'absolute',
  },
  gradientCircle: {
    borderRadius: 50,
  },
  dotsContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 76,
    left: 76,
  },
  gradientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0099cc',
    marginBottom: 12,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00bcd4',
    marginHorizontal: 4,
  },
});

export default LoadingScreen;