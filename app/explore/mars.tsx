import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchRoverManifest } from '../store/slices/marsSlice';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

const ROVERS = ['Curiosity', 'Perseverance', 'Opportunity', 'Spirit'];

export default function MarsScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { roverManifests, loading, error } = useSelector((state: RootState) => state.mars);

    const rovers = Object.values(roverManifests);

    const fetchRovers = () => {
        ROVERS.forEach(rover => {
            dispatch(fetchRoverManifest(rover.toLowerCase()) as any);
        });
    };

    useEffect(() => {
        fetchRovers();
    }, [dispatch]);

    if (loading && rovers.length === 0) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchRovers} />;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <FlatList
                data={rovers}
                keyExtractor={(item) => item.name}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchRovers} />
                }
                ListHeaderComponent={
                    <Text style={styles.header}>Mars Rovers</Text>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.roverCard}
                        onPress={() => router.push(`/mars/rover/${item.name.toLowerCase()}`)}
                    >
                        <View style={styles.roverInfo}>
                            <Text style={styles.roverName}>{item.name}</Text>
                            <Text style={[
                                styles.status,
                                { color: item.status === 'active' ? '#34C759' : '#FF3B30' }
                            ]}>
                                {item.status.toUpperCase()}
                            </Text>
                            <Text style={styles.detail}>Launch Date: {item.launch_date}</Text>
                            <Text style={styles.detail}>Landing Date: {item.landing_date}</Text>
                            <Text style={styles.detail}>Total Photos: {item.total_photos.toLocaleString()}</Text>
                            <Text style={styles.detail}>Last Photo: {item.max_date}</Text>
                        </View>
                    </TouchableOpacity>
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
    roverCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    roverInfo: {
        padding: 20,
    },
    roverName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    detail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
});