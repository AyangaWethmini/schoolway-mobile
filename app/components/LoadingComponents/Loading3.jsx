import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const FloatingDotsLoader = ({ 
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
  
  // Create multiple dot animation values (36 total dots: 8+12+16)
  const totalDots = 36;
  const dotAnimations = useRef(
    Array.from({ length: totalDots }, () => ({
      orbit: new Animated.Value(0),
      scale: new Animated.Value(0.5),
      opacity: new Animated.Value(0.7),
    }))
  ).current;

  useEffect(() => {
    // Main rotation animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    // Pulse animation for center element
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // Scale animation for entrance
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

    // Individual dot animations
    const dotAnimationsList = dotAnimations.map((dot, index) => {
      const delay = (index * 150); // Stagger the animations
      
      return [
        // Orbit animation
        Animated.loop(
          Animated.timing(dot.orbit, {
            toValue: 1,
            duration: 4000 + (index * 100), // Slightly different speeds
            useNativeDriver: true,
          })
        ),
        // Scale animation
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot.scale, {
              toValue: 1.2,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(dot.scale, {
              toValue: 0.6,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ),
        // Opacity animation
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay * 0.5),
            Animated.timing(dot.opacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(dot.opacity, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ];
    });

    // Start all animations
    spinAnimation.start();
    pulseAnimation.start();
    scaleAnimation.start();
    fadeAnimation.start();
    
    dotAnimationsList.forEach(dotAnims => {
      dotAnims.forEach(anim => anim.start());
    });

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
      dotAnimationsList.forEach(dotAnims => {
        dotAnims.forEach(anim => anim.stop());
      });
    };
  }, []);

  // Main rotation interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const FloatingDot = ({ index, size = 12, orbitRadius = 80, dotCount = 8 }) => {
    const dot = dotAnimations[index];
    
    // Safety check
    if (!dot) return null;
    
    // Calculate position based on index for even distribution
    const angle = (index * (360 / dotCount)) * (Math.PI / 180);
    
    // Orbit rotation
    const orbitRotation = dot.orbit.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    // Position calculation for circular orbit
    const translateX = Math.cos(angle) * orbitRadius;
    const translateY = Math.sin(angle) * orbitRadius;

    // Color variations
    const colors = [
      ['#0099cc', '#00bcd4'],
      ['#00bcd4', '#00d4aa'],
      ['#00d4aa', '#0099cc'],
    ];
    const colorIndex = index % 3;

    return (
      <Animated.View
        style={[
          styles.floatingDot,
          {
            transform: [
              { rotate: orbitRotation },
              { translateX },
              { translateY },
              { scale: dot.scale },
            ],
            opacity: dot.opacity,
          },
        ]}
      >
        <LinearGradient
          colors={colors[colorIndex]}
          style={[styles.dotGradient, { width: size, height: size }]}
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

          {/* Central pulsing element */}
          <Animated.View
            style={[
              styles.centerElement,
              {
                transform: [{ scale: pulseValue }],
              },
            ]}
          >
            <LinearGradient
              colors={['#0099cc', '#00bcd4', '#00d4aa']}
              style={styles.centerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.innerDot} />
          </Animated.View>

          {/* Multiple floating dots in different orbits */}
          <View style={styles.dotsContainer}>
            {/* Inner orbit dots */}
            {Array.from({ length: 8 }).map((_, index) => (
              <FloatingDot 
                key={`inner-${index}`} 
                index={index} 
                size={8} 
                orbitRadius={60}
                dotCount={8}
              />
            ))}
            
            {/* Outer orbit dots */}
            {Array.from({ length: 12 }).map((_, index) => (
              <FloatingDot 
                key={`outer-${index}`} 
                index={index + 8} 
                size={10} 
                orbitRadius={100}
                dotCount={12}
              />
            ))}
            
            {/* Far orbit dots */}
            {Array.from({ length: 16 }).map((_, index) => (
              <FloatingDot 
                key={`far-${index}`} 
                index={index + 20} 
                size={6} 
                orbitRadius={140}
                dotCount={16}
              />
            ))}
          </View>

          {/* Additional decorative elements */}
          <Animated.View
            style={[
              styles.decorativeRing,
              {
                transform: [{ rotate: spin }, { scale: pulseValue }],
                opacity: 0.3,
              },
            ]}
          >
            <LinearGradient
              colors={['transparent', '#00d4aa40', 'transparent']}
              style={styles.decorativeGradient}
            />
          </Animated.View>
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
                      transform: [{ scale: pulseValue }],
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
    width: 300,
    height: 300,
  },
  outerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
    position: 'absolute',
  },
  gradientRing: {
    flex: 1,
    borderRadius: 57,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  centerElement: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
  },
  innerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#0099cc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  dotsContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 6,
  },
  dotGradient: {
    borderRadius: 6,
    shadowColor: '#0099cc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  decorativeRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  decorativeGradient: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  textContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0099cc',
    marginBottom: 16,
    textAlign: 'center',
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

export default FloatingDotsLoader;