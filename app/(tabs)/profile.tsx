import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/userSlice';
import { format } from 'date-fns';

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.currentUser);
    const userArticles = useSelector((state: RootState) => state.articles.articles);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: user?.avatar || 'https://img.freepik.com/free-vector/cute-cool-astronaut-wearing-jacket-cartoon-vector-icon-illustration-science-fashion-icon-isolated_138676-6960.jpg?semt=ais_hybrid' }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.articlesSection}>
                <Text style={styles.sectionTitle}>My Articles</Text>

                <FlatList
                    data={userArticles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.articleCard}>
                            <Image source={{ uri: item.imageUrl }} style={styles.articleImage} />
                            <View style={styles.articleContent}>
                                <Text style={styles.articleTitle}>{item.title}</Text>
                                <Text style={styles.articleDate}>
                                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                </Text>

                                <View style={styles.articleActions}>
                                    <Link href={`/article/edit/${item._id}`} asChild>
                                        <TouchableOpacity style={styles.actionButton}>
                                            <Ionicons name="create" size={20} color="#007AFF" />
                                            <Text style={styles.actionText}>Edit</Text>
                                        </TouchableOpacity>
                                    </Link>

                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.deleteButton]}
                                        onPress={() => {/* Handle delete */}}>
                                        <Ionicons name="trash" size={20} color="#FF3B30" />
                                        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#f8f8f8',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    logoutButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    articlesSection: {
        flex: 1,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    articleCard: {
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    articleImage: {
        width: '100%',
        height: 150,
    },
    articleContent: {
        padding: 15,
    },
    articleTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    articleDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    articleActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },
    actionText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#FFF3F3',
    },
    deleteText: {
        color: '#FF3B30',
    },
});