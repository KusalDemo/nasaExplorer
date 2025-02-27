import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchApod } from '../store/slices/apodSlice';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export default function APODScreen() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { currentApod, loading, error } = useSelector((state: RootState) => state.apod);

    useEffect(() => {
        dispatch(fetchApod() as any);
    }, [dispatch]);

    const handleShare = async () => {
        if (currentApod) {
            try {
                await Share.share({
                    title: currentApod.title,
                    message: `${currentApod.title}\n\n${currentApod.explanation}\n\n${currentApod.url}`,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRetry = () => {
        dispatch(fetchApod() as any);
    };

    if (loading) return <LoadingView />;
    if (error) return <ErrorView message={error} onRetry={handleRetry} />;
    if (!currentApod) return null;

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Image
                source={{ uri: currentApod.url }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{currentApod.title}</Text>
                    <TouchableOpacity onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.date}>{currentApod.date}</Text>
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