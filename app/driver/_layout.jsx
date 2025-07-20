import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
// import { Colors } from '../../constants/Colors';
import { lightTheme } from '../theme/theme';
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAuth } from '../auth/AuthContext';
import DriverProtected from '../auth/DriverProtected';

const DashboardLayout = () => {
    const { user } = useAuth();
    // const colorTheme = useColorScheme();
    // const theme = Colors[colorTheme] ?? Colors.light;
    const theme = lightTheme.navbar;

if (user?.approvalstatus !== 1) {
    console.log('User is not approved val == 0, showing only profile tab');
    return (
        <DriverProtected>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    headerStyle: { backgroundColor: theme.headerBg },
                    headerTintColor: theme.text,
                    headerTitleStyle: { fontWeight: 'bold' },
                    tabBarStyle: {
                        backgroundColor: '#ffffff',
                        paddingTop: 5,
                        paddingBottom: 0,
                        height: 60,
                    },
                    tabBarActiveTintColor: theme.iconActiveBlue,
                    tabBarInactiveTintColor: theme.iconInactive,
                }}
            >
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        headerTitle: 'Driver Profile',
                        tabBarIcon: ({ focused }) => (
                            <Ionicons name={"person"} size={24} color={focused ? theme.iconActiveBlue : theme.iconInactive} />
                        )
                    }}
                />
                <Tabs.Screen name="dashboard" options={{ href: null }} />
                <Tabs.Screen name="map" options={{ href: null }} />
                <Tabs.Screen name="payments" options={{ href: null }} />
                <Tabs.Screen name="DriverComponents/EditProfile" options={{ href: null }} />

            </Tabs>
        </DriverProtected>
    );
}

return (
    <DriverProtected>
        <Tabs 
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: theme.headerBg },
                headerTintColor: theme.text,
                headerTitleStyle: { fontWeight: 'bold' }, 
                tabBarStyle: { 
                    backgroundColor: '#ffffff',
                    paddingTop: 5,
                    paddingBottom: 0,
                    height: 60,
                },
                tabBarActiveTintColor: theme.iconActiveBlue,
                tabBarInactiveTintColor: theme.iconInactive,
            }}
        >
            <Tabs.Screen 
                name="dashboard" 
                options={{ 
                    title: 'Home', 
                    headerTitle: 'Dashboard',
                    tabBarIcon: ({focused})=> (
                        <Ionicons name={"home"} size={24} color={focused? theme.iconActiveBlue : theme.iconInactive}/>
                    )
                }} 
            />
            <Tabs.Screen 
                name="map" 
                options={{ 
                    title: 'Map',
                    headerTitle: 'Route Map',
                    tabBarIcon: ({focused}) => (
                        <FontAwesome6 name="map-location-dot" size={24} color={focused ? theme.iconActiveBlue : theme.iconInactive} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="payments" 
                options={{ 
                    title: 'Payments',
                    headerTitle: 'Payment History',
                    tabBarIcon: ({focused}) => (
                        <Ionicons name="wallet" size={24} color={focused? theme.iconActiveBlue : theme.iconInactive} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="profile" 
                options={{ 
                    title: 'Profile',
                    headerTitle: 'Driver Profile', 
                    tabBarIcon: ({focused}) => (
                        <Ionicons name={"person"} size={24} color={focused? theme.iconActiveBlue : theme.iconInactive} />
                    )
                }} 
            />
            
            <Tabs.Screen name="DriverComponents/EditProfile" options={{ href: null }} />
            
        </Tabs>
    </DriverProtected>
);
}

export default DashboardLayout