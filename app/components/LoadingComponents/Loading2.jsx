import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const SchoolVanTrackingLoader = ({ 
  message = "Locating your school van...", 
  showMessage = true,
  style = {} 
}) => {
  const { width, height } = Dimensions.get('window');
  
  // Animation values
  const vanMoveValue = useRef(new Animated.Value(0)).current;
  const radarSweepValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const dotValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  useEffect(() => {
    // Van movement animation (following a route)
    const vanAnimation = Animated.loop(
      Animated.timing(vanMoveValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );

    // Radar sweep animation
    const radarAnimation = Animated.loop(
      Animated.timing(radarSweepValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Location pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.3,
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

    // Fade in animation
    const fadeAnimation = Animated.timing(fadeValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    // Sequential dot animations for route points
    const dotAnimations = dotValues.map((dotValue, index) => 
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 300),
          Animated.timing(dotValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(dotValue, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      )
    );

    // Start animations
    vanAnimation.start();
    radarAnimation.start();
    pulseAnimation.start();
    fadeAnimation.start();
    dotAnimations.forEach(anim => anim.start());

    return () => {
      vanAnimation.stop();
      radarAnimation.stop();
      pulseAnimation.stop();
      dotAnimations.forEach(anim => anim.stop());
    };
  }, []);

  // Van movement interpolation (following a curved path)
  const vanX = vanMoveValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-40, -20, 0, 20, 40],
  });

  const vanY = vanMoveValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [40, -10, -40, -10, 40],
  });

  // Radar sweep rotation
  const radarRotation = radarSweepValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const SchoolVan = () => (
    <Animated.View
      style={[
        styles.vanContainer,
        {
          transform: [
            { translateX: vanX },
            { translateY: vanY },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.vanBody}
      >
        <View style={styles.vanWindows} />
        <View style={styles.vanWheel1} />
        <View style={styles.vanWheel2} />
      </LinearGradient>
    </Animated.View>
  );

  const LocationPin = ({ top, left, size = 12, delay = 0 }) => {
    const pinScale = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(pinScale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pinScale, {
            toValue: 0.8,
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
          styles.locationPin,
          {
            top,
            left,
            width: size,
            height: size,
            transform: [{ scale: pinScale }],
          },
        ]}
      >
        <LinearGradient
          colors={['#0099cc', '#00bcd4']}
          style={[styles.pinGradient, { width: size, height: size }]}
        />
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { width, height }, style]}>
      <LinearGradient
        colors={['#f0f8ff', '#e6f3ff']}
        style={styles.background}
      >
        <Animated.View
          style={[
            styles.mapContainer,
            {
              opacity: fadeValue,
            },
          ]}
        >
          {/* Map grid background */}
          <View style={styles.mapGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLine, { top: i * 25 }]} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: i * 25 }]} />
            ))}
          </View>

          {/* Radar sweep */}
          <Animated.View
            style={[
              styles.radarContainer,
              {
                transform: [{ rotate: radarRotation }],
              },
            ]}
          >
            <LinearGradient
              colors={['transparent', '#00d4aa40', '#00d4aa80']}
              style={styles.radarSweep}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>

          {/* Central location indicator */}
          <Animated.View
            style={[
              styles.centerLocation,
              {
                transform: [{ scale: pulseValue }],
              },
            ]}
          >
            <LinearGradient
              colors={['#0099cc', '#00bcd4', '#00d4aa']}
              style={styles.centerGradient}
            />
            <View style={styles.centerDot} />
          </Animated.View>

          {/* Route points */}
          <LocationPin top={60} left={80} delay={0} />
          <LocationPin top={120} left={140} delay={300} />
          <LocationPin top={180} left={120} delay={600} />
          <LocationPin top={160} left={60} delay={900} />

          {/* School van */}
          <SchoolVan />

          {/* Route path dots */}
          <View style={styles.routePath}>
            {dotValues.map((dotValue, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.routeDot,
                  {
                    opacity: dotValue,
                    left: 20 + (index * 35),
                    top: 100 + (Math.sin(index * 0.5) * 20),
                  },
                ]}
              >
                <LinearGradient
                  colors={['#00bcd4', '#00d4aa']}
                  style={styles.routeDotGradient}
                />
              </Animated.View>
            ))}
          </View>

          {/* GPS satellites */}
          <View style={styles.satelliteContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.satellite,
                  {
                    top: 20 + (index * 15),
                    right: 20 + (index * 10),
                    opacity: pulseValue,
                  },
                ]}
              />
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
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Connecting to GPS...</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Finding route</Text>
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
  mapContainer: {
    width: 200,
    height: 200,
    position: 'relative',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0,153,204,0.2)',
    overflow: 'hidden',
  },
  mapGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(0,153,204,0.1)',
    width: '100%',
    height: 1,
  },
  verticalLine: {
    width: 1,
    height: '100%',
  },
  radarContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 0,
    left: 0,
  },
  radarSweep: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  centerLocation: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: 88,
    left: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  locationPin: {
    position: 'absolute',
    borderRadius: 6,
  },
  pinGradient: {
    borderRadius: 6,
  },
  vanContainer: {
    position: 'absolute',
    top: 85,
    left: 85,
    width: 30,
    height: 20,
  },
  vanBody: {
    width: 30,
    height: 20,
    borderRadius: 4,
    position: 'relative',
  },
  vanWindows: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: 8,
    backgroundColor: 'rgba(135,206,235,0.6)',
    borderRadius: 2,
  },
  vanWheel1: {
    position: 'absolute',
    bottom: -2,
    left: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
  },
  vanWheel2: {
    position: 'absolute',
    bottom: -2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
  },
  routePath: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  routeDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  routeDotGradient: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  satelliteContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  satellite: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#00d4aa',
    borderRadius: 2,
  },
  textContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0099cc',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d4aa',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00bcd4',
    marginHorizontal: 3,
  },
});

export default SchoolVanTrackingLoader;