import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAPOD } from '../utils/api';
import { APOD } from '../types/api';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export default function APODScreen() {
    const [apod, setApod] = useState<APOD | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchAPOD();
    }, []);

    const fetchAPOD = async () => {
        try {
            setError(null);
            const data = await getAPOD();
            setApod(data);
        } catch (err) {
            setError('Failed to load astronomy picture');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (apod) {
            try {
                await Share.share({
                    title: apod.title,
                    message: `${apod.title}\n\n${apod.explanation}\n\n${apod.url}`,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={fetchAPOD} />;
    if (!apod) return null;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Image
                source={{ uri: apod.url }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{apod.title}</Text>
                    <TouchableOpacity onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.date}>{apod.date}</Text>
                <Text style={styles.explanation}>{apod.explanation}</Text>

                {apod.copyright && (
                    <Text style={styles.copyright}>© {apod.copyright}</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 10,
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    explanation: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 20,
    },
    copyright: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});