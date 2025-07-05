import React from "react";
import { Pressable, Text, StyleSheet, PressableProps } from "react-native";
import { baseStyles } from "../theme/theme";
import { useTheme } from "../theme/ThemeContext";

//button props
interface ButtonProps extends PressableProps {
    title : string;
    varient : 'primary' | 'secondary' | 'outlined-yellow' | 'outlined-black';
    disabled? : boolean;
}


export const Button = ({title, varient = 'primary', disabled = false, ...props} : ButtonProps) => {
    
    const { theme } = useTheme();

    //styles based on varient
    const buttonStyles = StyleSheet.create({
        button: {
            ...baseStyles.button,
            paddingVertical: theme.spacing.md, // Increased vertical padding
            borderRadius: theme.borderRadius.large, // Increased border radius
            backgroundColor: varient === 'primary' ? theme.colors.primary : 
                           varient === 'secondary' ? theme.colors.secondary : 
                           'transparent',
            borderColor: varient === 'outlined-yellow' ? theme.colors.primary :
                        varient === 'outlined-black' ? theme.colors.textblack :
                        'transparent',
            borderWidth: (varient === 'outlined-yellow' || varient === 'outlined-black') ? 2 : 0, // Increased border width for better contrast
            opacity: disabled ? 0.6 : 1,
        },
        text: {
            color: varient === 'primary' ? theme.colors.textblack : 
                   varient === 'secondary' ? theme.colors.textwhite : 
                   varient === 'outlined-yellow' ? theme.colors.textblack : // Changed to black for better contrast
                   varient === 'outlined-black' ? theme.colors.textblack :
                   theme.colors.primary,
        }
    });

    return (
        <Pressable 
            style={buttonStyles.button}
            disabled={disabled}
            {...props}
        >
            <Text style={buttonStyles.text}>{title}</Text>
        </Pressable>
    );
}

export default Button;

