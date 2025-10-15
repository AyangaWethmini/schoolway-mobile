import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const DOT_COUNT = 6;

const LoadingScreen = ({
  message = "Loading...",
  showMessage = true,
  style = {}
}) => {
  const { width, height } = Dimensions.get('window');

  // Animation values
  const pulseValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  // Shared step value for sequential dot animation
  const step = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the circles (expand/shrink)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.3,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0.8,
          duration: 1200,
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

    // Step animation for sequential dots
    const stepAnimation = Animated.loop(
      Animated.timing(step, {
        toValue: DOT_COUNT,
        duration: DOT_COUNT * 300,
        useNativeDriver: true,
      })
    );

    // Start all animations
    pulseAnimation.start();
    scaleAnimation.start();
    fadeAnimation.start();
    stepAnimation.start();

    return () => {
      pulseAnimation.stop();
      stepAnimation.stop();
    };
  }, []);

  const RotatingDot = ({ index, total }) => {
    const rotateValue = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      // Rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateValue, {
        //   toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );

      rotateAnimation.start();

      return () => {
        rotateAnimation.stop();
      };
    }, [index]);

    const rotation = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [`${(360 / total) * index}deg`, `${360 + (360 / total) * index}deg`],
    });

    // Sequential scaling based on step animation
    const inputRange = [];
    const outputRange = [];
    
    for (let i = 0; i <= total; i++) {
      inputRange.push(i);
      if (i === index) {
        outputRange.push(1.6); // Active dot scale
      } else if (Math.abs(i - index) === 1 || (index === 0 && i === total) || (index === total - 1 && i === 0)) {
        outputRange.push(1.1); // Adjacent dots slightly larger
      } else {
        outputRange.push(0.6); // Inactive dots smaller
      }
    }

    const scale = step.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.dotContainer,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.dot,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <LinearGradient
            colors={index % 2 === 0 ? ['#0099cc', '#00bcd4'] : ['#00bcd4', '#00d4aa']}
            style={styles.gradientDot}
          />
        </Animated.View>
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
          {/* Inner pulsing circles */}
          <Animated.View
            style={[
              styles.innerContainer,
              {
                transform: [{ scale: pulseValue }],
              },
            ]}
          >
            {/* <LoadingCircle 
              size={80} 
              delay={0} 
              colors={['#0099cc', '#00bcd4']} 
            /> */}
            {/* <LoadingCircle 
              size={60} 
              delay={300} 
              colors={['#00bcd4', '#00d4aa']} 
            /> */}
            {/* <LoadingCircle 
              size={40} 
              delay={600} 
              colors={['#00d4aa', '#0099cc']} 
            /> */}
            {/* <LoadingCircle 
              size={20} 
              delay={900} 
              colors={['#0099cc', '#00bcd4']} 
            /> */}
          </Animated.View>

          {/* 6 Rotating and pulsing dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <RotatingDot key={index} index={index} total={6} />
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
    width: 100,
    height: 100,
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
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  gradientDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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