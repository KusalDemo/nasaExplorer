import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NearEarthObject } from '../../types/api';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';
import { format } from 'date-fns';
import {getNearEarthObjects} from "../../utils/api";

export default function AsteroidDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [asteroid, setAsteroid] = useState<NearEarthObject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAsteroid = async () => {
        try {
            setError(null);
            const endDate = format(new Date(), 'yyyy-MM-dd');
            const startDate = format(new Date(), 'yyyy-MM-dd');
            const asteroids = await getNearEarthObjects(startDate, endDate);
            const found = asteroids.find(a => a.id === id);
            if (found) {
                setAsteroid(found);
            } else {
                setError('Asteroid not found');
            }
        } catch (err) {
            setError('Failed to load asteroid details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAsteroid();
    }, [id]);

    const handleShare = async () => {
        if (asteroid) {
            try {
                await Share.share({
                    title: `Near Earth Object - ${asteroid.name}`,
                    message: `Check out this Near Earth Object!\n\nName: ${asteroid.name}\nDiameter: ${Math.round(asteroid.estimated_diameter.kilometers.estimated_diameter_min)} - ${Math.round(asteroid.estimated_diameter.kilometers.estimated_diameter_max)} km\nPotentially Hazardous: ${asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}\n\nMore info: ${asteroid.nasa_jpl_url}`,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchAsteroid} />;
    if (!asteroid) return null;

    return (
        <ScrollView style={styles.container}>
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
                <Text style={styles.name}>{asteroid.name}</Text>

                {asteroid.is_potentially_hazardous_asteroid && (
                    <View style={styles.hazardousTag}>
                        <Text style={styles.hazardousText}>⚠️ Potentially Hazardous</Text>
                    </View>
                )}

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Estimated Diameter</Text>
                    <Text style={styles.value}>
                        {Math.round(asteroid.estimated_diameter.kilometers.estimated_diameter_min)} - {Math.round(asteroid.estimated_diameter.kilometers.estimated_diameter_max)} km
                    </Text>

                    <Text style={styles.label}>Absolute Magnitude</Text>
                    <Text style={styles.value}>{asteroid.absolute_magnitude_h}</Text>
                </View>

                <View style={styles.approachCard}>
                    <Text style={styles.approachTitle}>Close Approach Data</Text>
                    {asteroid.close_approach_data.map((approach, index) => (
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
    content: {
        padding: 20,
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