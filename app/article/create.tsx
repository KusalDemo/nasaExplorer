import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { addArticle, updateArticle } from '../store/slices/articleSlice';
import { RootState } from '../store/store';

export default function CreateArticleScreen() {
    const { id } = useLocalSearchParams(); // For edit mode
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.currentUser);
    const articles = useSelector((state: RootState) => state.articles.articles);

    // Pre-fill form if in edit mode
    useEffect(() => {
        if (id) {
            const article = articles.find((a) => a._id === id);
            if (article) {
                setTitle(article.title);
                setContent(article.content);
                setImageUrl(article.imageUrl);
            }
        }
    }, [id, articles]);

    const handleSubmit = () => {
        if (!title || !content || !imageUrl) {
            setError('Please fill in all fields');
            return;
        }

        const articleData = {
            title,
            content,
            imageUrl,
            authorId: user?._id || '',
            authorName: user?.name || '',
            createdAt: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
            comments: [],
        };

        if (id) {
            // Update existing article
            dispatch(updateArticle({ articleId: id as string, articleData }));
        } else {
            // Add new article
            dispatch(addArticle(articleData));
        }

        router.back();
    };

    return (
        <ScrollView style={styles.container}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Article Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Cover Image URL"
                value={imageUrl}
                onChangeText={setImageUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Write your article..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>
                    {id ? 'Update Article' : 'Publish Article'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    error: {
        color: '#FF3B30',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    contentInput: {
        height: 300,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});