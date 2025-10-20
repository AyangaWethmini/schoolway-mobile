import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import ParentProtected from '../../auth/ParentProtected';
import { lightTheme } from '../../theme/theme';


const DashboardLayout = () => {
    const theme = lightTheme.navbar;

    return (
        <ParentProtected>
            <Tabs 
                screenOptions={{
                    headerShown: false,
                    headerBackVisible: false,
                    tabBarStyle: { 
                        backgroundColor: '#ffffff',
                        paddingTop: 5,
                        paddingBottom: 0,
                        height: 60,
                        borderTopWidth: 0,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: -2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                    },
                    tabBarActiveTintColor: theme.iconActiveBlue,
                    tabBarInactiveTintColor: theme.iconInactive,
                    tabBarLabelStyle: {
                        fontFamily: 'UberMove-Medium',
                        fontSize: 12,
                    }
                }}
            >
                <Tabs.Screen 
                    name="dashboard" 
                    options={{ 
                        title: 'Home', 
                        headerShown: false,
                        tabBarIcon: ({focused}) => (
                            <Ionicons name={"home"} size={24} color={focused ? theme.iconActiveBlue : theme.iconInactive}/>
                        ) 
                    }} 
                />
                <Tabs.Screen 
                    name="map" 
                    options={{ 
                        title: 'Map',
                        headerShown: false,
                        tabBarIcon: ({focused}) => (
                            <FontAwesome6 name="map-location-dot" size={24} color={focused ? theme.iconActiveBlue : theme.iconInactive} />
                        )
                    }} 
                />
                <Tabs.Screen 
                    name="payments" 
                    options={{ 
                        title: 'Payments',
                        headerShown: false,
                        tabBarIcon: ({focused}) => (
                            <Ionicons name="wallet" size={24} color={focused ? theme.iconActiveBlue : theme.iconInactive} />
                        )
                    }} 
                />
                <Tabs.Screen 
                    name="profile" 
                    options={{ 
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({focused}) => (
                            <Ionicons name={"person"} size={24} color={focused ? theme.iconActiveBlue : theme.iconInactive} />
                        )
                    }} 
                />
            </Tabs>
        </ParentProtected>
    );
};


export default DashboardLayout;