import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { format, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchAsteroids } from '../store/slices/asteroidsSlice';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export default function AsteroidsScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { asteroids, loading, error } = useSelector((state: RootState) => state.asteroids);

    const fetchAsteroidsData = () => {
        const endDate = format(new Date(), 'yyyy-MM-dd');
        const startDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        dispatch(fetchAsteroids({ startDate, endDate }) as any);
    };

    useEffect(() => {
        fetchAsteroidsData();
    }, [dispatch]);

    if (loading && asteroids.length === 0) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchAsteroidsData} />;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <FlatList
                data={asteroids}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchAsteroidsData} />
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
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: 8,
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