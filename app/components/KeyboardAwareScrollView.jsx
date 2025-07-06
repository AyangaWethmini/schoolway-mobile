import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

const KeyboardAwareScrollView = ({
  children,
  style = {},
  contentContainerStyle = {},
  dismissKeyboardOnTap = true,
  showsVerticalScrollIndicator = false,
  bounces = false,
  ...props
}) => {
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

  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[
        styles.contentContainer,
        keyboardHeight === 0 && styles.contentContainerCentered,
        contentContainerStyle
      ]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      keyboardShouldPersistTaps="handled"
      bounces={bounces}
      {...props}
    >
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.inner}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  contentContainerCentered: {
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
  },
});

export default KeyboardAwareScrollView;
