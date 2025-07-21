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
    Image
} from 'react-native';
import { Button } from "../../components/button";
import { MultilineTextInput } from '../../components/inputs';
import { useTheme } from "../../theme/ThemeContext";

const AddReview = ({ navigation, onBack }) => {
    const { theme } = useTheme();
    const router = useRouter();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedChild, setSelectedChild] = useState(null);
    const [reviewType, setReviewType] = useState('driver'); // 'driver' or 'van'

    // Mock data - replace with actual data from your app's state/API
    const childrenWithDrivers = [
        {
            id: 1,
            name: 'John Doe',
            school: 'Ananda College',
            driver: {
                id: 1,
                name: 'Kamal Perera',
                photo: null, // Add driver photo URL if available
                vanNumber: 'WP CAB-1234',
                phone: '+94 77 123 4567',
                experience: '5 years'
            },
            van: {
                id: 1,
                number: 'WP CAB-1234',
                model: 'Toyota Hiace',
                capacity: '12 seats',
                condition: 'Good',
                amenities: ['AC', 'First Aid Kit', 'Seat Belts']
            }
        },
        // Add more children if parent has multiple children
    ];

    const handleBack = () => {
        if (navigation && navigation.goBack) {
            navigation.goBack();
        } else if (onBack) {
            onBack();
        } else {
            console.log('No navigation method provided');
        }
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

        if (!selectedChild) {
            Alert.alert('Child Selection Required', 'Please select which child this review is for.');
            return;
        }

        // Here you would typically send the review data to your backend
        const reviewData = {
            childId: selectedChild.id,
            reviewType: reviewType,
            targetId: reviewType === 'driver' ? selectedChild.driver.id : selectedChild.van.id,
            rating: rating,
            comment: comment,
            timestamp: new Date().toISOString()
        };

        console.log('Review submitted:', reviewData);
        const targetName = reviewType === 'driver' ? selectedChild.driver.name : `Van ${selectedChild.van.number}`;
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

    const renderChildSelector = () => {
        return (
            <View style={styles.childSelectorContainer}>
                <Text style={styles.label}>Select Child</Text>
                {childrenWithDrivers.map((child) => (
                    <TouchableOpacity
                        key={child.id}
                        style={[
                            styles.childCard,
                            selectedChild?.id === child.id && styles.selectedChildCard
                        ]}
                        onPress={() => setSelectedChild(child)}
                    >
                        <View style={styles.childInfo}>
                            <Text style={styles.childName}>{child.name}</Text>
                            <Text style={styles.childSchool}>{child.school}</Text>
                        </View>
                        <View style={styles.checkmarkContainer}>
                            {selectedChild?.id === child.id && (
                                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderReviewTypeSelector = () => {
        if (!selectedChild) return null;

        return (
            <View style={styles.reviewTypeContainer}>
                <Text style={styles.label}>What would you like to review?</Text>
                <View style={styles.reviewTypeButtons}>
                    <TouchableOpacity
                        style={[
                            styles.reviewTypeButton,
                            reviewType === 'driver' && styles.activeReviewTypeButton
                        ]}
                        onPress={() => handleReviewTypeChange('driver')}
                    >
                        <Ionicons
                            name="person"
                            size={20}
                            color={reviewType === 'driver' ? '#fff' : theme.colors.primary}
                        />
                        <Text style={[
                            styles.reviewTypeButtonText,
                            reviewType === 'driver' && styles.activeReviewTypeButtonText
                        ]}>
                            Driver
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.reviewTypeButton,
                            reviewType === 'van' && styles.activeReviewTypeButton
                        ]}
                        onPress={() => handleReviewTypeChange('van')}
                    >
                        <Ionicons
                            name="car"
                            size={20}
                            color={reviewType === 'van' ? '#fff' : theme.colors.primary}
                        />
                        <Text style={[
                            styles.reviewTypeButtonText,
                            reviewType === 'van' && styles.activeReviewTypeButtonText
                        ]}>
                            Van Service
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderDriverInfo = () => {
        if (!selectedChild || reviewType !== 'driver') return null;

        const driver = selectedChild.driver;
        return (
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Driver Information</Text>
                <View style={styles.infoCard}>
                    <View style={styles.driverHeader}>
                        <View style={styles.driverPhotoContainer}>
                            {driver.photo ? (
                                <Image source={{ uri: driver.photo }} style={styles.driverPhoto} />
                            ) : (
                                <View style={styles.driverPhotoPlaceholder}>
                                    <Ionicons name="person" size={32} color="#666" />
                                </View>
                            )}
                        </View>
                        <View style={styles.driverDetails}>
                            <Text style={styles.infoName}>{driver.name}</Text>
                            <Text style={styles.infoDetail}>Van: {driver.vanNumber}</Text>
                            <Text style={styles.infoDetail}>Experience: {driver.experience}</Text>
                            <Text style={styles.infoDetail}>Phone: {driver.phone}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderVanInfo = () => {
        if (!selectedChild || reviewType !== 'van') return null;

        const van = selectedChild.van;
        return (
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Van Information</Text>
                <View style={styles.infoCard}>
                    <View style={styles.vanHeader}>
                        <View style={styles.vanIconContainer}>
                            <Ionicons name="car" size={40} color={theme.colors.primary} />
                        </View>
                        <View style={styles.vanDetails}>
                            <Text style={styles.infoName}>Van {van.number}</Text>
                            <Text style={styles.infoDetail}>Model: {van.model}</Text>
                            <Text style={styles.infoDetail}>Capacity: {van.capacity}</Text>
                            <Text style={styles.infoDetail}>Condition: {van.condition}</Text>
                        </View>
                    </View>
                    <View style={styles.amenitiesContainer}>
                        <Text style={styles.amenitiesTitle}>Amenities:</Text>
                        <View style={styles.amenitiesList}>
                            {van.amenities.map((amenity, index) => (
                                <View key={index} style={styles.amenityItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                    <Text style={styles.amenityText}>{amenity}</Text>
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
            return `How would you rate ${selectedChild?.driver.name}'s service?`;
        } else {
            return `How would you rate the van service (${selectedChild?.van.number})?`;
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
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Review</Text>
                </View>

                <View style={styles.formContainer}>
                    {renderChildSelector()}
                    {renderReviewTypeSelector()}
                    {renderDriverInfo()}
                    {renderVanInfo()}

                    {selectedChild && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Rating</Text>
                                <Text style={styles.ratingSubtext}>{getReviewPrompt()}</Text>
                                <View style={styles.starsContainer}>
                                    {renderStars()}
                                </View>
                                {rating > 0 && (
                                    <Text style={styles.ratingText}>
                                        {rating} out of 5 stars
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Comments (Optional)</Text>
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

            <View style={styles.bottomContainer}>
                <Button
                    title="Submit Review"
                    varient="primary"
                    onPress={handleSubmitReview}
                />
            </View>
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
        fontWeight: '600',
        color: '#000',
    },
    formContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
    },
    childSelectorContainer: {
        marginBottom: 20,
    },
    childCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedChildCard: {
        borderColor: '#007AFF',
        borderWidth: 2,
        backgroundColor: '#f0f8ff',
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    childSchool: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    checkmarkContainer: {
        width: 30,
        alignItems: 'center',
    },
    reviewTypeContainer: {
        marginBottom: 20,
    },
    reviewTypeButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    reviewTypeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#007AFF',
        gap: 8,
    },
    activeReviewTypeButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    reviewTypeButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#007AFF',
    },
    activeReviewTypeButtonText: {
        color: '#fff',
    },
    infoContainer: {
        marginBottom: 20,
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    driverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverPhotoContainer: {
        marginRight: 15,
    },
    driverPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    driverPhotoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    driverDetails: {
        flex: 1,
    },
    vanHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    vanIconContainer: {
        marginRight: 15,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    vanDetails: {
        flex: 1,
    },
    infoName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    infoDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    amenitiesContainer: {
        marginTop: 10,
    },
    amenitiesTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    amenityText: {
        fontSize: 12,
        color: '#333',
    },
    ratingSubtext: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    starButton: {
        padding: 5,
        marginHorizontal: 5,
    },
    ratingText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: '#fff',
    },
});

export default AddReview;