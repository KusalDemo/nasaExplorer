import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchRoverManifest, fetchRoverPhotos } from '../../store/slices/marsSlice';
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
    const roverName = name as string;
    const [selectedCamera, setSelectedCamera] = useState('all');

    const dispatch = useDispatch();
    const router = useRouter();
    const { roverManifests, roverPhotos, loading, error } = useSelector((state: RootState) => state.mars);

    const manifest = roverManifests[roverName];
    const photos = roverPhotos[roverName] || [];

    const fetchData = async () => {
        await dispatch(fetchRoverManifest(roverName) as any);
        if (manifest) {
            dispatch(fetchRoverPhotos({
                rover: roverName,
                sol: manifest.max_sol,
                camera: selectedCamera === 'all' ? undefined : selectedCamera
            }) as any);
        }
    };

    useEffect(() => {
        fetchData();
    }, [roverName, dispatch]);

    useEffect(() => {
        if (manifest) {
            dispatch(fetchRoverPhotos({
                rover: roverName,
                sol: manifest.max_sol,
                camera: selectedCamera === 'all' ? undefined : selectedCamera
            }) as any);
        }
    }, [selectedCamera, manifest]);

    if (loading && !manifest) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchData} />;
    if (!manifest) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <FlatList
                data={photos}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchData} />
                }
                ListHeaderComponent={
                    <View>
                        <Text style={styles.header}>{manifest.name} Rover</Text>
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
                    <TouchableOpacity
                        style={styles.photoContainer}
                        onPress={() => router.push(`/mars/photo/${item.id}`)}
                    >
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
    statsContainer: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        marginBottom: 10,
        marginHorizontal: 20,
        borderRadius: 12,
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
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    cameraButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
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
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
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
        fontWeight: '600',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
});