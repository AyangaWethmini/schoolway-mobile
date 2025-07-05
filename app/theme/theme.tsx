import { StyleSheet } from "react-native";


//Defining the theme typess
export interface Theme {
    colors : {
        primary : string;
        secondary : string;
        accentblue : string;
        backgroud : string;
        textblack : string;
        textwhite : string;
        textgreydark : string;
        textgreylight : string;
        error : string;
    };

    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        
    };

    fontSizes : {
        small : number;
        medium : number;
        large : number;
    };

    borderRadius : {
        small : number;
        medium : number;
        large : number;
    };
};


/*________________________________ LIGHT THEME_______________________________*/



export const lightTheme: Theme = {
    colors : {
        primary: "#FFC825",
        secondary: "#030303",
        accentblue: "#2B3674",
        backgroud: "#FAF8F8",
        textblack: "#090A0A",
        textwhite : "#ffffff",
        textgreydark: "#71727A",
        textgreylight: "#8F9098",
        error: "#FF0000"
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },

    fontSizes: {
        small: 12,
        medium: 16,
        large: 20,
    },

    borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
    }
}


export const baseStyles = StyleSheet.create({
    button : {
        paddingVertical : lightTheme.spacing.sm,
        paddingHorizontal: lightTheme.spacing.md,
        borderRadius: lightTheme.borderRadius.medium,
        alignItems : 'center',
        justifyContent : 'center',
        fontSize : lightTheme.fontSizes.medium,
        fontWeight : '600',
    }, 

    input : {
        borderWidth : 1,
        borderRadius : lightTheme.borderRadius.medium,
        padding : lightTheme.spacing.sm,
        fontSize : lightTheme.fontSizes.medium,
    }


})

export default lightTheme;
