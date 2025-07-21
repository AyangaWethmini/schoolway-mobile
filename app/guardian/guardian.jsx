import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    FlatList
} from 'react-native';
import { useTheme } from "../theme/ThemeContext";

const SchoolGuardian = ({ navigation }) => {
    const { theme } = useTheme();
    const router = useRouter();

    const [showStudentList, setShowStudentList] = useState(false);
    const [scannedDriverData, setScannedDriverData] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    // Mock data for demonstration - replace with actual data
    const mockDriverData = {
        id: 1,
        name: 'Kamal Perera',
        vanNumber: 'WP CAB-1234',
        phone: '+94 77 123 4567',
        students: [
            { id: 1, name: 'John Doe', grade: 'Grade 10', pickupTime: '3:00 PM', status: 'Present' },
            { id: 2, name: 'Jane Smith', grade: 'Grade 9', pickupTime: '3:00 PM', status: 'Present' },
            { id: 3, name: 'Mike Johnson', grade: 'Grade 11', pickupTime: '3:00 PM', status: 'Absent' },
            { id: 4, name: 'Sarah Williams', grade: 'Grade 8', pickupTime: '3:00 PM', status: 'Present' },
            { id: 5, name: 'David Brown', grade: 'Grade 10', pickupTime: '3:00 PM', status: 'Present' }
        ]
    };

    const handleScanQR = () => {
        setIsScanning(true);

        // Simulate QR code scanning process
        setTimeout(() => {
            setIsScanning(false);

            // Simulate successful scan
            Alert.alert(
                'QR Code Scanned Successfully',
                `Driver: ${mockDriverData.name}\nVan: ${mockDriverData.vanNumber}`,
                [
                    {
                        text: 'View Students',
                        onPress: () => {
                            setScannedDriverData(mockDriverData);
                            setShowStudentList(true);
                        }
                    },
                    {
                        text: 'OK',
                        style: 'default'
                    }
                ]
            );
        }, 2000);
    };

    const handleViewProfile = () => {
        Alert.alert('Profile', 'Navigate to guardian profile page');
        // router.push('/guardian/profile');
    };

    const handlePrivateHires = () => {
        Alert.alert('Private Hires', 'Navigate to private hires page');
        // router.push('/guardian/privateHires');
    };

    const renderStudentItem = ({ item }) => (
        <View style={styles.studentItem}>
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentGrade}>{item.grade}</Text>
                <Text style={styles.pickupTime}>Pickup: {item.pickupTime}</Text>
            </View>
            <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'Present' ? '#4CAF50' : '#FF5722' }
            ]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </View>
    );

    const renderStudentListModal = () => (
        <Modal
            visible={showStudentList}
            animationType="slide"
            transparent={false}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={[styles.modalHeader, { backgroundColor: theme.colors.primary }]}>
                    <TouchableOpacity
                        onPress={() => setShowStudentList(false)}
                        style={styles.closeButton}
                    >
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Students List</Text>
                </View>

                {scannedDriverData && (
                    <View style={styles.driverInfoHeader}>
                        <Text style={styles.driverName}>{scannedDriverData.name}</Text>
                        <Text style={styles.vanNumber}>Van: {scannedDriverData.vanNumber}</Text>
                        <Text style={styles.totalStudents}>
                            Total Students: {scannedDriverData.students.length}
                        </Text>
                    </View>
                )}

                <FlatList
                    data={scannedDriverData?.students || []}
                    renderItem={renderStudentItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.studentsList}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.headerTitle}>School Guardian</Text>
                    <TouchableOpacity onPress={handleViewProfile} style={styles.profileButton}>
                        <Ionicons name="person-circle" size={28} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Welcome, Guardian!</Text>
                    <Text style={styles.welcomeSubtext}>
                        Scan QR codes to manage student pickups and view driver information
                    </Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsContainer}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    {/* QR Scanner Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.scanButton]}
                        onPress={handleScanQR}
                        disabled={isScanning}
                    >
                        <View style={styles.buttonContent}>
                            <Ionicons
                                name={isScanning ? "hourglass" : "qr-code-outline"}
                                size={32}
                                color="#fff"
                            />
                            <View style={styles.buttonText}>
                                <Text style={styles.buttonTitle}>
                                    {isScanning ? 'Scanning...' : 'Scan QR Code'}
                                </Text>
                                <Text style={styles.buttonSubtitle}>
                                    {isScanning ? 'Please wait' : 'Scan driver or parent QR code'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Private Hires Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.hiresButton]}
                        onPress={handlePrivateHires}
                    >
                        <View style={styles.buttonContent}>
                            <Ionicons name="car-outline" size={32} color="#fff" />
                            <View style={styles.buttonText}>
                                <Text style={styles.buttonTitle}>Private Hires</Text>
                                <Text style={styles.buttonSubtitle}>Manage private transportation</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity */}
                <View style={styles.recentActivity}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.activityCard}>
                        <View style={styles.activityIcon}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Van WP CAB-1234 Scanned</Text>
                            <Text style={styles.activityTime}>2 minutes ago</Text>
                        </View>
                    </View>

                    <View style={styles.activityCard}>
                        <View style={styles.activityIcon}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Van WP CAB-5678 Scanned</Text>
                            <Text style={styles.activityTime}>15 minutes ago</Text>
                        </View>
                    </View>
                </View>

                {/* Statistics */}
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Today's Statistics</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>12</Text>
                            <Text style={styles.statLabel}>QR Scans</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>45</Text>
                            <Text style={styles.statLabel}>Students</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>8</Text>
                            <Text style={styles.statLabel}>Vans</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {renderStudentListModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    profileButton: {
        padding: 5,
    },
    welcomeSection: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 5,
    },
    welcomeSubtext: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    actionsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    actionButton: {
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    scanButton: {
        backgroundColor: '#4CAF50',
    },
    hiresButton: {
        backgroundColor: '#2196F3',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    buttonText: {
        marginLeft: 15,
        flex: 1,
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
    },
    buttonSubtitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    recentActivity: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    activityIcon: {
        marginRight: 15,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    activityTime: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4CAF50',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    closeButton: {
        padding: 5,
        marginRight: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    driverInfoHeader: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    driverName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 5,
    },
    vanNumber: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    totalStudents: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '500',
    },
    studentsList: {
        flex: 1,
        padding: 20,
    },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 3,
    },
    studentGrade: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    pickupTime: {
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
});

export default SchoolGuardian;