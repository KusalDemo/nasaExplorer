import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Share } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { format } from 'date-fns';
import { APOD } from '../types/api';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import {getAPOD} from "../util/api";

export default function APODDetailsScreen() {
    const { date } = useLocalSearchParams();
    const [apod, setApod] = useState<APOD | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAPOD();
    }, [date]);

    const fetchAPOD = async () => {
        try {
            setError(null);
            const data = await getAPOD(date as string);
            setApod(data);
        } catch (err) {
            setError('Failed to load image details');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (apod) {
            try {
                await Share.share({
                    title: apod.title,
                    message: `Check out NASA's Astronomy Picture of the Day: ${apod.title}\n\n${apod.explanation}\n\n${apod.url}`,
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
            <Stack.Screen
                options={{
                    title: format(new Date(apod.date), 'MMMM d, yyyy')
                }}
            />
            <Image
                source={{ uri: apod.url }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.content}>
                <Text style={styles.title}>{apod.title}</Text>
                <Text style={styles.explanation}>{apod.explanation}</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    explanation: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    }
});