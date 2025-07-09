import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeAreaView = ({ 
  children, 
  style = {}, 
  edges = ['top', 'bottom'], 
  backgroundColor = 'transparent', 
  ...props 
}) => {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View style={[styles.container, { backgroundColor }, style,styles.innerContainer, paddingStyle]} {...props}>
      {/* <View style={}> */}
        {children}
      {/* </View> */}
    </View>
  );
};

export default SafeAreaView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
});