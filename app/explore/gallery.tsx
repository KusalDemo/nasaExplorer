import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { format, subDays } from 'date-fns';
import { getAPODRange } from '../utils/api';
import { APOD } from '../types/api';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export default function GalleryScreen() {
    const [images, setImages] = useState<APOD[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchImages = async () => {
        try {
            setError(null);
            const endDate = format(new Date(), 'yyyy-MM-dd');
            const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
            const data = await getAPODRange(startDate, endDate);
            setImages(data.reverse());
        } catch (err) {
            setError('Failed to load gallery images');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    if (loading && !refreshing) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchImages} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={images}
                numColumns={2}
                keyExtractor={(item) => item.date}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchImages} />
                }
                ListHeaderComponent={
                    <Text style={styles.header}>Astronomy Gallery</Text>
                }
                renderItem={({ item }) => (
                    <Link href={`/apod/${item.date}`} asChild>
                        <TouchableOpacity style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.url }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <Text style={styles.date}>{format(new Date(item.date), 'MMM d')}</Text>
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
    imageContainer: {
        flex: 1,
        margin: 4,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    date: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#fff',
        padding: 4,
        borderRadius: 4,
        fontSize: 12,
    },
});