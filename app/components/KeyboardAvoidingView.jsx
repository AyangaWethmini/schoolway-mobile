import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const KeyboardAvoidingView = ({
  children,
  style = {},
  scrollEnabled = false,
  dismissKeyboardOnTap = true,
  behavior = Platform.OS === 'ios' ? 'padding' : 'height',
  backgroundColor = 'transparent',
}) => {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handlePress = () => {
    if (dismissKeyboardOnTap) {
      Keyboard.dismiss();
    }
  };

  const keyboardAvoidingProps = {
    style: [styles.container, { backgroundColor }, style],
    behavior: behavior || (Platform.OS === 'ios' ? 'padding' : 'height'),
    keyboardVerticalOffset: Platform.OS === 'ios' ? insets.top : 0,
  };

  const content = (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.inner}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );

  if (scrollEnabled) {
    return (
      <RNKeyboardAvoidingView {...keyboardAvoidingProps}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            keyboardHeight === 0 && styles.scrollContainerCentered
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {content}
        </ScrollView>
      </RNKeyboardAvoidingView>
    );
  }

  return (
    <RNKeyboardAvoidingView {...keyboardAvoidingProps}>
      {content}
    </RNKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContainerCentered: {
    justifyContent: 'center',
  },
});

export default KeyboardAvoidingView;
