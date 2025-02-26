import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { getRoverManifest } from '../utils/api';
import { RoverManifest } from '../types/api';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

const ROVERS = ['Curiosity', 'Perseverance', 'Opportunity', 'Spirit'];

export default function MarsScreen() {
    const [rovers, setRovers] = useState<RoverManifest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRovers = async () => {
        try {
            setError(null);
            const manifests = await Promise.all(
                ROVERS.map(rover => getRoverManifest(rover.toLowerCase()))
            );
            setRovers(manifests);
        } catch (err) {
            setError('Failed to load Mars rovers');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRovers();
    }, []);

    if (loading && !refreshing) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchRovers} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={rovers}
                keyExtractor={(item) => item.name}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchRovers} />
                }
                ListHeaderComponent={
                    <Text style={styles.header}>Mars Rovers</Text>
                }
                renderItem={({ item }) => (
                    <Link href={`/mars/rover/${item.name.toLowerCase()}`} asChild>
                        <TouchableOpacity style={styles.roverCard}>
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
                    </Link>
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