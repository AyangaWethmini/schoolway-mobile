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

    link: {
        color: string;
    }

    navbar: {
        headerBg: string;
        // backgroundColor: string;
        // textColor: string;
        // iconColor: string;
        iconActive: string;
        iconInactive: string;
        iconActiveBg: string;
        iconActiveBlack: string;
        iconActiveBlue: string;
    }
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
        textgreydark: "#5E5F66",
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
    },

    link: {
        color: "#006FFD"
    },
    navbar:{
        headerBg:'#FFC825',

        iconInactive: '#AAA', // Yellow for active icons
        iconActive: '#FFC825', // Dark Blue for inactive icons
        iconActiveBg: '#F0F0F0', // Light Gray for active icon background
        iconActiveBlack: '#000', // Black for active icons in light mode
        iconActiveBlue: '#2B3674', // Dark Blue for active icons in light mode

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
    },
    link: {
        color: lightTheme.link.color,
    }


})

export default lightTheme;
