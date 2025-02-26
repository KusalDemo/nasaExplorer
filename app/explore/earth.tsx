import { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { getEarthImagery } from '../utils/api';
import { EarthImage } from '../types/api';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export default function EarthScreen() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState<EarthImage | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!latitude || !longitude || !date) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getEarthImagery(
                parseFloat(latitude),
                parseFloat(longitude),
                date
            );
            setImage(data);
        } catch (err) {
            setError('Failed to load Earth imagery');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Earth Imagery</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Latitude (e.g., 36.098592)"
                    value={latitude}
                    onChangeText={setLatitude}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Longitude (e.g., -112.097796)"
                    value={longitude}
                    onChangeText={setLongitude}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Date (YYYY-MM-DD)"
                    value={date}
                    onChangeText={setDate}
                />
                <TouchableOpacity style={styles.button} onPress={handleSearch}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {loading && <LoadingView />}
            {error && <ErrorView message={error} />}

            {image && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: image.url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={styles.caption}>{image.caption}</Text>
                </View>
            )}
        </ScrollView>
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
    form: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imageContainer: {
        padding: 20,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 12,
    },
    caption: {
        fontSize: 14,
        color: '#666',
        marginTop: 12,
        textAlign: 'center',
    },
});