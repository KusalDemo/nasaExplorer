import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchAsteroids, setSelectedAsteroid } from '../../store/slices/asteroidsSlice';
import { format } from 'date-fns';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';

export default function AsteroidDetailsScreen() {
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { asteroids, selectedAsteroid, loading, error } = useSelector((state: RootState) => state.asteroids);

    const fetchAsteroid = async () => {
        // First check if we already have the asteroid in our state
        const found = asteroids.find(a => a.id === id);
        if (found) {
            dispatch(setSelectedAsteroid(found));
        } else {
            // If not, fetch new data
            const endDate = format(new Date(), 'yyyy-MM-dd');
            const startDate = format(new Date(), 'yyyy-MM-dd');
            await dispatch(fetchAsteroids({ startDate, endDate }) as any);

            // After fetching, try to find the asteroid again
            const newFound = asteroids.find(a => a.id === id);
            if (newFound) {
                dispatch(setSelectedAsteroid(newFound));
            }
        }
    };

    useEffect(() => {
        fetchAsteroid();
    }, [id, dispatch]);

    const handleShare = async () => {
        if (selectedAsteroid) {
            try {
                await Share.share({
                    title: `Near Earth Object - ${selectedAsteroid.name}`,
                    message: `Check out this Near Earth Object!\n\nName: ${selectedAsteroid.name}\nDiameter: ${Math.round(selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min)} - ${Math.round(selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max)} km\nPotentially Hazardous: ${selectedAsteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}\n\nMore info: ${selectedAsteroid.nasa_jpl_url}`,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading && !selectedAsteroid) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchAsteroid} />;
    if (!selectedAsteroid) return null;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Stack.Screen
                options={{
                    title: 'Asteroid Details',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                            <Ionicons name="share-outline" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.content}>
                <Text style={styles.name}>{selectedAsteroid.name}</Text>

                {selectedAsteroid.is_potentially_hazardous_asteroid && (
                    <View style={styles.hazardousTag}>
                        <Text style={styles.hazardousText}>⚠️ Potentially Hazardous</Text>
                    </View>
                )}

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Estimated Diameter</Text>
                    <Text style={styles.value}>
                        {Math.round(selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min)} - {Math.round(selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max)} km
                    </Text>

                    <Text style={styles.label}>Absolute Magnitude</Text>
                    <Text style={styles.value}>{selectedAsteroid.absolute_magnitude_h}</Text>
                </View>

                <View style={styles.approachCard}>
                    <Text style={styles.approachTitle}>Close Approach Data</Text>
                    {selectedAsteroid.close_approach_data.map((approach, index) => (
                        <View key={index} style={styles.approachItem}>
                            <Text style={styles.approachDate}>
                                {approach.close_approach_date}
                            </Text>
                            <Text style={styles.approachDetail}>
                                Miss Distance: {Math.round(parseFloat(approach.miss_distance.kilometers)).toLocaleString()} km
                            </Text>
                            <Text style={styles.approachDetail}>
                                Relative Velocity: {Math.round(parseFloat(approach.relative_velocity.kilometers_per_hour))} km/h
                            </Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => {/* Open NASA JPL URL */}}>
                    <Text style={styles.linkButtonText}>View on NASA JPL Website</Text>
                    <Ionicons name="open-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: 8,
    },
    content: {
        padding: 20,
        marginTop: 60,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    hazardousTag: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    hazardousText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    approachCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 20,
    },
    approachTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    approachItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    approachDate: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    approachDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        gap: 8,
    },
    linkButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    shareButton: {
        marginRight: 15,
    },
});