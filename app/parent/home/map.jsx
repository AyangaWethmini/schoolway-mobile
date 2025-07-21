import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../../theme/ThemeContext';

const Map = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.9271,
          longitude: 79.8612,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 6.9271, longitude: 79.8612 }}
          title="Colombo"
          description="Capital of Sri Lanka"
        />
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
