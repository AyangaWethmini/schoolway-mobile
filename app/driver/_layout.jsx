import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
// import { Colors } from '../../constants/Colors';
import { lightTheme } from '../theme/theme';
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const DashboardLayout = () => {
    // const colorTheme = useColorScheme();
    // const theme = Colors[colorTheme] ?? Colors.light;
    const theme = lightTheme.navbar;

return (
    <Tabs 
        screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: theme.headerBg },
            headerTintColor: theme.text,
            headerTitleStyle: { fontWeight: 'bold' }, 
            tabBarStyle: { 
                backgroundColor: '#ffffff',
                paddingTop: 10,
                height: 80,
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
    </Tabs>
)
}

export default DashboardLayout