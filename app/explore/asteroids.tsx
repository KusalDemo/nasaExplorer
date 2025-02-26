import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { format, subDays } from 'date-fns';
import { getNearEarthObjects } from '../utils/api';
import { NearEarthObject } from '../types/api';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export default function AsteroidsScreen() {
    const [asteroids, setAsteroids] = useState<NearEarthObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAsteroids = async () => {
        try {
            setError(null);
            const endDate = format(new Date(), 'yyyy-MM-dd');
            const startDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');
            const data = await getNearEarthObjects(startDate, endDate);
            setAsteroids(data);
        } catch (err) {
            setError('Failed to load Near Earth Objects');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAsteroids();
    }, []);

    if (loading && !refreshing) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchAsteroids} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={asteroids}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchAsteroids} />
                }
                ListHeaderComponent={
                    <Text style={styles.header}>Near Earth Objects</Text>
                }
                renderItem={({ item }) => (
                    <View style={[
                        styles.asteroidCard,
                        item.is_potentially_hazardous_asteroid && styles.hazardousCard
                    ]}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.detail}>
                            Diameter: {Math.round(item.estimated_diameter.kilometers.estimated_diameter_min)} - {Math.round(item.estimated_diameter.kilometers.estimated_diameter_max)} km
                        </Text>
                        {item.close_approach_data[0] && (
                            <>
                                <Text style={styles.detail}>
                                    Closest Approach: {item.close_approach_data[0].close_approach_date}
                                </Text>
                                <Text style={styles.detail}>
                                    Miss Distance: {Math.round(parseFloat(item.close_approach_data[0].miss_distance.kilometers)).toLocaleString()} km
                                </Text>
                                <Text style={styles.detail}>
                                    Velocity: {Math.round(parseFloat(item.close_approach_data[0].relative_velocity.kilometers_per_hour))} km/h
                                </Text>
                            </>
                        )}
                        {item.is_potentially_hazardous_asteroid && (
                            <View style={styles.hazardousTag}>
                                <Text style={styles.hazardousText}>⚠️ Potentially Hazardous</Text>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    asteroidCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    hazardousCard: {
        backgroundColor: '#FFF3F3',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    detail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    hazardousTag: {
        marginTop: 8,
        padding: 6,
        backgroundColor: '#FF3B30',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    hazardousText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});