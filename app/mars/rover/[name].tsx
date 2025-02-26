import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, Link, Stack } from 'expo-router';
import { getMarsRoverPhotos, getRoverManifest } from '../../utils/api';
import { MarsRoverPhoto, RoverManifest } from '../../types/api';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';

const CAMERAS = [
    { id: 'all', name: 'All Cameras' },
    { id: 'FHAZ', name: 'Front Hazard' },
    { id: 'RHAZ', name: 'Rear Hazard' },
    { id: 'MAST', name: 'Mast' },
    { id: 'CHEMCAM', name: 'Chemistry' },
    { id: 'MAHLI', name: 'Hand Lens' },
    { id: 'MARDI', name: 'Descent' },
    { id: 'NAVCAM', name: 'Navigation' },
];

export default function RoverDetailsScreen() {
    const { name } = useLocalSearchParams();
    const [manifest, setManifest] = useState<RoverManifest | null>(null);
    const [photos, setPhotos] = useState<MarsRoverPhoto[]>([]);
    const [selectedCamera, setSelectedCamera] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            setError(null);
            const manifestData = await getRoverManifest(name as string);
            setManifest(manifestData);

            const photosData = await getMarsRoverPhotos(
                name as string,
                manifestData.max_sol,
                selectedCamera === 'all' ? undefined : selectedCamera
            );
            setPhotos(photosData);
        } catch (err) {
            setError('Failed to load rover data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [name, selectedCamera]);

    if (loading && !refreshing) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchData} />;
    if (!manifest) return null;

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: manifest.name,
                    headerTitleStyle: styles.headerTitle,
                }}
            />

            <FlatList
                data={photos}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
                }
                ListHeaderComponent={
                    <View>
                        <View style={styles.statsContainer}>
                            <Text style={styles.statsTitle}>Mission Stats</Text>
                            <Text style={styles.statsText}>Status: {manifest.status.toUpperCase()}</Text>
                            <Text style={styles.statsText}>
                                Total Photos: {manifest.total_photos.toLocaleString()}
                            </Text>
                            <Text style={styles.statsText}>Last Photo: {manifest.max_date}</Text>
                        </View>

                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.cameraList}
                            data={CAMERAS}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.cameraButton,
                                        selectedCamera === item.id && styles.selectedCamera,
                                    ]}
                                    onPress={() => setSelectedCamera(item.id)}>
                                    <Text style={[
                                        styles.cameraButtonText,
                                        selectedCamera === item.id && styles.selectedCameraText,
                                    ]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                }
                renderItem={({ item }) => (
                    <Link href={`/mars/photo/${item.id}`} asChild>
                        <TouchableOpacity style={styles.photoContainer}>
                            <Image
                                source={{ uri: item.img_src }}
                                style={styles.photo}
                                resizeMode="cover"
                            />
                            <View style={styles.photoInfo}>
                                <Text style={styles.camera}>{item.camera.full_name}</Text>
                                <Text style={styles.date}>Sol: {item.sol}</Text>
                                <Text style={styles.date}>Earth Date: {item.earth_date}</Text>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statsContainer: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        marginBottom: 10,
    },
    statsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    cameraList: {
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    cameraButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    selectedCamera: {
        backgroundColor: '#007AFF',
    },
    cameraButtonText: {
        fontSize: 14,
        color: '#666',
    },
    selectedCameraText: {
        color: '#fff',
    },
    photoContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: 200,
    },
    photoInfo: {
        padding: 15,
    },
    camera: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
});