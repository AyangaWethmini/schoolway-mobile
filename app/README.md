# Components Documentation

This directory contains reusable UI components for the SchoolWay mobile application. All components are built with React Native and use the app's theme system.

## 📁 Available Components

### 🔘 Button Component (`button.tsx`)
A customizable button component with multiple variants and theme integration.

#### Import
```tsx
import Button from './components/button';
// or
import { Button } from './components/button';
```

#### Props
- `title: string` - Button text
- `variant?: 'primary' | 'secondary' | 'outlined-yellow' | 'outlined-black'` - Button style variant
- `disabled?: boolean` - Disable button interaction
- `onPress?: () => void` - Button press handler
- All standard `TouchableOpacity` props

#### Usage Examples
```tsx
// Primary button (default)
<Button title="Sign In" onPress={() => console.log('Pressed')} />

// Secondary button
<Button title="Cancel" variant="secondary" onPress={handleCancel} />

// Outlined buttons
<Button title="Learn More" variant="outlined-yellow" onPress={handleLearn} />
<Button title="Skip" variant="outlined-black" onPress={handleSkip} />

// Disabled button
<Button title="Submit" disabled={true} onPress={handleSubmit} />
```

---

### 📝 Input Components (`inputs.tsx`)
A collection of input components for different use cases.

#### 1. TextInputComponent
Basic text input with theme integration and validation.

##### Import
```tsx
import { TextInputComponent } from './components/inputs';
```

##### Props
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message to display
- `disabled?: boolean` - Disable input
- `variant?: 'default' | 'outlined'` - Input style variant
- All standard `TextInput` props

##### Usage
```tsx
<TextInputComponent
  label="Full Name"
  placeholder="Enter your full name"
  value={name}
  onChangeText={setName}
  error={nameError}
/>
```

#### 2. PasswordInput
Password input with visibility toggle.

##### Import
```tsx
import { PasswordInput } from './components/inputs';
```

##### Props
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message
- `disabled?: boolean` - Disable input
- `showPasswordToggle?: boolean` - Show/hide password toggle (default: true)
- All standard `TextInput` props

##### Usage
```tsx
<PasswordInput
  label="Password"
  placeholder="Enter your password"
  value={password}
  onChangeText={setPassword}
  error={passwordError}
/>
```

#### 3. DropdownInput
Dropdown/select input with modal picker.

##### Import
```tsx
import { DropdownInput } from './components/inputs';
```

##### Props
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message
- `disabled?: boolean` - Disable input
- `options: { label: string; value: string | number }[]` - Dropdown options
- `selectedValue?: string | number` - Currently selected value
- `onSelect: (value: string | number) => void` - Selection handler

##### Usage
```tsx
const gradeOptions = [
  { label: 'Grade 1', value: 1 },
  { label: 'Grade 2', value: 2 },
  { label: 'Grade 3', value: 3 },
];

<DropdownInput
  label="Select Grade"
  placeholder="Choose your grade"
  options={gradeOptions}
  selectedValue={selectedGrade}
  onSelect={setSelectedGrade}
  error={gradeError}
/>
```

#### 4. CodeInput
OTP/verification code input component.

##### Import
```tsx
import { CodeInput } from './components/inputs';
```

##### Props
- `length?: number` - Number of code digits (default: 4)
- `onCodeChange: (code: string) => void` - Code change handler
- `label?: string` - Input label
- `error?: string` - Error message

##### Usage
```tsx
<CodeInput
  length={6}
  label="Enter Verification Code"
  onCodeChange={setVerificationCode}
  error={codeError}
/>
```

#### 5. MultilineTextInput
Multiline text input for longer content.

##### Import
```tsx
import { MultilineTextInput } from './components/inputs';
```

##### Props
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message
- `disabled?: boolean` - Disable input
- `numberOfLines?: number` - Number of lines (default: 4)
- All standard `TextInput` props

##### Usage
```tsx
<MultilineTextInput
  label="Comments"
  placeholder="Enter your comments here..."
  numberOfLines={6}
  value={comments}
  onChangeText={setComments}
  error={commentsError}
/>
```

---

### 🎨 SplashScreen Component (`SplashScreen.tsx`)
Loading screen with SchoolWay logo and theme integration.

#### Import
```tsx
import { SplashScreenSchoolway } from './components/SplashScreen';
// or
import SplashScreenSchoolway from './components/SplashScreen';
```

#### Usage
```tsx
// In your app navigation or main component
<SplashScreenSchoolway />
```

---

## 🎨 Theme Integration

All components use the app's theme system. Make sure to wrap your app with the `ThemeProvider`:

```tsx
import { ThemeProvider } from './theme/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

## 🎯 Common Patterns

### Form Validation
```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
});

const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.name) newErrors.name = 'Name is required';
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (validateForm()) {
    // Form is valid, submit data
    console.log('Form submitted:', formData);
  }
};

// In your render:
<TextInputComponent
  label="Name"
  value={formData.name}
  onChangeText={(text) => setFormData({...formData, name: text})}
  error={errors.name}
/>
```

### Focus Management
```tsx
const [activeInput, setActiveInput] = useState(null);

// All input components automatically handle focus states
// The focused input will have a yellow border
```

### Accessibility
All components include proper accessibility features:
- Proper labeling
- Screen reader support
- Keyboard navigation
- Focus indicators

## 🎨 Styling

### Component Features
- ✅ Theme-based colors and spacing
- ✅ Consistent border radius and typography
- ✅ Focus states with yellow borders
- ✅ Error states with red borders
- ✅ Disabled states with gray backgrounds
- ✅ Proper contrast ratios

### Customization
Components use theme values, so changes to the theme will automatically apply to all components. See `theme/theme.tsx` for available theme properties.

## 🚀 Best Practices

1. **Always provide labels** for accessibility
2. **Use error prop** for form validation feedback
3. **Handle loading states** in your components
4. **Test on different screen sizes** - components are responsive
5. **Use consistent spacing** - components use theme spacing values
6. **Provide meaningful placeholders** to guide users

## 📱 Testing

Components work well with popular testing libraries:

```tsx
// Example with React Native Testing Library
import { render, fireEvent } from '@testing-library/react-native';
import { TextInputComponent } from './components/inputs';

test('should handle text input', () => {
  const onChangeText = jest.fn();
  const { getByPlaceholderText } = render(
    <TextInputComponent
      placeholder="Enter text"
      onChangeText={onChangeText}
    />
  );
  
  fireEvent.changeText(getByPlaceholderText('Enter text'), 'Hello');
  expect(onChangeText).toHaveBeenCalledWith('Hello');
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Theme not applied**: Ensure your app is wrapped with `ThemeProvider`
2. **Focus not working**: Check if you're overriding the `onFocus`/`onBlur` props
3. **Dropdown not opening**: Verify the `options` prop is properly formatted
4. **Code input not working**: Ensure you're handling the `onCodeChange` callback

### Support
For questions or issues, please check the theme configuration in `theme/theme.tsx` and ensure all dependencies are properly installed.

---

*Last updated: July 2025*
