import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

function RootLayoutNav() {
    const segments = useSegments();
    const router = useRouter();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/login');
        } else if (isAuthenticated && inAuthGroup) {
            router.replace('/');
        }
    }, [isAuthenticated, segments]);

    return (
        <>

        </>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <RootLayoutNav />
        </Provider>
    );
}