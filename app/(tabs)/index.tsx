import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { format } from 'date-fns';
import { setArticles } from '../store/slices/articleSlice';

const DUMMY_ARTICLE = {
    id: '1',
    title: 'Understanding the James Webb Space Telescope',
    content: 'The James Webb Space Telescope (JWST) is the largest and most powerful space telescope ever built...',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
    authorId: '1',
    authorName: 'Kusal Gunasekara',
    createdAt: new Date().toISOString(),
    likes: 42,
    dislikes: 3,
};

export default function ArticlesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const articles = useSelector((state: RootState) => state.articles.articles);

    useEffect(() => {
        // Initialize with dummy article
        dispatch(setArticles([DUMMY_ARTICLE]));
    }, []);

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
    createButton: {
        backgroundColor: '#007AFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    articleImage: {
        width: '100%',
        height: 200,
    },
    articleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    }
});