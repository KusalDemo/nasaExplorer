import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const FEATURES = [
    {
        id: 'apod',
        title: 'Astronomy Picture of the Day',
        icon: 'planet',
        description: 'Discover the cosmos! Each day a different image or photograph of our fascinating universe.',
        href: '/explore/apod',
    }
];

export default function ExploreScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Explore Space</Text>
            <Text style={styles.subtitle}>Discover the wonders of our universe</Text>

            <View style={styles.grid}>
                {FEATURES.map((feature) => (
                    <Link key={feature.id} href={feature.href} asChild>
                        <TouchableOpacity style={styles.card}>
                            <Ionicons name={feature.icon as any} size={32} color="#007AFF" />
                            <Text style={styles.title}>{feature.title}</Text>
                            <Text style={styles.description}>{feature.description}</Text>
                            <View style={styles.arrow}>
                                <Ionicons name="arrow-forward" size={20} color="#007AFF" />
                            </View>
                        </TouchableOpacity>
                    </Link>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    grid: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    arrow: {
        position: 'absolute',
        right: 20,
        top: '50%',
        marginTop: -10,
    },
});