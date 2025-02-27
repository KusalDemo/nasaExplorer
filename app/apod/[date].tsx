import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchApod } from '../store/slices/apodSlice';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export default function APODDetailsScreen() {
    const { date } = useLocalSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { currentApod, loading, error } = useSelector((state: RootState) => state.apod);

    useEffect(() => {
        dispatch(fetchApod(date as string) as any);
    }, [date, dispatch]);

    const handleShare = async () => {
        if (currentApod) {
            try {
                await Share.share({
                    title: currentApod.title,
                    message: `Check out NASA's Astronomy Picture of the Day: ${currentApod.title}\n\n${currentApod.explanation}\n\n${currentApod.url}`,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRetry = () => {
        dispatch(fetchApod(date as string) as any);
    };

    if (loading) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={handleRetry} />;
    if (!currentApod) return null;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Stack.Screen
                options={{
                    title: format(new Date(currentApod.date), 'MMMM d, yyyy'),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                            <Ionicons name="share-outline" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Image
                source={{ uri: currentApod.url }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <Text style={styles.title}>{currentApod.title}</Text>
                <Text style={styles.explanation}>{currentApod.explanation}</Text>
                {currentApod.copyright && (
                    <Text style={styles.copyright}>© {currentApod.copyright}</Text>
                )}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    explanation: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    copyright: {
        marginTop: 16,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    shareButton: {
        marginRight: 15,
    },
});