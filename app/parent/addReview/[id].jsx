// Updated mobile app code with correct data mapping
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
import { Button } from "../../components/button";
import { MultilineTextInput } from '../../components/inputs';
import SWText from '../../components/SWText';
import { useTheme } from "../../theme/ThemeContext";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const AddReview = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewType, setReviewType] = useState('DRIVER'); // 'DRIVER' or 'VAN_SERVICE'
    const [childId, setChildId] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const [vanId, setVanId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [existingDriverReview, setExistingDriverReview] = useState(null);
    const [existingVanServiceReview, setExistingVanServiceReview] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);

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
        vanServiceId: null,
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
            
            const childDataRes = await response.json();
            console.log('Fetched child data:', JSON.stringify(childData, null, 2));
            
            const childData = childDataRes.child;
            
            // Set van ID from child data
            if (childData.vanID) {
                setVanId(childData.vanID);
                console.log('Set van ID:', childData.vanID);
            }

            console.log(childData)
            
            // If child has a van, get driver and van service info
            if (childData.Van) {
                const van = childData.Van;
                console.log('Child has van:', JSON.stringify(van, null, 2));
                
                // Set driver info if van has assigned driver
                if (van.assignedDriverId && van.UserProfile_assignedDriverIdToUserProfile) {
                    const driver = van.UserProfile_assignedDriverIdToUserProfile;
                    const driverProfile = driver.driverProfile;
                    
                    // Calculate experience
                    let experience = 'Not specified';
                    if (driverProfile && driverProfile.startedDriving) {
                        const startYear = new Date(driverProfile.startedDriving).getFullYear();
                        const currentYear = new Date().getFullYear();
                        experience = `${currentYear - startYear} years`;
                    }
                    
                    const driverInfo = {
                        id: driver.id,
                        name: `${driver.firstname || ''} ${driver.lastname || ''}`.trim() || 'Driver',
                        photo: driver.dp,
                        vanNumber: van.registrationNumber,
                        phone: driver.mobile || 'Not provided',
                        experience: experience,
                        averageRating: driverProfile?.averageRating || 0,
                        totalReviews: driverProfile?.totalReviews || 0
                    };
                    setCurrentDriver(driverInfo);
                    setTargetId(driver.id);
                    console.log('Set driver info:', driverInfo);
                } else {
                    console.log('No driver assigned to van');
                    setCurrentDriver({
                        id: null,
                        name: 'No driver assigned',
                        photo: null,
                        vanNumber: van.registrationNumber,
                        phone: 'N/A',
                        experience: 'N/A'
                    });
                }
                
                // Set van service info
                if (van.UserProfile && van.UserProfile.vanService) {
                    const vanService = van.UserProfile.vanService;
                    const vanServiceInfo = {
                        id: van.UserProfile.id, // Use van service owner's user ID as targetId
                        vanServiceId: vanService.id, // Keep van service ID for reference
                        name: vanService.serviceName,
                        contact: vanService.contactNo,
                        serviceRegNumber: vanService.serviceRegNumber,
                        averageRating: vanService.averageRating || 0,
                        totalReviews: vanService.totalReviews || 0
                    };
                    setCurrentVanService(vanServiceInfo);
                    console.log('Set van service info:', vanServiceInfo);
                } else {
                    console.log('No van service found for van owner');
                    setCurrentVanService({
                        id: null,
                        vanServiceId: null,
                        name: 'No van service registered',
                        contact: 'N/A',
                        serviceRegNumber: 'N/A'
                    });
                }
                
                // Check for existing reviews after setting driver/van service info
                await checkExistingReviews(childId, van.assignedDriverId, van.UserProfile?.id);
                
            } else {
                console.log('Child has no van assigned');
                Alert.alert(
                    'No Van Assigned', 
                    'This child is not assigned to any van. Reviews can only be submitted for children with assigned vans.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
                return;
            }
            
        } catch (error) {
            console.error('Error fetching child data:', error);
            Alert.alert('Error', `Failed to load child data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const checkExistingReviews = async (childId, driverId, vanServiceOwnerId) => {
        try {
            console.log('Checking existing reviews for child:', childId);
            
            // Check for driver review
            if (driverId) {
                const driverReviewResponse = await fetch(`${API_URL}/reviews?childId=${childId}&reviewType=DRIVER&targetId=${driverId}`);
                if (driverReviewResponse.ok) {
                    const driverReviewData = await driverReviewResponse.json();
                    if (driverReviewData.reviews && driverReviewData.reviews.length > 0) {
                        console.log('Found existing driver review:', driverReviewData.reviews[0]);
                        setExistingDriverReview(driverReviewData.reviews[0]);
                    } else {
                        setExistingDriverReview(null);
                    }
                }
            }
            
            // Check for van service review
            if (vanServiceOwnerId) {
                const vanServiceReviewResponse = await fetch(`${API_URL}/reviews?childId=${childId}&reviewType=VAN_SERVICE&targetId=${vanServiceOwnerId}`);
                if (vanServiceReviewResponse.ok) {
                    const vanServiceReviewData = await vanServiceReviewResponse.json();
                    if (vanServiceReviewData.reviews && vanServiceReviewData.reviews.length > 0) {
                        console.log('Found existing van service review:', vanServiceReviewData.reviews[0]);
                        setExistingVanServiceReview(vanServiceReviewData.reviews[0]);
                    } else {
                        setExistingVanServiceReview(null);
                    }
                }
            }
            
            console.log('Finished checking existing reviews');
            
        } catch (error) {
            console.error('Error checking existing reviews:', error);
            // Don't show error to user, just log it
        }
    };

    const handleBack = () => {
        router.back();
    };

    // Helper functions to avoid complex boolean expressions
    const hasExistingReviewForCurrentType = () => {
        let result = false;
        if (reviewType === 'DRIVER') {
            result = !!existingDriverReview;
        } else if (reviewType === 'VAN_SERVICE') {
            result = !!existingVanServiceReview;
        }
        console.log('hasExistingReviewForCurrentType:', { reviewType, result, existingDriverReview: !!existingDriverReview, existingVanServiceReview: !!existingVanServiceReview });
        return result;
    };

    const getButtonTitle = () => {
        if (isEditMode) {
            return "Update Review";
        }
        return hasExistingReviewForCurrentType() ? "Review Already Submitted" : "Submit Review";
    };

    const getButtonOnPress = () => {
        if (isEditMode) {
            return handleEditReview;
        }
        if (hasExistingReviewForCurrentType()) {
            return undefined; // Return undefined instead of null for disabled state
        }
        return handleSubmitReview;
    };

    const isButtonDisabled = () => {
        const hasExistingReview = hasExistingReviewForCurrentType();
        const hasNoTargetId = !targetId;
        const hasNoRating = rating === 0;
        
        // In edit mode, only check rating
        if (isEditMode) {
            return hasNoRating;
        }
        
        const result = hasExistingReview || hasNoTargetId || hasNoRating;
        console.log('isButtonDisabled:', { hasExistingReview, hasNoTargetId, hasNoRating, result, targetId, rating, isEditMode });
        return result;
    };

    const shouldShowReviewForm = () => {
        return !hasExistingReviewForCurrentType() || isEditMode;
    };

    const getCurrentExistingReview = () => {
        if (reviewType === 'DRIVER') {
            return existingDriverReview;
        } else if (reviewType === 'VAN_SERVICE') {
            return existingVanServiceReview;
        }
        return null;
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

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const result = await response.json();
            console.log('Review API response:', result);

            if (!response.ok) {
                // Handle specific error cases
                if (result.error) {
                    if (result.error.includes('Child not found')) {
                        Alert.alert('Error', `Child not found. Debug info: ${JSON.stringify(result.debug)}`);
                    } else if (result.error.includes('Van not found')) {
                        Alert.alert('Error', `Van not found. Debug info: ${JSON.stringify(result.debug)}`);
                    } else if (result.error.includes('Driver not found')) {
                        Alert.alert('Error', `Driver not found. Debug info: ${JSON.stringify(result.debug)}`);
                    } else if (result.error.includes('Review already exists')) {
                        Alert.alert('Error', 'You have already submitted a review for this child and target.');
                    } else if (result.error.includes('Unauthorized')) {
                        Alert.alert('Error', 'You can only review for your own child.');
                    } else {
                        Alert.alert('Error', result.error);
                    }
                } else {
                    Alert.alert('Error', 'Failed to submit review. Please try again.');
                }
                return;
            }

            const targetName = reviewType === 'DRIVER' ? currentDriver.name : currentVanService.name;
            Alert.alert('Success', `Your review for ${targetName} has been submitted successfully!`, [
                { text: 'OK', onPress: () => {
                    // Refresh existing reviews after successful submission
                    checkExistingReviews(childId, currentDriver.id, currentVanService.id);
                    router.back();
                }}
            ]);

        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'Failed to submit review. Please try again.');
        }
    };

    const handleEditReview = async () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a rating before updating your review.');
            return;
        }

        if (!editingReviewId) {
            Alert.alert('Error', 'No review selected for editing.');
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
            
            formData.append('reviewId', editingReviewId);
            formData.append('rating', rating.toString());
            formData.append('comment', comment || '');
            formData.append('reviewerId', user.user.id);

            console.log('Updating review:', {
                reviewId: editingReviewId,
                rating,
                comment,
                reviewerId: user.user.id
            });

            const response = await fetch(`${API_URL}/reviews/${editingReviewId}`, {
                method: 'PUT',
                body: formData,
            });

            console.log('Update response status:', response.status);
            const result = await response.json();
            console.log('Update API response:', result);

            if (!response.ok) {
                Alert.alert('Error', result.error || 'Failed to update review. Please try again.');
                return;
            }

            const targetName = reviewType === 'DRIVER' ? currentDriver.name : currentVanService.name;
            Alert.alert('Success', `Your review for ${targetName} has been updated successfully!`, [
                { text: 'OK', onPress: () => {
                    // Refresh existing reviews after successful update
                    checkExistingReviews(childId, currentDriver.id, currentVanService.id);
                    setIsEditMode(false);
                    setEditingReviewId(null);
                }}
            ]);

        } catch (error) {
            console.error('Error updating review:', error);
            Alert.alert('Error', 'Failed to update review. Please try again.');
        }
    };

    const handleDeleteReview = async () => {
        const currentReview = getCurrentExistingReview();
        if (!currentReview) {
            Alert.alert('Error', 'No review found to delete.');
            return;
        }

        Alert.alert(
            'Delete Review',
            'Are you sure you want to delete this review? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const session = await AsyncStorage.getItem('user_session');
                            if (!session) {
                                Alert.alert('Error', 'Please log in again.');
                                return;
                            }

                            const user = JSON.parse(session);
                            const formData = new FormData();
                            formData.append('reviewerId', user.user.id);

                            console.log('Deleting review:', {
                                reviewId: currentReview.id,
                                reviewerId: user.user.id
                            });

                            const response = await fetch(`${API_URL}/reviews/${currentReview.id}`, {
                                method: 'DELETE',
                                body: formData,
                            });

                            console.log('Delete response status:', response.status);
                            const result = await response.json();
                            console.log('Delete API response:', result);

                            if (!response.ok) {
                                Alert.alert('Error', result.error || 'Failed to delete review. Please try again.');
                                return;
                            }

                            const targetName = reviewType === 'DRIVER' ? currentDriver.name : currentVanService.name;
                            Alert.alert('Success', `Your review for ${targetName} has been deleted successfully!`, [
                                { text: 'OK', onPress: () => {
                                    // Refresh existing reviews after successful deletion
                                    checkExistingReviews(childId, currentDriver.id, currentVanService.id);
                                    setIsEditMode(false);
                                    setEditingReviewId(null);
                                    setRating(0);
                                    setComment('');
                                }}
                            ]);

                        } catch (error) {
                            console.error('Error deleting review:', error);
                            Alert.alert('Error', 'Failed to delete review. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const handleEditButtonPress = () => {
        const currentReview = getCurrentExistingReview();
        if (!currentReview) {
            Alert.alert('Error', 'No review found to edit.');
            return;
        }

        setIsEditMode(true);
        setEditingReviewId(currentReview.id);
        setRating(currentReview.rating);
        setComment(currentReview.comment || '');
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditingReviewId(null);
        setRating(0);
        setComment('');
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
        // Always show the review type selector, but show existing review info below
        return (
            <View style={styles.reviewTypeContainer}>
                <SWText style={styles.sectionTitle}>What would you like to review?</SWText>
                <View style={styles.reviewTypeButtons}>
                    <TouchableOpacity
                        style={[
                            styles.reviewTypeButton,
                            reviewType === 'DRIVER' && styles.activeReviewTypeButton,
                            !currentDriver.id && styles.disabledButton
                        ]}
                        onPress={() => handleReviewTypeChange('DRIVER')}
                        disabled={!currentDriver.id || currentDriver.id === null}
                    >
                        <View style={styles.reviewTypeIconContainer}>
                            <Ionicons
                                name="person"
                                size={24}
                                color={reviewType === 'DRIVER' ? '#fff' : theme.colors.accentblue}
                            />
                        </View>
                        <SWText style={[
                            styles.reviewTypeButtonText,
                            reviewType === 'DRIVER' && styles.activeReviewTypeButtonText,
                            !currentDriver.id && styles.disabledButtonText
                        ]}>
                            Driver
                        </SWText>
                        {!currentDriver.id && (
                            <SWText style={styles.unavailableText}>No driver assigned</SWText>
                        )}
                        {existingDriverReview && (
                            <SWText style={styles.existingText}>✓ Reviewed</SWText>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.reviewTypeButton,
                            reviewType === 'VAN_SERVICE' && styles.activeReviewTypeButton,
                            !currentVanService.id && styles.disabledButton
                        ]}
                        onPress={() => handleReviewTypeChange('VAN_SERVICE')}
                        disabled={!currentVanService.id || currentVanService.id === null}
                    >
                        <View style={styles.reviewTypeIconContainer}>
                            <Ionicons
                                name="car"
                                size={24}
                                color={reviewType === 'VAN_SERVICE' ? '#fff' : theme.colors.accentblue}
                            />
                        </View>
                        <SWText style={[
                            styles.reviewTypeButtonText,
                            reviewType === 'VAN_SERVICE' && styles.activeReviewTypeButtonText,
                            !currentVanService.id && styles.disabledButtonText
                        ]}>
                            Van Service
                        </SWText>
                        {!currentVanService.id && (
                            <SWText style={styles.unavailableText}>No van service</SWText>
                        )}
                        {existingVanServiceReview && (
                            <SWText style={styles.existingText}>✓ Reviewed</SWText>
                        )}
                    </TouchableOpacity>
                </View>
                
                {hasExistingReviewForCurrentType() && !isEditMode && (
                    <View style={styles.existingReviewContainer}>
                        <View style={styles.existingReviewCard}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                            <View style={styles.existingReviewContent}>
                                <SWText style={styles.existingReviewTitle}>Review Already Submitted</SWText>
                                <SWText style={styles.existingReviewText}>
                                    You have already submitted a review for this {reviewType === 'DRIVER' ? 'driver' : 'van service'}.
                                </SWText>
                                <View style={styles.existingReviewDetails}>
                                    <SWText style={styles.existingReviewRating}>
                                        Rating: {getCurrentExistingReview().rating}/5 ⭐
                                    </SWText>
                                    {getCurrentExistingReview().comment && (
                                        <SWText style={styles.existingReviewComment}>
                                            "{getCurrentExistingReview().comment}"
                                        </SWText>
                                    )}
                                    <SWText style={styles.existingReviewDate}>
                                        Submitted: {new Date(getCurrentExistingReview().createdAt).toLocaleDateString()}
                                    </SWText>
                                </View>
                                <View style={styles.reviewActions}>
                                    <TouchableOpacity 
                                        style={styles.editButton}
                                        onPress={handleEditButtonPress}
                                    >
                                        <Ionicons name="create-outline" size={16} color="#2B3674" />
                                        <SWText style={styles.editButtonText}>Edit</SWText>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.deleteButton}
                                        onPress={handleDeleteReview}
                                    >
                                        <Ionicons name="trash-outline" size={16} color="#dc3545" />
                                        <SWText style={styles.deleteButtonText}>Delete</SWText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const renderDriverInfo = () => {
        if (reviewType !== 'DRIVER' || !currentDriver.id) return null;

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
                            {currentDriver.averageRating > 0 && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="star" size={16} color={theme.colors.textgreydark} />
                                    <SWText style={styles.infoDetail}>
                                        Rating: {currentDriver.averageRating.toFixed(1)} ({currentDriver.totalReviews} reviews)
                                    </SWText>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderVanInfo = () => {
        if (reviewType !== 'VAN_SERVICE' || !currentVanService.id) return null;

        return (
            <View style={styles.infoContainer}>
                <SWText style={styles.sectionTitle}>Van Service Information</SWText>
                <View style={styles.modernInfoCard}>
                    <View style={styles.vanHeader}>
                        <View style={styles.vanIconContainer}>
                            <Ionicons name="car" size={40} color={theme.colors.accentblue} />
                        </View>
                        <View style={styles.vanDetails}>
                            <SWText style={styles.infoName}>{currentVanService.name}</SWText>
                            <View style={styles.detailRow}>
                                <Ionicons name="business" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>Registration: {currentVanService.serviceRegNumber}</SWText>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="call" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>Contact: {currentVanService.contact}</SWText>
                            </View>
                            {currentVanService.averageRating > 0 && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="star" size={16} color={theme.colors.textgreydark} />
                                    <SWText style={styles.infoDetail}>
                                        Rating: {currentVanService.averageRating.toFixed(1)} ({currentVanService.totalReviews} reviews)
                                    </SWText>
                                </View>
                            )}
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

                        {shouldShowReviewForm() && (
                            <>
                                {isEditMode && (
                                    <View style={styles.editModeHeader}>
                                        <SWText style={styles.editModeTitle}>Edit Review</SWText>
                                        <TouchableOpacity 
                                            style={styles.cancelEditButton}
                                            onPress={handleCancelEdit}
                                        >
                                            <Ionicons name="close" size={20} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                )}
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
                            </>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <View style={styles.bottomContainer}>
                <Button
                    title={getButtonTitle()}
                    varient="outlined-primaryDark"
                    onPress={getButtonOnPress()}
                    disabled={isButtonDisabled()}
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
    disabledButton: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
        opacity: 0.6,
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
    disabledButtonText: {
        color: '#999',
    },
    unavailableText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        textAlign: 'center',
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
    existingReviewContainer: {
        marginBottom: 20,
    },
    existingReviewCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    existingReviewContent: {
        flex: 1,
        marginLeft: 12,
    },
    existingReviewTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 4,
    },
    existingReviewText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    existingReviewDetails: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    existingReviewRating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    existingReviewComment: {
        fontSize: 13,
        color: '#555',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    existingReviewDate: {
        fontSize: 12,
        color: '#888',
    },
    existingText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginTop: 4,
        textAlign: 'center',
    },
    reviewActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 12,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2B3674',
        gap: 4,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2B3674',
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff5f5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dc3545',
        gap: 4,
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#dc3545',
    },
    editModeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#2196f3',
    },
    editModeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1976d2',
    },
    cancelEditButton: {
        padding: 4,
    },
});

export default AddReview;