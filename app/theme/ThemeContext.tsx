import React, { createContext, useContext, useState, ReactNode, Children } from "react";
import { lightTheme, Theme } from "./theme";
// import { ThemeContext } from "@react-navigation/native";

//Defining the context type
interface ThemeContextType {
    theme : Theme;
    toggleTheme : () => void;
}

//Creating the context
const context = createContext<ThemeContextType |  undefined > (undefined);


//theme provider components

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(lightTheme);

    // Toggle theme function (currently just toggles between lightTheme and itself)
    const toggleTheme = () => {
        // Replace 'lightTheme' with your actual dark theme variable when available
        setTheme(prevTheme => prevTheme === lightTheme ? lightTheme : lightTheme);
    };

    return (
        <context.Provider value={{theme, toggleTheme}}>{children}</context.Provider>
    );
};



//hook to access the theme

export const useTheme = () => {
    const ctx = useContext(context);
    if(!ctx) {
        throw new Error('useTheme must be within the theme provider');
        
    }

    return ctx;
}

export default useTheme;

