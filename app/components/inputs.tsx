import React, { useState } from "react";

import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View
} from "react-native";

import { useTheme } from "../theme/ThemeContext";

// Base Input Props
interface BaseInputProps extends TextInputProps {
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    passstyle?: object; // Allows passing additional styles
}

// Text Input Component
interface TextInputComponentProps extends BaseInputProps {
    variant?: 'default' | 'outlined';
    passstyle?: object; // Allows passing additional styles
}

export const TextInputComponent = ({
    label,
    placeholder,
    error,
    passstyle,
    disabled = false,
    variant = 'outlined',
    ...props
}: TextInputComponentProps) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    
    const inputStyles = StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.textblack,
            marginBottom: theme.spacing.xs,
            fontWeight: '600',
        },
        input: {
            borderWidth: 1,
            borderColor: error ? theme.colors.error : 
                        isFocused ? theme.colors.primary : 
                        theme.colors.textgreylight,
            borderRadius: theme.borderRadius.medium,
            padding: theme.spacing.sm,
            fontSize: theme.fontSizes.medium,
            backgroundColor: disabled ? theme.colors.textgreylight : theme.colors.backgroud,
            color: theme.colors.textblack,
            minHeight: 50,
        },
        error: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
        },
    });

    return (
        <View style={[inputStyles.container, { justifyContent: 'center' }]}>
            {label && <Text style={inputStyles.label}>{label}</Text>}
            <TextInput
                style={[inputStyles.input, passstyle]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textgreylight}
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error && <Text style={inputStyles.error}>{error}</Text>}
        </View>
    );
};

// Password Input Component
interface PasswordInputProps extends BaseInputProps {
    showPasswordToggle?: boolean;
}

export const PasswordInput = ({
    label,
    placeholder,
    error,
    passstyle,
    disabled = false,
    showPasswordToggle = true,
    ...props
}: PasswordInputProps) => {
    const { theme } = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputStyles = StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.textblack,
            marginBottom: theme.spacing.xs,
            fontWeight: '600',
        },
        inputContainer: {
            position: 'relative',
        },
        input: {
            borderWidth: 1,
            borderColor: error ? theme.colors.error : 
                        isFocused ? theme.colors.primary : 
                        theme.colors.textgreylight,
            borderRadius: theme.borderRadius.medium,
            padding: theme.spacing.sm,
            paddingRight: showPasswordToggle ? 50 : theme.spacing.sm,
            fontSize: theme.fontSizes.medium,
            backgroundColor: disabled ? theme.colors.textgreylight : theme.colors.backgroud,
            color: theme.colors.textblack,
            minHeight: 50,
        },
        toggleButton: {
            position: 'absolute',
            right: theme.spacing.sm,
            top: '50%',
            transform: [{ translateY: -10 }],
        },
        toggleText: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.textgreydark,
        },
        error: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
        },
    });

    return (
        <View style={inputStyles.container}>
            {label && <Text style={inputStyles.label}>{label}</Text>}
            <View style={inputStyles.inputContainer}>
                <TextInput
                    style={inputStyles.input}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textgreylight}
                    secureTextEntry={!isPasswordVisible}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {showPasswordToggle && (
                    <TouchableOpacity
                        style={inputStyles.toggleButton}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Text style={inputStyles.toggleText}>
                            {isPasswordVisible ? '🙈' : '👁️'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={inputStyles.error}>{error}</Text>}
        </View>
    );
};

// Dropdown/Select Input Component
interface DropdownInputProps extends BaseInputProps {
    options: { label: string; value: string | number }[];
    selectedValue?: string | number;
    onSelect: (value: string | number) => void;
}

