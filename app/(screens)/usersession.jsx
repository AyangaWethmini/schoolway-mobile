import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AuthService from '../auth/AuthService';

const UserDataShow = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expiresAt, setExpiresAt] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await AuthService.getStoredSession();
                if (data) {
                    setUserData(data);
                    console.log('User data:', data);
                    setExpiresAt(data.expires);
                } else {
                    console.log('No session data found');
                    setExpiresAt('No session');
                }
            } catch (error) {
                console.error('Error fetching session:', error);
                setExpiresAt('Error loading session');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading session...</Text>
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text>No session data found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stored Session Data:</Text>
            <Text style={{color:'#333'}}>User ID: {userData.user?.id}</Text>
            <Text>Email: {userData.user?.email}</Text>
            <Text>Name: {userData.user?.name}</Text>
            <Text>Role: {userData.user?.role}</Text>
            <Text>Expires: {expiresAt}</Text>
            <Pressable onPress={AuthService.signOut}>
                <View style={{ marginTop: 16 }}>
                    <Text style={{ color: '#888' }}>Session ID: {userData.user?.id}</Text>
                </View>
            </Pressable>
        </View>
    );
};

export default UserDataShow;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
});