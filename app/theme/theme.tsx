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

        // status tag colors
        statusorange : string;
        statusbackgroundorange : string;
        statusblue : string;
        statusbackgroundblue : string;
        statusgreen : string;
        statusbackgroundgreen : string;
        statusgrey : string;
        statusbackgroundgrey : string;
        statusred : string;
        statusbackgroundred : string;
    

        backgroundLightGreen: String,
        backgroundLightRed: String,
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
    },
    fonts: {
        regular: string;
        // mono: string;
        uberBold: string;
        uberMedium: string;
    };

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

    fontFamily : {
        regular : string;
        bold : string;
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
        textgreydark: "#71727A",
        textgreylight: "#8F9098",
        error: "#FF0000",


        statusorange : "#FFA500",
        statusbackgroundorange : "#FFF3E0",
        statusblue : "#2195f3",
        statusbackgroundblue : "#E8F5E8", 
        statusgreen : "#4CAF50", 
        statusbackgroundgreen :  "#E8F5E8",
        statusgrey : "#757575",
        statusbackgroundgrey : "#F5F5F5",
        statusred: "#F44336",               
        statusbackgroundred: "#FFEBEE",


        //for calendar
        backgroundLightGreen: "#83f28f",
        backgroundLightRed: "#ee6b6e",
    },

    fontFamily : {
        regular: 'UberMove-medium',
        bold: 'UberMove-medium', // or another variant if you have one
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
    fonts: {
        regular: "Inter",
        // mono: "SpaceMono",
        uberBold: "UberMove-Bold",
        uberMedium: "UberMove-Medium",
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
    },

    // uppercase small tag styles (this is used in parent dashboard UI in a card which displays the grade of the child).

    smalltagcontainer:{
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },

    smalltagcontent:{
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },


})

export default lightTheme;
