import { Text, View, StyleSheet } from "react-native";
import { Button } from "./components/button";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Button Variants</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Primary Button" 
          varient="primary"
          onPress={() => console.log('Primary pressed')}
        />
        
        <Button 
          title="Secondary Button" 
          varient="secondary"
          onPress={() => console.log('Secondary pressed')}
        />
        
        <Button 
          title="Outlined Yellow" 
          varient="outlined-yellow"
          onPress={() => console.log('Outlined Yellow pressed')}
        />
        
        <Button 
          title="Outlined Black" 
          varient="outlined-black"
          onPress={() => console.log('Outlined Black pressed')}
        />
        
        <Button 
          title="Disabled Button" 
          varient="primary"
          disabled={true}
          onPress={() => console.log('This should not fire')}
        />
      </View>
    </View>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
});
