import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { format } from 'date-fns';

export default function ArticlesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const articles = useSelector((state: RootState) => state.articles.articles);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                </View>

                <Link href="/article/create" asChild>
                    <TouchableOpacity style={styles.createButton}>
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </Link>
            </View>

            <FlatList
                data={filteredArticles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link href={`/article/${item.id}`} asChild>
                        <TouchableOpacity style={styles.articleCard}>
                            <Image source={{ uri: item.imageUrl }} style={styles.articleImage} />
                            <View style={styles.articleContent}>
                                <Text style={styles.articleTitle}>{item.title}</Text>
                                <Text style={styles.articleMeta}>
                                    By {item.authorName} • {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                </Text>
                                <View style={styles.articleStats}>
                                    <View style={styles.stat}>
                                        <Ionicons name="thumbs-up" size={16} color="#666" />
                                        <Text style={styles.statText}>{item.likes}</Text>
                                    </View>
                                    <View style={styles.stat}>
                                        <Ionicons name="thumbs-down" size={16} color="#666" />
                                        <Text style={styles.statText}>{item.dislikes}</Text>
                                    </View>
                                </View>
                            </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        padding: 10,
        fontSize: 16,
    },
    searchIcon: {
        padding: 10,
    },
    createButton: {
        backgroundColor: '#007AFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    articleCard: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
    },
    articleStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    }
});