export const DropdownInput = ({
    label,
    placeholder,
    error,
    disabled = false,
    options,
    selectedValue,
    onSelect,
    ...props
}: DropdownInputProps) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const selectedOption = options.find(option => option.value === selectedValue);
    
    const inputStyles = StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.textblack,
            marginBottom: theme.spacing.xs,
            fontWeight: '600',
        },
        input: {
            borderWidth: 1,
            borderColor: error ? theme.colors.error : 
                        isFocused ? theme.colors.primary : 
                        theme.colors.textgreylight,
            borderRadius: theme.borderRadius.medium,
            padding: theme.spacing.sm,
            fontSize: theme.fontSizes.medium,
            backgroundColor: disabled ? theme.colors.textgreylight : theme.colors.backgroud,
            color: theme.colors.textblack,
            minHeight: 50,
            justifyContent: 'center',
        },
        inputText: {
            fontSize: theme.fontSizes.medium,
            color: selectedOption ? theme.colors.textblack : theme.colors.textgreylight,
        },
        error: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
        },
        modal: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
            backgroundColor: theme.colors.backgroud,
            borderRadius: theme.borderRadius.medium,
            padding: theme.spacing.md,
            width: '80%',
            maxHeight: '50%',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
        },
        modalTitle: {
            fontSize: theme.fontSizes.medium,
            fontWeight: '600',
            color: theme.colors.textblack,
        },
        closeButton: {
            padding: theme.spacing.xs,
        },
        closeButtonText: {
            fontSize: 18,
            color: theme.colors.textgreydark,
        },
        option: {
            padding: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.textgreylight,
        },
        optionText: {
            fontSize: theme.fontSizes.medium,
            color: theme.colors.textblack,
        },
    });

    return (
        <View style={inputStyles.container}>
            {label && <Text style={inputStyles.label}>{label}</Text>}
            <TouchableOpacity
                style={inputStyles.input}
                onPress={() => {
                    if (!disabled) {
                        setIsVisible(true);
                        setIsFocused(true);
                    }
                }}
                disabled={disabled}
            >
                <Text style={inputStyles.inputText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
            </TouchableOpacity>
            {error && <Text style={inputStyles.error}>{error}</Text>}
            
            <Modal
                visible={isVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setIsVisible(false);
                    setIsFocused(false);
                }}
            >
                <TouchableOpacity 
                    style={inputStyles.modal}
                    activeOpacity={1}
                    onPress={() => {
                        setIsVisible(false);
                        setIsFocused(false);
                    }}
                >
                    <TouchableOpacity 
                        style={inputStyles.modalContent}
                        activeOpacity={1}
                        onPress={() => {}} // Prevent modal from closing when tapping content
                    >
                        <View style={inputStyles.modalHeader}>
                            <Text style={inputStyles.modalTitle}>
                                {label || 'Select an option'}
                            </Text>
                            <TouchableOpacity 
                                style={inputStyles.closeButton}
                                onPress={() => {
                                    setIsVisible(false);
                                    setIsFocused(false);
                                }}
                            >
                                <Text style={inputStyles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={inputStyles.option}
                                    onPress={() => {
                                        onSelect(item.value);
                                        setIsVisible(false);
                                        setIsFocused(false);
                                    }}
                                >
                                    <Text style={inputStyles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

// Code Input Component (for OTP/Verification)
interface CodeInputProps {
    length?: number;
    onCodeChange: (code: string) => void;
    label?: string;
    error?: string;
}

export const CodeInput = ({
    length = 4,
    onCodeChange,
    label,
    error,
}: CodeInputProps) => {
    const { theme } = useTheme();
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    
    const inputStyles = StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.textblack,
            marginBottom: theme.spacing.xs,
            fontWeight: '600',
            textAlign: 'center',
        },
        codeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.sm,
        },
        codeInput: {
            borderWidth: 2,
            borderColor: theme.colors.primary,
            borderRadius: theme.borderRadius.medium,
            width: 50,
            height: 50,
            textAlign: 'center',
            fontSize: theme.fontSizes.large,
            color: theme.colors.textblack,
            backgroundColor: theme.colors.backgroud,
        },
        error: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
            textAlign: 'center',
        },
    });

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        onCodeChange(newCode.join(''));
    };

    return (
        <View style={inputStyles.container}>
            {label && <Text style={inputStyles.label}>{label}</Text>}
            <View style={inputStyles.codeContainer}>
                {Array(length).fill(0).map((_, index) => (
                    <TextInput
                        key={index}
                        style={inputStyles.codeInput}
                        maxLength={1}
                        keyboardType="numeric"
                        value={code[index]}
                        onChangeText={(text) => handleCodeChange(text, index)}
                    />
                ))}
            </View>
            {error && <Text style={inputStyles.error}>{error}</Text>}
        </View>
    );
};

// Multiline Text Input Component
interface MultilineTextInputProps extends BaseInputProps {
    numberOfLines?: number;
}

export const MultilineTextInput = ({
    label,
    placeholder,
    error,
    disabled = false,
    numberOfLines = 4,
    ...props
}: MultilineTextInputProps) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    
    const inputStyles = StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.textblack,
            marginBottom: theme.spacing.xs,
            fontWeight: '600',
        },
        input: {
            borderWidth: 1,
            borderColor: error ? theme.colors.error : 
                        isFocused ? theme.colors.primary : 
                        theme.colors.textgreylight,
            borderRadius: theme.borderRadius.medium,
            padding: theme.spacing.sm,
            fontSize: theme.fontSizes.medium,
            backgroundColor: disabled ? theme.colors.textgreylight : theme.colors.backgroud,
            color: theme.colors.textblack,
            minHeight: numberOfLines * 20 + 20,
            textAlignVertical: 'top',
        },
        error: {
            fontSize: theme.fontSizes.small,
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
        },
    });

    return (
        <View style={inputStyles.container}>
            {label && <Text style={inputStyles.label}>{label}</Text>}
            <TextInput
                style={inputStyles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textgreylight}
                multiline={true}
                numberOfLines={numberOfLines}
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {error && <Text style={inputStyles.error}>{error}</Text>}
        </View>
    );
};

export default TextInputComponent;
