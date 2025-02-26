import { Stack } from 'expo-router';

export default function ExploreLayout() {
    return (
        <Stack>
            <Stack.Screen name="apod" options={{
                title: 'Astronomy Picture',
                presentation: 'card',
            }} />
        </Stack>
    );
}