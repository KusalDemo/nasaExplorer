import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Share, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchRoverPhotos, setSelectedPhoto } from '../../store/slices/marsSlice';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';

export default function PhotoDetailsScreen() {
    const { id } = useLocalSearchParams();
    const photoId = id as string;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();
    const router = useRouter();
    const navigation = useNavigation(); // Get navigation instance
    const { roverPhotos, selectedPhoto } = useSelector((state: RootState) => state.mars);

    useEffect(() => {
        if (selectedPhoto) {
            navigation.setOptions({ title: selectedPhoto.camera.full_name });
        }
    }, [selectedPhoto, navigation]);

    // Flatten all rover photos to search for the specific photo
    const allPhotos = Object.values(roverPhotos).flat();

    const findPhoto = () => {
        const photo = allPhotos.find(p => p.id.toString() === photoId);
        if (photo) {
            dispatch(setSelectedPhoto(photo));
            setLoading(false);
        } else {
            dispatch(fetchRoverPhotos({ rover: 'curiosity', sol: 1000 }) as any)
                .then(() => {
                    const newPhoto = allPhotos.find(p => p.id.toString() === photoId);
                    if (newPhoto) {
                        dispatch(setSelectedPhoto(newPhoto));
                    } else {
                        setError('Photo not found');
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError('Failed to load photo');
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        findPhoto();
    }, [photoId, dispatch]);

    const handleShare = async () => {
        if (selectedPhoto) {
            try {
                await Share.share({
                    title: `Mars Rover Photo - ${selectedPhoto.camera.full_name}`,
                    message: `Check out this Mars photo taken by ${selectedPhoto.rover.name}'s ${selectedPhoto.camera.full_name} on Sol ${selectedPhoto.sol}!\n\n${selectedPhoto.img_src}`,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={findPhoto} />;
    if (!selectedPhoto) return null;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Image
                source={{ uri: selectedPhoto.img_src }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{selectedPhoto.camera.full_name}</Text>
                    <TouchableOpacity onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Rover</Text>
                    <Text style={styles.value}>{selectedPhoto.rover.name}</Text>

                    <Text style={styles.label}>Camera</Text>
                    <Text style={styles.value}>{selectedPhoto.camera.full_name}</Text>

                    <Text style={styles.label}>Sol</Text>
                    <Text style={styles.value}>{selectedPhoto.sol}</Text>

                    <Text style={styles.label}>Earth Date</Text>
                    <Text style={styles.value}>{selectedPhoto.earth_date}</Text>
                </View>

                <View style={styles.roverInfo}>
                    <Text style={styles.roverInfoTitle}>About {selectedPhoto.rover.name}</Text>
                    <Text style={styles.roverInfoText}>
                        Launch Date: {selectedPhoto.rover.launch_date}
                    </Text>
                    <Text style={styles.roverInfoText}>
                        Landing Date: {selectedPhoto.rover.landing_date}
                    </Text>
                    <Text style={styles.roverInfoText}>
                        Status: {selectedPhoto.rover.status.toUpperCase()}
                    </Text>
                </View>
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
        image: {
            width: '100%',
            height: 300,
        },
        content: {
            padding: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        title: {
            flex: 1,
            fontSize: 24,
            fontWeight: 'bold',
            marginRight: 10,
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
            fontWeight: 'bold',
            marginBottom: 10,
        },
        roverInfo: {
            backgroundColor: '#f8f8f8',
            borderRadius: 12,
            padding: 15,
            marginBottom: 20,
        },
        roverInfoTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        roverInfoText: {
            fontSize: 16,
            marginBottom: 5,
        },
    }
)