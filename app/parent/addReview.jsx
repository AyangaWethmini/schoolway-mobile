import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

const AddReview = ({ navigation, onBack }) => {
    const { theme } = useTheme();
    const router = useRouter();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewType, setReviewType] = useState('driver'); // 'driver' or 'van'

    // Mock data - replace with actual data from your app's state/API
    const currentDriver = {
        id: 1,
        name: 'Kamal Perera',
        photo: null, // Add driver photo URL if available
        vanNumber: 'WP CAB-1234',
        phone: '+94 77 123 4567',
        experience: '5 years'
    };

    const currentVan = {
        id: 1,
        number: 'WP CAB-1234',
        model: 'Toyota Hiace',
        capacity: '12 seats',
        condition: 'Good',
        amenities: ['AC', 'First Aid Kit', 'Seat Belts']
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
    };

    const handleSubmitReview = () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a rating before submitting your review.');
            return;
        }

        // Here you would typically send the review data to your backend
        const reviewData = {
            reviewType: reviewType,
            targetId: reviewType === 'driver' ? currentDriver.id : currentVan.id,
            rating: rating,
            comment: comment,
            timestamp: new Date().toISOString()
        };

        console.log('Review submitted:', reviewData);
        const targetName = reviewType === 'driver' ? currentDriver.name : `Van ${currentVan.number}`;
        Alert.alert('Success', `Your review for ${targetName} has been submitted successfully!`, [
            { text: 'OK', onPress: () => router.back() }
        ]);
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
                            reviewType === 'driver' && styles.activeReviewTypeButton
                        ]}
                        onPress={() => handleReviewTypeChange('driver')}
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
                            reviewType === 'driver' && styles.activeReviewTypeButtonText
                        ]}>
                            Driver
                        </SWText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.reviewTypeButton,
                            reviewType === 'van' && styles.activeReviewTypeButton
                        ]}
                        onPress={() => handleReviewTypeChange('van')}
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
                            reviewType === 'van' && styles.activeReviewTypeButtonText
                        ]}>
                            Van Service
                        </SWText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderDriverInfo = () => {
        if (reviewType !== 'driver') return null;

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
        if (reviewType !== 'van') return null;

        return (
            <View style={styles.infoContainer}>
                <SWText style={styles.sectionTitle}>Van Information</SWText>
                <View style={styles.modernInfoCard}>
                    <View style={styles.vanHeader}>
                        <View style={styles.vanIconContainer}>
                            <Ionicons name="car" size={40} color={theme.colors.accentblue} />
                        </View>
                        <View style={styles.vanDetails}>
                            <SWText style={styles.infoName}>Van {currentVan.number}</SWText>
                            <View style={styles.detailRow}>
                                <Ionicons name="car-sport" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>Model: {currentVan.model}</SWText>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="people" size={16} color={theme.colors.textgreydark} />
                                <SWText style={styles.infoDetail}>Capacity: {currentVan.capacity}</SWText>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="checkmark-circle" size={16} color={theme.colors.statusgreen} />
                                <SWText style={styles.infoDetail}>Condition: {currentVan.condition}</SWText>
                            </View>
                        </View>
                    </View>
                    <View style={styles.amenitiesContainer}>
                        <SWText style={styles.amenitiesTitle}>Amenities:</SWText>
                        <View style={styles.amenitiesList}>
                            {currentVan.amenities.map((amenity, index) => (
                                <View key={index} style={styles.amenityItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.statusgreen} />
                                    <SWText style={styles.amenityText}>{amenity}</SWText>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const getReviewPrompt = () => {
        if (reviewType === 'driver') {
            return `How would you rate ${currentDriver.name}'s service?`;
        } else {
            return `How would you rate the van service (${currentVan.number})?`;
        }
    };

    const getCommentPlaceholder = () => {
        if (reviewType === 'driver') {
            return "Share your experience with the driver's punctuality, safety, friendliness, and overall service...";
        } else {
            return "Share your experience with the van's cleanliness, comfort, safety features, and overall condition...";
        }
    };

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
});

export default AddReview;