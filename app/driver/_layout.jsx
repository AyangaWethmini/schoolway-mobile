import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import { useAuth } from '../auth/AuthContext';
import DriverProtected from '../auth/DriverProtected';
import { lightTheme } from '../theme/theme';

const DashboardLayout = () => {
    const { user } = useAuth();
    const theme = lightTheme.navbar;

if (user?.approvalstatus !== 1) {
    console.log('User is not approved val == 0, showing only profile tab');
    return (
        <DriverProtected>
            <Tabs
                screenOptions={{
                    headerShown: false,
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
                {/* Hide the DriverComponents folder from tabs */}
                <Tabs.Screen 
                    name="DriverComponents" 
                    options={{ 
                        href: null,
                        tabBarStyle: { display: 'none' } // This will hide tab bar when navigating to DriverComponents
                    }} 
                />
            </Tabs>
        </DriverProtected>
    );
}

return (
    <DriverProtected>
        <Tabs 
            screenOptions={{
                headerShown: false,
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
            
            {/* Hide the DriverComponents folder from tabs */}
            <Tabs.Screen 
    name="DriverComponents" 
    options={{ 
        href: null,
        headerShown: false, // This ensures no header when navigating to DriverComponents
    }} 
/>
        </Tabs>
    </DriverProtected>
);
}

export default DashboardLayout