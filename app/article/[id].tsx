import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
// import { updateArticle } from '../store/slices/articleSlice';
import { addComment } from '../store/slices/commentSlice';

export default function ArticleScreen() {
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch();
    const article = useSelector((state: RootState) =>
        state.articles.articles.find(a => a._id === id)
    );
    const user = useSelector((state: RootState) => state.user.currentUser);
    const comments = useSelector((state: RootState) =>
        state.comments.comments[id as string] || []
    );

    const [newComment, setNewComment] = useState('');

    if (!article) return null;

    /*const handleLike = () => {
        dispatch(updateArticle({
            ...article,
            likes: article.likes + 1,
            userLiked: true,
            userDisliked: false,
        }));
    };

    const handleDislike = () => {
        dispatch(updateArticle({
            ...article,
            dislikes: article.dislikes + 1,
            userLiked: false,
            userDisliked: true,
        }));
    };*/

    const handleComment = () => {
        if (!newComment.trim()) return;

        dispatch(addComment({
            id: Date.now().toString(),
            articleId: article._id,
            userId: user?._id || '',
            userName: user?.name || '',
            content: newComment,
            createdAt: new Date().toISOString(),
        }));
        setNewComment('');
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: article.imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <Text style={styles.title}>{article.title}</Text>
                <Text style={styles.meta}>
                    By {article.authorName} • {format(new Date(article.createdAt), 'MMM d, yyyy')}
                </Text>

                <Text style={styles.articleText}>{article.content}</Text>

                <View style={styles.actions}>
                    {/*<TouchableOpacity
                        style={[styles.actionButton, article.userLiked && styles.activeButton]}
                        onPress={handleLike}>
                        <Ionicons name="thumbs-up" size={20} color={article.userLiked ? '#fff' : '#666'} />
                        <Text style={[styles.actionText, article.userLiked && styles.activeText]}>
                            {article.likes}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, article.userDisliked && styles.activeButton]}
                        onPress={handleDislike}>
                        <Ionicons name="thumbs-down" size={20} color={article.userDisliked ? '#fff' : '#666'} />
                        <Text style={[styles.actionText, article.userDisliked && styles.activeText]}>
                            {article.dislikes}
                        </Text>
                    </TouchableOpacity>*/}
                </View>

                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comments</Text>

                    <View style={styles.commentInput}>
                        <TextInput
                            style={styles.input}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                        />
                        <TouchableOpacity style={styles.commentButton} onPress={handleComment}>
                            <Text style={styles.commentButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>

                    {comments.map((comment) => (
                        <View key={comment.id} style={styles.comment}>
                            <Text style={styles.commentAuthor}>{comment.userName}</Text>
                            <Text style={styles.commentText}>{comment.content}</Text>
                            <Text style={styles.commentDate}>
                                {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                            </Text>
                        </View>
                    ))}
                </View>
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
        marginBottom: 10,
    },
    meta: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    articleText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 30,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        gap: 5,
    },
    activeButton: {
        backgroundColor: '#007AFF',
    },
    actionText: {
        color: '#666',
        fontSize: 14,
    },
    activeText: {
        color: '#fff',
    },
    commentsSection: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 20,
    },
    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    commentInput: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    commentButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 15,
        justifyContent: 'center',
        borderRadius: 8,
    },
    commentButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    comment: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    commentAuthor: {
        fontWeight: '600',
        marginBottom: 5,
    },
    commentText: {
        fontSize: 14,
        marginBottom: 5,
    },
    commentDate: {
        fontSize: 12,
        color: '#666',
    },
});