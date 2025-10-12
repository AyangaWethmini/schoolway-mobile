import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Button } from "../components/button";
import { MultilineTextInput } from '../components/inputs';
import SWText from '../components/SWText';
import { useTheme } from "../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const AddReview = ({ navigation, onBack }) => {
    const { theme } = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams(); // Get child ID from route params

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewType, setReviewType] = useState('DRIVER'); // 'DRIVER' or 'VAN_SERVICE'
    const [childId, setChildId] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const [vanId, setVanId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data from API
    const [currentDriver, setCurrentDriver] = useState({
        id: null,
        name: 'Loading...',
        photo: null,
        vanNumber: 'Loading...',
        phone: 'Loading...',
        experience: 'Loading...'
    });

    const [currentVanService, setCurrentVanService] = useState({
        id: null,
        name: 'Loading...',
        contact: 'Loading...',
        serviceRegNumber: 'Loading...'
    });

    // Initialize data when component mounts
    useEffect(() => {
        console.log('AddReview mounted with id:', id);
        
        // Add a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (loading) {
                console.log('Loading timeout reached, stopping loading');
                setLoading(false);
            }
        }, 10000); // 10 second timeout
        
        if (id) {
            setChildId(parseInt(id)); // Use the child ID from route params
            fetchChildData(parseInt(id));
        } else {
            console.log('No ID provided, showing error message');
            Alert.alert(
                'Error', 
                'Child ID is required to add a review. Please navigate from a child\'s profile.',
                [
                    { text: 'OK', onPress: () => router.back() }
                ]
            );
            setLoading(false);
        }
        
        return () => clearTimeout(timeout);
    }, [id]);

    const fetchChildData = async (childId) => {
        try {
            setLoading(true);
            console.log('Fetching child data for ID:', childId);
            console.log('API URL:', `${API_URL}/child/childView/${childId}`);
            
            // Fetch child data to get van and driver information
            const response = await fetch(`${API_URL}/child/childView/${childId}`);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`Failed to fetch child data: ${response.status} ${response.statusText}`);
            }
            
            const childData = await response.json();
            console.log('Fetched child data:', childData);
            
            // Set van ID from child data
            if (childData.vanID) {
                setVanId(childData.vanID);
                console.log('Set van ID:', childData.vanID);
            }
            
            // If child has a van, get driver and van service info
            if (childData.Van) {
                const van = childData.Van;
                console.log('Child has van:', van);
                
                // Set driver info if van has assigned driver
                if (van.assignedDriverId) {
                    const driverInfo = {
                        id: van.assignedDriverId,
                        name: (van.UserProfile_Van_assignedDriverIdToUserProfile?.firstname || '') + ' ' + (van.UserProfile_Van_assignedDriverIdToUserProfile?.lastname || '') || 'Driver',
                        photo: van.UserProfile_Van_assignedDriverIdToUserProfile?.dp,
                        vanNumber: van.registrationNumber,
                        phone: van.UserProfile_Van_assignedDriverIdToUserProfile?.mobile || 'Not provided',
                        experience: '5 years' // You might want to fetch this from driver profile
                    };
                    setCurrentDriver(driverInfo);
                    setTargetId(van.assignedDriverId);
                    console.log('Set driver info:', driverInfo);
                }
                
                // Set van service info
                if (van.UserProfile?.vanService) {
                    const vanService = van.UserProfile.vanService;
                    const vanServiceInfo = {
                        id: vanService.id,
                        name: vanService.serviceName,
                        contact: vanService.contactNo,
                        serviceRegNumber: vanService.serviceRegNumber
                    };
                    setCurrentVanService(vanServiceInfo);
                    console.log('Set van service info:', vanServiceInfo);
                }
            } else {
                console.log('Child has no van assigned');
                // Set default values if no van
                setCurrentDriver({
                    id: 'no_driver',
                    name: 'No Driver Assigned',
                    photo: null,
                    vanNumber: 'N/A',
                    phone: 'N/A',
                    experience: 'N/A'
                });
                setCurrentVanService({
                    id: 'no_service',
                    name: 'No Van Service',
                    contact: 'N/A',
                    serviceRegNumber: 'N/A'
                });
            }
            
        } catch (error) {
            console.error('Error fetching child data:', error);
            Alert.alert('Error', `Failed to load child data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleStarPress = (starIndex) => {
        setRating(starIndex + 1);
    };

    const handleReviewTypeChange = (type) => {
        setReviewType(type);
        setRating(0); // Reset rating when switching types
        setComment(''); // Reset comment when switching types
        
        // Set target ID based on review type
        if (type === 'DRIVER') {
            setTargetId(currentDriver.id);
        } else {
            setTargetId(currentVanService.id);
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a rating before submitting your review.');
            return;
        }

        if (!childId || !targetId || !vanId) {
            Alert.alert('Missing Information', 'Please ensure all required data is available.');
            return;
        }

        try {
            const session = await AsyncStorage.getItem('user_session');
            if (!session) {
                Alert.alert('Error', 'Please log in again.');
                return;
            }

            const user = JSON.parse(session);
            const formData = new FormData();
            
            formData.append('childId', childId.toString());
            formData.append('reviewType', reviewType);
            formData.append('targetId', targetId);
            formData.append('rating', rating.toString());
            formData.append('comment', comment || '');
            formData.append('vanId', vanId.toString());
            formData.append('reviewerId', user.user.id);

            console.log('Submitting review:', {
                childId,
                reviewType,
                targetId,
                rating,
                comment,
                vanId,
                reviewerId: user.user.id
            });

            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            const result = await response.json();
            console.log('Review submitted successfully:', result);
            
            const targetName = reviewType === 'DRIVER' ? currentDriver.name : currentVanService.name;
            Alert.alert('Success', `Your review for ${targetName} has been submitted successfully!`, [
                { text: 'OK', onPress: () => router.back() }
            ]);

        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'Failed to submit review. Please try again.');
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handleStarPress(i)}
                    style={styles.starButton}
                >
                    <Ionicons
                        name={i < rating ? 'star' : 'star-outline'}
                        size={32}
                        color={i < rating ? '#FFD700' : '#ccc'}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };


    const renderReviewTypeSelector = () => {
        return (
            <View style={styles.reviewTypeContainer}>
                <SWText style={styles.sectionTitle}>What would you like to review?</SWText>
                <View style={styles.reviewTypeButtons}>
                    <TouchableOpacity
                        style={[
                            styles.reviewTypeButton,
                            reviewType === 'DRIVER' && styles.activeReviewTypeButton
                        ]}
                        onPress={() => handleReviewTypeChange('DRIVER')}
                    >
                        <View style={styles.reviewTypeIconContainer}>
                            <Ionicons
                                name="person"
                                size={24}
                                color={reviewType === 'driver' ? '#fff' : theme.colors.accentblue}
                            />
                        </View>
                        <SWText style={[
                            styles.reviewTypeButtonText,
                            reviewType === 'DRIVER' && styles.activeReviewTypeButtonText
                        ]}>
                            Driver
                        </SWText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.reviewTypeButton,
                            reviewType === 'VAN_SERVICE' && styles.activeReviewTypeButton
                        ]}
                        onPress={() => handleReviewTypeChange('VAN_SERVICE')}
                    >
                        <View style={styles.reviewTypeIconContainer}>
                            <Ionicons
                                name="car"
                                size={24}
                                color={reviewType === 'van' ? '#fff' : theme.colors.accentblue}
                            />
                        </View>
                        <SWText style={[
                            styles.reviewTypeButtonText,
                            reviewType === 'VAN_SERVICE' && styles.activeReviewTypeButtonText
                        ]}>
                            Van Service
                        </SWText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderDriverInfo = () => {
        if (reviewType !== 'DRIVER') return null;

        return (
            <View style={styles.infoContainer}>
                <SWText style={styles.sectionTitle}>Driver Information</SWText>
                <View style={styles.modernInfoCard}>
                    <View style={styles.driverHeader}>
                        <View style={styles.driverPhotoContainer}>
                            {currentDriver.photo ? (
                                <Image source={{ uri: currentDriver.photo }} style={styles.driverPhoto} />
                            ) : (
                                <View style={styles.driverPhotoPlaceholder}>
                                    <Ionicons name="person" size={32} color={theme.colors.textgreydark} />
                                </View>
                            )}
                        </View>
                        <View style={styles.driverDetails}>
                            <SWText style={styles.infoName}>{currentDriver.name}</SWText>
                            <View style={styles.detailRow}>
                                <Ionicons name="car" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>Van: {currentDriver.vanNumber}</SWText>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="time" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>Experience: {currentDriver.experience}</SWText>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="call" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>{currentDriver.phone}</SWText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderVanInfo = () => {
        if (reviewType !== 'VAN_SERVICE') return null;

        return (
            <View style={styles.infoContainer}>
                <SWText style={styles.sectionTitle}>Van Information</SWText>
                <View style={styles.modernInfoCard}>
                    <View style={styles.vanHeader}>
                        <View style={styles.vanIconContainer}>
                            <Ionicons name="car" size={40} color={theme.colors.accentblue} />
                        </View>
                        <View style={styles.vanDetails}>
                            <SWText style={styles.infoName}>{currentVanService.name}</SWText>
                            <View style={styles.detailRow}>
                                <Ionicons name="business" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>Service: {currentVanService.serviceRegNumber}</SWText>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="call" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>Contact: {currentVanService.contact}</SWText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const getReviewPrompt = () => {
        if (reviewType === 'DRIVER') {
            return `How would you rate ${currentDriver.name}'s service?`;
        } else {
            return `How would you rate ${currentVanService.name}?`;
        }
    };

    const getCommentPlaceholder = () => {
        if (reviewType === 'DRIVER') {
            return "Share your experience with the driver's punctuality, safety, friendliness, and overall service...";
        } else {
            return "Share your experience with the van service's reliability, communication, and overall service quality...";
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <SWText uberBold style={styles.headerTitle}>Add Review</SWText>
                    </View>
                    <View style={styles.loadingContainer}>
                        <SWText style={styles.loadingText}>Loading review data...</SWText>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <SWText uberBold style={styles.headerTitle}>Add Review</SWText>
                </View>

                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    scrollEventThrottle={16}
                >
                    <View style={styles.formContainer}>
                        {renderReviewTypeSelector()}
                        {renderDriverInfo()}
                        {renderVanInfo()}

                        <View style={styles.ratingSection}>
                            <SWText style={styles.sectionTitle}>Rating</SWText>
                            <SWText style={styles.ratingSubtext}>{getReviewPrompt()}</SWText>
                            <View style={styles.starsContainer}>
                                {renderStars()}
                            </View>
                            {rating > 0 && (
                                <SWText style={styles.ratingText}>
                                    {rating} out of 5 stars
                                </SWText>
                            )}
                        </View>

                        <View style={styles.commentSection}>
                            <SWText style={styles.sectionTitle}>Comments (Optional)</SWText>
                            <MultilineTextInput
                                placeholder={getCommentPlaceholder()}
                                value={comment}
                                onChangeText={setComment}
                                numberOfLines={5}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <View style={styles.bottomContainer}>
                <Button
                    title="Submit Review"
                    varient="outlined-primaryDark"
                    onPress={handleSubmitReview}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100, // Extra padding to account for fixed button
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 5,
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        color: 'white',
    },
    formContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    reviewTypeContainer: {
        marginBottom: 24,
    },
    reviewTypeButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    reviewTypeButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activeReviewTypeButton: {
        backgroundColor: '#2B3674',
        borderColor: '#2B3674',
        shadowColor: '#2B3674',
        shadowOpacity: 0.3,
    },
    reviewTypeIconContainer: {
        marginBottom: 8,
    },
    reviewTypeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2B3674',
    },
    activeReviewTypeButtonText: {
        color: '#fff',
    },
    infoContainer: {
        marginBottom: 24,
    },
    modernInfoCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    driverHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    driverPhotoContainer: {
        marginRight: 16,
    },
    driverPhoto: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    driverPhotoPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    driverDetails: {
        flex: 1,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 8,
    },
    vanHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    vanIconContainer: {
        marginRight: 16,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    vanDetails: {
        flex: 1,
    },
    infoName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    infoDetail: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    amenitiesContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    amenitiesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    amenitiesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    amenityText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    ratingSection: {
        marginBottom: 24,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    commentSection: {
        marginBottom: 24,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ratingSubtext: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    starButton: {
        padding: 8,
        marginHorizontal: 4,
    },
    ratingText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default AddReview;