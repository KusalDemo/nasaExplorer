import { Stack } from 'expo-router';

export default function ExploreLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="apod" options={{ title: 'Astronomy Picture', presentation: 'card' }} />
            <Stack.Screen name="mars" options={{ title: 'Mars Rovers', presentation: 'card' }} />
            <Stack.Screen name="earth" options={{ title: 'Earth Imagery', presentation: 'card' }} />
            <Stack.Screen name="asteroids" options={{ title: 'Near Earth Objects', presentation: 'card' }} />
            <Stack.Screen name="gallery" options={{ title: 'Space Gallery', presentation: 'card' }} />
        </Stack>
    );
}
