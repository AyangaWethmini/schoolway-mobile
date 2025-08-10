import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import { baseStyles } from "../theme/theme";
import { useTheme } from "../theme/ThemeContext";
import SWText from "./SWText";

//button props
interface ButtonProps extends PressableProps {
    title : string;
    varient : 
    'primary' | 'primaryDark' | 'secondary' | 'secondaryDark' | 
    'primary-transparent' |'secondary-transparent' |'primaryDark-transparent' | 'secondaryDark-transparent' | 'outlined-primary' | 'outlined-primaryDark' | 'outlined-secondary' | 'outlined-secondaryDark';
    disabled? : boolean;
    passstyles? : object | null; 
}


export const Button = ({title, varient = 'primary', passstyles=null, disabled = false, ...props} : ButtonProps) => {
    
    const { theme } = useTheme();

    //styles based on varient
    const buttonStyles = StyleSheet.create({
        button: {
            ...baseStyles.button,
            paddingVertical: theme.spacing.md, // Increased vertical padding
            borderRadius: theme.borderRadius.large, // Increased border radius
            backgroundColor: 
                           varient === 'primary' ? theme.colors.primary : 
                           varient === 'secondary' ? theme.colors.secondary : 
                           varient === 'secondaryDark' ? theme.colors.secondaryDark :
                           varient === 'primaryDark' ? theme.colors.accentblue :
                           'transparent',
            borderColor:
                        varient === 'outlined-primary' ? theme.colors.primary :
                        varient === 'outlined-primaryDark' ? theme.colors.accentblue :
                        varient === 'outlined-secondary' ? theme.colors.secondary :
                        varient === 'outlined-secondaryDark' ? theme.colors.secondaryDark :
                        'transparent',
            borderWidth: (varient === 'outlined-primary' || varient === 'outlined-secondary' ||  varient === 'outlined-primaryDark' ||  varient === 'outlined-secondaryDark') ? 2 : 0, // Increased border width for better contrast
            opacity: disabled ? 0.6 : 1,
        },
        text: {
            color: 
                   varient === 'outlined-primary' ? theme.colors.primary : 
                   varient === 'outlined-primaryDark' ? theme.colors.accentblue : 
                   varient === 'outlined-secondary' ? theme.colors.secondary :
                   varient === 'outlined-secondaryDark' ? theme.colors.secondaryDark : 
                   varient === 'primary-transparent' ? theme.colors.primary :
                   varient === 'secondary-transparent' ? theme.colors.secondary :
                   theme.colors.textwhite,
        }
    });

    return (
        <Pressable
            style={({ pressed }) => [
            buttonStyles.button,
            pressed && { opacity: 0.7 }, passstyles 
            ]}
            disabled={disabled}
            {...props}
        >
            <SWText button style={[buttonStyles.text]}>{title}</SWText>
        </Pressable>
    );
}

export default Button;

