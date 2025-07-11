import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface SWTextProps extends TextProps {
  // Font family
  uber?: boolean;
  uberMedium?: boolean;
  uberBold?: boolean;
  regular?: boolean;
  
  // Font sizes
  xs?: boolean; // extra small
  sm?: boolean; // small
  md?: boolean; // medium (default)
  lg?: boolean; // large
  xl?: boolean; // extra large
  
  // Colors
  black?: boolean;
  white?: boolean;
  grayd?: boolean; // dark gray
  grayl?: boolean; // light gray
  blue?: boolean;
  primary?: boolean;
  
  // Text alignment
  left?: boolean;
  center?: boolean;
  right?: boolean;
  
  // Font weight
  bold?: boolean;
  semibold?: boolean;
  
  // Extra styling
  underline?: boolean;
  italic?: boolean;
  
  // Variants
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  body?: boolean;
  caption?: boolean;
  label?: boolean;
  button?: boolean;
  
  children: React.ReactNode;
}

/**
 * SWText - A simplified text component with declarative props
 * 
 * @example
 * <SWText md primary bold>Hello World</SWText>
 * <SWText uberBold lg center>Centered Large Text</SWText>
 * <SWText h1 blue>Blue Heading</SWText>
 */
const SWText: React.FC<SWTextProps> = (props) => {
  const { theme } = useTheme();
  const {
    // Font family props
    uber,
    uberMedium,
    uberBold,
    regular,
    
    // Size props
    xs,
    sm,
    md,
    lg,
    xl,
    
    // Color props
    black,
    white,
    grayd,
    grayl,
    blue,
    primary,
    
    // Alignment props
    left,
    center,
    right,
    
    // Weight props
    bold,
    semibold,
    
    // Style props
    underline,
    italic,
    
    // Variant props
    h1,
    h2,
    h3,
    body,
    caption,
    label,
    button,
    
    // Other props
    style,
    children,
    ...rest
  } = props;

  // Determine font family
  let fontFamily = theme.fonts.regular; // Default
  if (uberBold || h1 || h2 || button) fontFamily = theme.fonts.uberBold;
  if (uberMedium || h3 || label || semibold) fontFamily = theme.fonts.uberMedium;
  if (regular) fontFamily = theme.fonts.regular;
  
  // Determine font size
  let fontSize = theme.fontSizes.medium; // Default medium
  if (xs || caption) fontSize = theme.fontSizes.small;
  if (sm) fontSize = theme.fontSizes.small + 1;
  if (md || body || label || button) fontSize = theme.fontSizes.medium;
  if (lg || h3) fontSize = theme.fontSizes.large - 2;
  if (xl || h2) fontSize = theme.fontSizes.large;
  if (h1) fontSize = theme.fontSizes.large + 6;
  
  // Determine text color
  let textColor = theme.colors.textblack; // Default
  if (black) textColor = theme.colors.textblack;
  if (white) textColor = theme.colors.textwhite;
  if (grayd) textColor = theme.colors.textgreydark;
  if (grayl) textColor = theme.colors.textgreylight;
  if (blue) textColor = theme.colors.accentblue;
  if (primary) textColor = theme.colors.primary;
  
  // Determine text alignment
  let textAlign: 'auto' | 'left' | 'right' | 'center' | 'justify' = 'auto';
  if (left) textAlign = 'left';
  if (center) textAlign = 'center';
  if (right) textAlign = 'right';
  
  // Determine font weight
  let fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' = 'normal';
  if (bold) fontWeight = 'bold';
  if (semibold) fontWeight = '600';
  
  // Build styles
  const textStyles = {
    fontFamily,
    fontSize,
    color: textColor,
    textAlign,
    fontWeight,
    ...(underline ? { textDecorationLine: 'underline' as const } : {}),
    ...(italic ? { fontStyle: 'italic' as const } : {}),
  };

  return (
    <Text 
      style={[textStyles, style]} 
      {...rest}
    >
      {children}
    </Text>
  );
};

export default SWText;
