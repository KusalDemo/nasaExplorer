import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { addArticle } from '../store/slices/articleSlice';
import { RootState } from '../store/store';
import * as ImagePicker from 'expo-image-picker';

export default function CreateArticleScreen() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.currentUser);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            setImageUrl(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!title || !content || !imageUrl) {
            setError('Please fill in all fields');
            return;
        }

        const newArticle = {
            id: Date.now().toString(),
            title,
            content,
            imageUrl,
            authorId: user?.id || '',
            authorName: user?.name || '',
            createdAt: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
        };

        dispatch(addArticle(newArticle));
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

            <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                <Text style={styles.imageButtonText}>
                    {imageUrl ? 'Change Cover Image' : 'Add Cover Image'}
                </Text>
            </TouchableOpacity>

            <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Write your article..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Publish Article</Text>
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
    imageButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    imageButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
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