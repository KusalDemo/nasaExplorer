import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Share, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMarsRoverPhotos } from '../../utils/api';
import { MarsRoverPhoto } from '../../types/api';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';

export default function PhotoDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [photo, setPhoto] = useState<MarsRoverPhoto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPhoto = async () => {
        try {
            setError(null);
            const photos = await getMarsRoverPhotos('curiosity', 1000);
            const foundPhoto = photos.find(p => p.id.toString() === id);
            if (foundPhoto) {
                setPhoto(foundPhoto);
            } else {
                setError('Photo not found');
            }
        } catch (err) {
            setError('Failed to load photo details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhoto();
    }, [id]);

    const handleShare = async () => {
        if (photo) {
            try {
                await Share.share({
                    title: `Mars Rover Photo - ${photo.camera.full_name}`,
                    message: `Check out this Mars photo taken by ${photo.rover.name}'s ${photo.camera.full_name} on Sol ${photo.sol}!\n\n${photo.img_src}`,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchPhoto} />;
    if (!photo) return null;

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: photo.camera.full_name,
                    headerRight: () => (
                        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                            <Ionicons name="share-outline" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Image
                source={{ uri: photo.img_src }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.label}>Rover</Text>
                    <Text style={styles.value}>{photo.rover.name}</Text>

                    <Text style={styles.label}>Camera</Text>
                    <Text style={styles.value}>{photo.camera.full_name}</Text>

                    <Text style={styles.label}>Sol</Text>
                    <Text style={styles.value}>{photo.sol}</Text>

                    <Text style={styles.label}>Earth Date</Text>
                    <Text style={styles.value}>{photo.earth_date}</Text>
                </View>

                <View style={styles.roverInfo}>
                    <Text style={styles.roverInfoTitle}>About {photo.rover.name}</Text>
                    <Text style={styles.roverInfoText}>
                        Launch Date: {photo.rover.launch_date}
                    </Text>
                    <Text style={styles.roverInfoText}>
                        Landing Date: {photo.rover.landing_date}
                    </Text>
                    <Text style={styles.roverInfoText}>
                        Status: {photo.rover.status.toUpperCase()}
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
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: 20,
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
    roverInfo: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },

    roverInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    roverInfoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    shareButton: {
        marginRight: 15,
    },
});